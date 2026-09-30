import crypto from 'node:crypto';
import {
  calculateProductUnitPrice,
  getProduct,
  isCheckoutEligible,
  selectionLabels,
  validateSelections,
} from '../src/data/products.js';

const SQUARE_VERSION = '2026-09-16';
const MAX_ITEMS = 50;
const MAX_QUANTITY = 25;
const MAX_BODY_CHARS = 20000;

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function squareBaseUrl(environment) {
  if (environment === 'sandbox') return 'https://connect.squareupsandbox.com';
  if (environment === 'production') return 'https://connect.squareup.com';
  return null;
}

function returnOrigin(request) {
  const configured = text(process.env.CHECKOUT_RETURN_ORIGIN);
  if (configured) {
    try {
      const url = new URL(configured);
      if (['http:', 'https:'].includes(url.protocol)) return url.origin;
    } catch {
      return null;
    }
    return null;
  }

  const host = text(request.headers['x-forwarded-host'] || request.headers.host);
  const protocol = text(request.headers['x-forwarded-proto']) || 'https';
  if (!host || !['http', 'https'].includes(protocol)) return null;
  return protocol + '://' + host;
}

function safeProviderCode(value) {
  return text(value).replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 80);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const body = request.body && typeof request.body === 'object' ? request.body : {};
  if (JSON.stringify(body).length > MAX_BODY_CHARS) {
    return response.status(413).json({ error: 'Cart request is too large.' });
  }

  if (!Array.isArray(body.items) || body.items.length < 1) {
    return response.status(400).json({ error: 'Cart is empty.' });
  }

  if (body.items.length > MAX_ITEMS) {
    return response.status(400).json({ error: 'Cart contains too many line items.' });
  }

  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = text(process.env.SQUARE_LOCATION_ID);
  const environment = text(process.env.SQUARE_ENVIRONMENT).toLowerCase();
  const baseUrl = squareBaseUrl(environment);
  const origin = returnOrigin(request);

  if (!accessToken || !locationId || !baseUrl || !origin) {
    console.error('Square checkout configuration missing or invalid:', {
      hasAccessToken: Boolean(accessToken),
      hasLocationId: Boolean(locationId),
      environmentConfigured: Boolean(baseUrl),
      returnOriginConfigured: Boolean(origin),
    });
    return response.status(503).json({
      error: 'Square checkout is not configured yet. Your cart has not been charged.',
      code: 'CHECKOUT_NOT_CONFIGURED',
    });
  }

  const lineItems = [];
  let askForShippingAddress = false;

  for (const rawItem of body.items) {
    const productId = text(rawItem?.productId);
    const product = getProduct(productId);
    const selections = rawItem?.selections && typeof rawItem.selections === 'object'
      ? rawItem.selections
      : {};
    const quantity = Number(rawItem?.quantity);

    if (!product) {
      return response.status(400).json({ error: 'Cart contains an unknown product.' });
    }
    if (!isCheckoutEligible(product)) {
      return response.status(400).json({ error: 'Cart contains an item that is not available for checkout.' });
    }
    if (!validateSelections(product, selections)) {
      return response.status(400).json({ error: 'Cart contains an unavailable or invalid product option.' });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return response.status(400).json({ error: 'Cart contains an invalid quantity.' });
    }

    const unitAmount = calculateProductUnitPrice(product, selections);
    if (!Number.isInteger(unitAmount) || unitAmount < 0) {
      return response.status(400).json({ error: 'Cart contains an item without an authoritative price.' });
    }

    const variants = selectionLabels(product, selections).map(([, value]) => value);
    const name = variants.length ? product.name + ' — ' + variants.join(' / ') : product.name;

    lineItems.push({
      name,
      quantity: String(quantity),
      base_price_money: {
        amount: unitAmount,
        currency: product.currency,
      },
    });

    if (product.fulfillment?.shippingRequired) askForShippingAddress = true;
  }

  const checkoutRequest = {
    idempotency_key: crypto.randomUUID(),
    order: {
      location_id: locationId,
      line_items: lineItems,
    },
    checkout_options: {
      redirect_url: origin + '/order/success',
      ask_for_shipping_address: askForShippingAddress,
    },
  };

  try {
    const squareResponse = await fetch(baseUrl + '/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'Square-Version': SQUARE_VERSION,
      },
      body: JSON.stringify(checkoutRequest),
    });

    const providerBody = await squareResponse.json().catch(() => ({}));

    if (!squareResponse.ok) {
      const firstError = Array.isArray(providerBody?.errors) ? providerBody.errors[0] : null;
      console.error('Square checkout creation failed:', {
        status: squareResponse.status,
        category: safeProviderCode(firstError?.category),
        code: safeProviderCode(firstError?.code),
      });
      return response.status(502).json({
        error: 'Square checkout could not be created. Your cart has not been charged.',
        code: 'CHECKOUT_CREATION_FAILED',
      });
    }

    const checkoutUrl = text(providerBody?.payment_link?.url);
    if (!checkoutUrl || !/^https:\/\//i.test(checkoutUrl)) {
      console.error('Square checkout response did not contain a valid hosted URL.');
      return response.status(502).json({
        error: 'Square did not return a usable checkout link. Your cart has not been charged.',
        code: 'CHECKOUT_URL_MISSING',
      });
    }

    return response.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('Square checkout request failed:', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    return response.status(502).json({
      error: 'Square checkout is temporarily unavailable. Your cart has not been charged.',
      code: 'CHECKOUT_UNAVAILABLE',
    });
  }
}

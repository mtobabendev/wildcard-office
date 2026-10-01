import { useEffect, useMemo, useState } from 'react';
import GarageHeader from './components/layout/GarageHeader.jsx';
import GarageFooter from './components/layout/GarageFooter.jsx';
import Garage from './pages/Garage.jsx';
import Services from './pages/Services.jsx';
import Merchandise from './pages/Merchandise.jsx';
import Marketplace from './pages/Marketplace.jsx';
import MarketplaceServiceDetail from './pages/MarketplaceServiceDetail.jsx';
import MarketplaceMerchDetail from './pages/MarketplaceMerchDetail.jsx';
import EvidenceLocker from './pages/EvidenceLocker.jsx';
import QuoteRequest from './pages/QuoteRequest.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import SecondChance from './pages/SecondChance.jsx';
import OrderReturn from './pages/OrderReturn.jsx';
import NotFound from './pages/NotFound.jsx';
import {
  buildCartKey,
  getProduct,
  products,
  validateSelections,
} from './data/products.js';
import { services } from './data/services.js';
import { getHostedMerch, getHostedService } from './data/marketplace.js';

const CART_STORAGE_KEY = 'penny-garage-cart-v1';
const MAX_CART_QUANTITY = 25;

function currentLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  };
}

function safeDecodeSlug(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function decodedRoute(type, encodedSlug) {
  const slug = safeDecodeSlug(encodedSlug);
  return slug === null ? { type: 'not-found' } : { type, slug };
}

function routeFor(pathname) {
  if (pathname === '/') return { type: 'garage' };
  if (pathname === '/services') return { type: 'services' };
  if (pathname === '/merch') return { type: 'merch' };
  if (pathname === '/marketplace') return { type: 'marketplace' };
  if (pathname === '/evidence') return { type: 'evidence' };
  if (pathname === '/quote') return { type: 'quote' };
  if (pathname === '/cart') return { type: 'cart' };
  if (pathname === '/second-chance') return { type: 'second-chance' };
  if (pathname === '/order/success') return { type: 'order-success' };
  if (pathname === '/order/cancel') return { type: 'order-cancel' };

  const marketServiceMatch = pathname.match(/^\/marketplace\/services\/([^/]+)$/);
  if (marketServiceMatch) return decodedRoute('market-service', marketServiceMatch[1]);

  const marketMerchMatch = pathname.match(/^\/marketplace\/merch\/([^/]+)$/);
  if (marketMerchMatch) return decodedRoute('market-merch', marketMerchMatch[1]);

  const merchMatch = pathname.match(/^\/merch\/([^/]+)$/);
  if (merchMatch) return decodedRoute('product', merchMatch[1]);

  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) return decodedRoute('service', serviceMatch[1]);

  return { type: 'not-found' };
}

function restoreCart() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];

    const merged = new Map();

    for (const item of parsed) {
      const product = getProduct(item?.productId);
      const quantity = Number(item?.quantity);
      const selections = item?.selections && typeof item.selections === 'object' ? item.selections : {};
      if (!product || !validateSelections(product, selections)) continue;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) continue;

      const key = buildCartKey(product.id, selections);
      const existing = merged.get(key);
      merged.set(key, {
        key,
        productId: product.id,
        selections,
        quantity: Math.min(MAX_CART_QUANTITY, (existing?.quantity || 0) + quantity),
      });
    }

    return [...merged.values()];
  } catch {
    return [];
  }
}

export default function App() {
  const [location, setLocation] = useState(currentLocation);
  const [cart, setCart] = useState(restoreCart);

  useEffect(() => {
    const onPopState = () => setLocation(currentLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart.map(({ productId, selections, quantity }) => ({ productId, selections, quantity }))),
      );
    } catch {
      // Cart remains usable in memory for this session if persistence is unavailable.
    }
  }, [cart]);

  const navigate = (href) => {
    const destination = new URL(href, window.location.origin);
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
    window.history.pushState({}, '', destination.pathname + destination.search);
    setLocation({ pathname: destination.pathname, search: destination.search });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const addToCart = ({ productId, quantity, selections }) => {
    const product = getProduct(productId);
    if (!product || !validateSelections(product, selections)) return;

    const safeQuantity = Math.min(MAX_CART_QUANTITY, Math.max(1, Number(quantity) || 1));
    const key = buildCartKey(product.id, selections);

    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) => item.key === key
          ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + safeQuantity) }
          : item);
      }
      return [...current, { key, productId: product.id, quantity: safeQuantity, selections }];
    });
  };

  const updateQuantity = (key, quantity) => {
    const safeQuantity = Math.min(MAX_CART_QUANTITY, Math.max(1, Number(quantity) || 1));
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: safeQuantity } : item));
  };

  const removeFromCart = (key) => setCart((current) => current.filter((item) => item.key !== key));
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const route = routeFor(location.pathname);

  let page;
  switch (route.type) {
    case 'garage':
      page = <Garage navigate={navigate} />;
      break;
    case 'services':
      page = <Services navigate={navigate} />;
      break;
    case 'merch':
      page = <Merchandise navigate={navigate} />;
      break;
    case 'marketplace':
      page = <Marketplace navigate={navigate} />;
      break;
    case 'evidence':
      page = <EvidenceLocker navigate={navigate} />;
      break;
    case 'quote':
      page = <QuoteRequest key={'quote:' + location.search} />;
      break;
    case 'cart':
      page = <Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} navigate={navigate} />;
      break;
    case 'second-chance':
      page = <SecondChance navigate={navigate} />;
      break;
    case 'order-success':
      page = <OrderReturn mode="success" navigate={navigate} />;
      break;
    case 'order-cancel':
      page = <OrderReturn mode="cancel" navigate={navigate} />;
      break;
    case 'market-service': {
      const listing = getHostedService(route.slug);
      page = listing
        ? <MarketplaceServiceDetail key={listing.id || listing.slug} listing={listing} />
        : <NotFound navigate={navigate} eyebrow="FOUNDER MARKETPLACE // SERVICE NOT FOUND" />;
      break;
    }
    case 'market-merch': {
      const listing = getHostedMerch(route.slug);
      page = listing
        ? <MarketplaceMerchDetail key={listing.id || listing.slug} listing={listing} />
        : <NotFound navigate={navigate} eyebrow="FOUNDER MARKETPLACE // MERCH NOT FOUND" />;
      break;
    }
    case 'product': {
      const product = products.find((item) => item.slug === route.slug);
      page = product
        ? <ProductDetail key={product.id || product.slug} product={product} addToCart={addToCart} navigate={navigate} />
        : <NotFound navigate={navigate} eyebrow="PARTS CAGE ERROR" />;
      break;
    }
    case 'service': {
      const service = services.find((item) => item.slug === route.slug);
      page = service
        ? <ServiceDetail key={service.id || service.slug} service={service} navigate={navigate} />
        : <NotFound navigate={navigate} eyebrow="WORK ORDER NOT FOUND" />;
      break;
    }
    default:
      page = <NotFound navigate={navigate} />;
  }

  return (
    <div className="site-shell">
      <GarageHeader pathname={location.pathname} cartCount={cartCount} navigate={navigate} />
      <main id="main-content">{page}</main>
      <GarageFooter navigate={navigate} />
    </div>
  );
}

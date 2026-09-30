import { useEffect, useMemo, useState } from 'react';
import GarageHeader from './components/layout/GarageHeader.jsx';
import GarageFooter from './components/layout/GarageFooter.jsx';
import Garage from './pages/Garage.jsx';
import Services from './pages/Services.jsx';
import Merchandise from './pages/Merchandise.jsx';
import EvidenceLocker from './pages/EvidenceLocker.jsx';
import QuoteRequest from './pages/QuoteRequest.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import { products } from './data/products.js';
import { services } from './data/services.js';

function routeFor(pathname) {
  if (pathname === '/') return { type: 'garage' };
  if (pathname === '/services') return { type: 'services' };
  if (pathname === '/merch') return { type: 'merch' };
  if (pathname === '/evidence') return { type: 'evidence' };
  if (pathname === '/quote') return { type: 'quote' };
  if (pathname === '/cart') return { type: 'cart' };

  const merchMatch = pathname.match(/^\/merch\/([^/]+)$/);
  if (merchMatch) return { type: 'product', slug: decodeURIComponent(merchMatch[1]) };

  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) return { type: 'service', slug: decodeURIComponent(serviceMatch[1]) };

  return { type: 'not-found' };
}

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (href) => {
    const destination = new URL(href, window.location.origin);
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
    window.history.pushState({}, '', destination.pathname + destination.search);
    setPathname(destination.pathname);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const addToCart = ({ product, quantity, selections }) => {
    const key = [
      product.id,
      ...Object.entries(selections)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([groupId, optionId]) => groupId + ':' + optionId),
    ].join('|');

    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...current, { key, product, quantity, selections }];
    });
  };

  const updateQuantity = (key, quantity) => {
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item));
  };

  const removeFromCart = (key) => setCart((current) => current.filter((item) => item.key !== key));
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const route = routeFor(pathname);

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
    case 'evidence':
      page = <EvidenceLocker navigate={navigate} />;
      break;
    case 'quote':
      page = <QuoteRequest />;
      break;
    case 'cart':
      page = <Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} navigate={navigate} />;
      break;
    case 'product': {
      const product = products.find((item) => item.slug === route.slug);
      page = product
        ? <ProductDetail product={product} addToCart={addToCart} navigate={navigate} />
        : <NotFound navigate={navigate} eyebrow="PARTS CAGE ERROR" />;
      break;
    }
    case 'service': {
      const service = services.find((item) => item.slug === route.slug);
      page = service
        ? <ServiceDetail service={service} navigate={navigate} />
        : <NotFound navigate={navigate} eyebrow="WORK ORDER NOT FOUND" />;
      break;
    }
    default:
      page = <NotFound navigate={navigate} />;
  }

  return (
    <div className="site-shell">
      <GarageHeader pathname={pathname} cartCount={cartCount} navigate={navigate} />
      <main id="main-content">{page}</main>
      <GarageFooter navigate={navigate} />
    </div>
  );
}

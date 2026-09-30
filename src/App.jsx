import Garage from './pages/Garage.jsx';
import Services from './pages/Services.jsx';
import Merchandise from './pages/Merchandise.jsx';
import EvidenceLocker from './pages/EvidenceLocker.jsx';
import QuoteRequest from './pages/QuoteRequest.jsx';
import Cart from './pages/Cart.jsx';

const routes = {
  '/': Garage,
  '/services': Services,
  '/merch': Merchandise,
  '/evidence': EvidenceLocker,
  '/quote': QuoteRequest,
  '/cart': Cart,
};

const navItems = [
  ['/', 'Garage'],
  ['/services', 'Services'],
  ['/merch', 'Merchandise'],
  ['/evidence', 'Evidence Locker'],
  ['/quote', 'Quote Request'],
  ['/cart', 'Cart'],
];

export default function App() {
  const Page = routes[window.location.pathname] ?? Garage;

  return (
    <div className="app-shell">
      <header>
        <strong>Penny's Office</strong>
        <nav aria-label="Primary">
          {navItems.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
      </header>
      <main>
        <Page />
      </main>
    </div>
  );
}

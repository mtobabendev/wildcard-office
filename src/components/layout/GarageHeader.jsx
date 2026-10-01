import GarageLink from './GarageLink.jsx';

const navItems = [
  ['/', 'Garage'],
  ['/services', 'Services'],
  ['/merch', 'Merch'],
  ['/marketplace', 'Market'],
  ['/evidence', 'Evidence'],
  ['/quote', 'Quote'],
];

export default function GarageHeader({ pathname, cartCount, navigate }) {
  return (
    <header className="garage-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="brand-lockup">
        <GarageLink href="/" navigate={navigate} className="brand-primary">PENNY'S GARAGE</GarageLink>
        <span className="brand-secondary">WILDCARD DEV</span>
      </div>
      <nav className="primary-nav" aria-label="Primary navigation">
        {navItems.map(([href, label]) => {
          const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
          return (
            <GarageLink
              key={href}
              href={href}
              navigate={navigate}
              className={active ? 'nav-link is-active' : 'nav-link'}
              aria-current={active ? 'page' : undefined}
            >
              {label}
            </GarageLink>
          );
        })}
        <GarageLink
          href="/cart"
          navigate={navigate}
          className={pathname === '/cart' ? 'nav-link cart-link is-active' : 'nav-link cart-link'}
          aria-current={pathname === '/cart' ? 'page' : undefined}
        >
          Cart <span className="cart-count" aria-label={cartCount + ' items in cart'}>{cartCount}</span>
        </GarageLink>
      </nav>
    </header>
  );
}

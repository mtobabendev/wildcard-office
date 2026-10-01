import { safeExternalUrl } from '../../data/marketplace.js';

export default function ProviderLink({ href, children, className = 'button button-secondary' }) {
  const safeHref = safeExternalUrl(href);
  if (!safeHref) return null;

  return (
    <a className={className} href={safeHref} target="_blank" rel="noopener noreferrer external">
      {children}
    </a>
  );
}

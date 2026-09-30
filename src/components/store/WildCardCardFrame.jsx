import SuitBadge from './SuitBadge.jsx';

export default function WildCardCardFrame({
  suit = 'spade',
  label = 'WildCard Merch',
  status,
  children,
  className = '',
  as = 'div',
}) {
  const Tag = as;
  const suitIcon = { spade: '♠', diamond: '♦', heart: '♥', club: '♣' }[suit] || '♠';

  return (
    <Tag className={'wildcard-card-frame ' + className}>
      <div className="card-corner card-corner-top" aria-hidden="true">
        <span>{suitIcon}</span>
        <small>{label}</small>
      </div>

      <div className="wildcard-card-body">{children}</div>

      <div className="card-corner card-corner-bottom" aria-hidden="true">
        <span>{suitIcon}</span>
        <small>{label}</small>
      </div>

      <div className="card-frame-meta">
        <SuitBadge suit={suit} label={label} compact />
        {status && <span className="card-status-label">{status}</span>}
      </div>
    </Tag>
  );
}

import SuitBadge from './SuitBadge.jsx';

const suitIcons = {
  spade: '♠',
  diamond: '♦',
  heart: '♥',
  club: '♣',
};

export default function WildCardCardFrame({
  suit,
  label = 'Unclassified Listing',
  status,
  children,
  className = '',
  as = 'div',
}) {
  const Tag = as;
  const validSuit = Boolean(suit && suitIcons[suit]);
  const suitIcon = validSuit ? suitIcons[suit] : '◇';

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
        {validSuit ? (
          <SuitBadge suit={suit} label={label} compact />
        ) : (
          <span className="suit-badge is-compact" aria-label={label}>
            <span className="suit-icon" aria-hidden="true">◇</span>
            <span>{label}</span>
          </span>
        )}
        {status && <span className="card-status-label">{status}</span>}
      </div>
    </Tag>
  );
}

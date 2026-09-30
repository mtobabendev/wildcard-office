const suitIcons = {
  spade: '♠',
  diamond: '♦',
  heart: '♥',
  club: '♣',
};

export default function SuitBadge({ suit, label, compact = false }) {
  const icon = suitIcons[suit] || '♠';
  return (
    <span className={compact ? 'suit-badge is-compact' : 'suit-badge'} aria-label={label}>
      <span className="suit-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

import { useState } from 'react';

const TIER_COPY = {
  launch: {
    selectorLabel: '$995 LAUNCH',
    title: 'LAUNCH BUILD',
    description: 'Clean, polished, responsive business presence.',
    liveLabel: 'VIEW $995 LIVE DEMO',
  },
  enhanced: {
    selectorLabel: '$1,500 ENHANCED',
    title: 'ENHANCED BUILD',
    description: 'The same foundation with premium motion, interactive presentation, and custom front-end effects.',
    liveLabel: 'VIEW $1,500 LIVE DEMO',
  },
};

export default function ServiceShowroomPreview({ showroom }) {
  const [selectedTier, setSelectedTier] = useState('launch');
  const active = showroom[selectedTier];
  const activeCopy = TIER_COPY[selectedTier];

  return (
    <section className="service-showroom" aria-labelledby="service-showroom-title">
      <div className="service-showroom-heading">
        <p className="service-showroom-eyebrow">SEE WHAT YOUR MONEY BUILDS</p>
        <h2 id="service-showroom-title">Pick the level. Inspect the result.</h2>
        <p>Same fictional business. Same core content. The difference is the presentation layer.</p>
      </div>

      <div className="service-showroom-tier-selectors" role="group" aria-label="Choose showroom preview tier">
        {Object.entries(showroom).map(([key, tier]) => {
          const copy = TIER_COPY[key];
          const isSelected = selectedTier === key;

          return (
            <button
              key={key}
              type="button"
              className={isSelected ? 'service-showroom-tier is-selected' : 'service-showroom-tier'}
              onClick={() => setSelectedTier(key)}
              aria-pressed={isSelected}
              aria-controls="service-showroom-frame"
            >
              <span>{copy?.selectorLabel || tier.label}</span>
              <small>{copy?.description}</small>
            </button>
          );
        })}
      </div>

      <div className="service-showroom-browser">
        <div className="service-showroom-browser-bar" aria-hidden="true">
          <span className="service-showroom-dots"><i></i><i></i><i></i></span>
          <span className="service-showroom-address">{active.label} · LIVE SHOWROOM</span>
        </div>
        <div className="service-showroom-viewport" id="service-showroom-frame">
          <iframe
            key={active.url}
            src={active.url}
            title={active.label + ' visual showroom preview'}
            loading="lazy"
            tabIndex={-1}
            scrolling="no"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="service-showroom-active-copy" aria-live="polite">
        <p>{activeCopy.title}</p>
        <span>{activeCopy.description}</span>
      </div>

      <div className="service-showroom-live-links" aria-label="Open live showroom demos">
        <a className="button button-secondary" href={showroom.launch.url} target="_blank" rel="noopener noreferrer">
          {TIER_COPY.launch.liveLabel}
        </a>
        <a className="button button-primary" href={showroom.enhanced.url} target="_blank" rel="noopener noreferrer">
          {TIER_COPY.enhanced.liveLabel}
        </a>
      </div>
    </section>
  );
}

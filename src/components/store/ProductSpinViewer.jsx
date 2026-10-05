import { useEffect, useMemo, useState } from 'react';
import RotatableCardSurface from './RotatableCardSurface.jsx';
import WildCardCardFrame from './WildCardCardFrame.jsx';

function validSource(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeFrame(frame, fallbackAlt = 'Product image') {
  const src = validSource(frame?.src);
  if (!src) return null;
  return {
    ...frame,
    src,
    alt: frame?.alt || fallbackAlt,
  };
}

function normalizedFrames(viewer, fallbackMedia = []) {
  const explicit = Array.isArray(viewer?.mainFrames)
    ? viewer.mainFrames.map((frame) => normalizeFrame(frame)).filter(Boolean)
    : [];

  if (explicit.length) return explicit;

  return (Array.isArray(fallbackMedia) ? fallbackMedia : [])
    .filter((item) => item?.type === 'image')
    .map((item) => normalizeFrame(item))
    .filter(Boolean);
}

function normalizedSideImages(viewer) {
  if (!Array.isArray(viewer?.sideImages)) return [];

  return viewer.sideImages
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;

      const frames = Array.isArray(item.frames)
        ? item.frames.map((frame) => normalizeFrame(frame, item.label || 'Alternate product image')).filter(Boolean)
        : [];
      const thumbnail = validSource(item.thumbnail) || frames[0]?.src || null;
      const usableFrames = frames.length
        ? frames
        : (thumbnail ? [{ src: thumbnail, alt: item.label || 'Alternate product image' }] : []);

      if (!thumbnail || !usableFrames.length) return null;

      return {
        ...item,
        id: item.id || 'side-' + index,
        label: item.label || 'Alternate view ' + (index + 1),
        thumbnail,
        frames: usableFrames,
      };
    })
    .filter(Boolean);
}

export default function ProductSpinViewer({
  viewer,
  fallbackMedia,
  suit,
  label,
  status,
  requestedIndex = 0,
  physicalFrontSrc,
  physicalFrontAlt,
  physicalBackSrc,
  physicalBackAlt,
  backTitle,
  backSubtitle,
  backDescription,
  backStatus,
}) {
  const frames = useMemo(() => normalizedFrames(viewer, fallbackMedia), [viewer, fallbackMedia]);
  const sideImages = useMemo(() => normalizedSideImages(viewer), [viewer]);
  const [activeGroup, setActiveGroup] = useState('main');
  const [frameIndex, setFrameIndex] = useState(0);

  const activeFrames = activeGroup === 'main'
    ? frames
    : (sideImages.find((item) => item.id === activeGroup)?.frames || []);

  const currentFrames = activeFrames.length ? activeFrames : frames;
  const hasFrameSequence = viewer?.mode === 'spin-sequence' && currentFrames.length > 1;
  const hasRail = sideImages.length > 0;
  const frame = currentFrames[Math.min(frameIndex, Math.max(0, currentFrames.length - 1))];
  const physicalFront = physicalFrontSrc
    ? { src: physicalFrontSrc, alt: physicalFrontAlt || 'Merchandise front view' }
    : frame;
  const showSecondaryFrames = Boolean(physicalFrontSrc && hasFrameSequence && frame);

  useEffect(() => {
    if (Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < frames.length) {
      setActiveGroup('main');
      setFrameIndex(requestedIndex);
    }
  }, [requestedIndex, frames.length]);

  useEffect(() => {
    setFrameIndex(0);
  }, [activeGroup]);

  useEffect(() => {
    if (!hasFrameSequence || typeof Image === 'undefined') return;

    const previous = currentFrames[(frameIndex - 1 + currentFrames.length) % currentFrames.length]?.src;
    const next = currentFrames[(frameIndex + 1) % currentFrames.length]?.src;

    [...new Set([previous, next].filter(Boolean))].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [hasFrameSequence, currentFrames, frameIndex]);

  const stepFrame = (direction) => {
    if (!hasFrameSequence) return;
    setFrameIndex((current) => {
      const next = current + direction;
      if (next < 0) return currentFrames.length - 1;
      if (next >= currentFrames.length) return 0;
      return next;
    });
  };

  return (
    <div className={hasRail ? 'product-viewer-shell has-rail' : 'product-viewer-shell'}>
      <div className="viewer-main-column">
        <RotatableCardSurface
          className="viewer-rotatable-card"
          disabled={!physicalFront}
          backSrc={physicalBackSrc}
          backAlt={physicalBackAlt || 'Merchandise back view'}
          backContent={physicalBackSrc ? (
            <>
              {backTitle && <h3>{backTitle}</h3>}
              {backSubtitle && <p className="card-subtitle">{backSubtitle}</p>}
              {backDescription && <p>{backDescription}</p>}
              {backStatus && <p className="catalog-status">{backStatus}</p>}
            </>
          ) : undefined}
          ariaLabel="Interactive merchandise object. Drag to rotate through full front, back, and edge views. Use arrow keys to inspect angles."
        >
          <WildCardCardFrame suit={suit} label={label} status={status} className="viewer-card">
            <div className="viewer-face-media">
              {physicalFront ? (
                <img
                  src={physicalFront.src}
                  alt={physicalFront.alt || 'Product image'}
                  draggable="false"
                  loading="eager"
                />
              ) : (
                <div className="media-placeholder">PRODUCT IMAGE UNAVAILABLE</div>
              )}
            </div>
          </WildCardCardFrame>
        </RotatableCardSurface>

        {showSecondaryFrames && (
          <div className="viewer-secondary-frame" aria-label="Secondary product image sequence">
            <img src={frame.src} alt={frame.alt || 'Product angle image'} draggable="false" loading="lazy" />
          </div>
        )}

        {hasFrameSequence && (
          <div className="viewer-frame-controls viewer-frame-controls-standalone" aria-label="Frame sequence media controls">
            <button type="button" className="viewer-frame-button" onClick={() => stepFrame(-1)}>
              PREV IMAGE
            </button>
            <span className="frame-counter" aria-live="polite">
              {frameIndex + 1} / {currentFrames.length}
            </span>
            <button type="button" className="viewer-frame-button" onClick={() => stepFrame(1)}>
              NEXT IMAGE
            </button>
          </div>
        )}

        <p className="viewer-instruction">
          GRAB CARD TO SPIN · ARROW KEYS TO ROTATE
          {hasFrameSequence ? ' · IMAGE BUTTONS CHANGE SECONDARY MEDIA' : ''}
        </p>
      </div>

      {hasRail && (
        <div className="product-image-rail" aria-label="Alternate product image sets">
          {frames[0]?.src && (
            <button
              type="button"
              className={activeGroup === 'main' ? 'rail-card is-active' : 'rail-card'}
              onClick={() => setActiveGroup('main')}
              aria-pressed={activeGroup === 'main'}
            >
              <img src={frames[0].src} alt="" loading="lazy" />
              <span>Main view</span>
            </button>
          )}

          {sideImages.map((item) => (
            <button
              type="button"
              key={item.id}
              className={activeGroup === item.id ? 'rail-card is-active' : 'rail-card'}
              onClick={() => setActiveGroup(item.id)}
              aria-pressed={activeGroup === item.id}
              aria-label={'Show ' + item.label}
            >
              <img src={item.thumbnail} alt="" loading="lazy" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import WildCardCardFrame from './WildCardCardFrame.jsx';

const DRAG_STEP = 28;

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
}) {
  const frames = useMemo(() => normalizedFrames(viewer, fallbackMedia), [viewer, fallbackMedia]);
  const sideImages = useMemo(() => normalizedSideImages(viewer), [viewer]);
  const [activeGroup, setActiveGroup] = useState('main');
  const [frameIndex, setFrameIndex] = useState(0);
  const dragStart = useRef(null);

  const activeFrames = activeGroup === 'main'
    ? frames
    : (sideImages.find((item) => item.id === activeGroup)?.frames || []);

  const currentFrames = activeFrames.length ? activeFrames : frames;
  const canSpin = viewer?.mode === 'spin-sequence' && currentFrames.length > 1;
  const hasRail = sideImages.length > 0;
  const frame = currentFrames[Math.min(frameIndex, Math.max(0, currentFrames.length - 1))];

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
    if (!canSpin || typeof Image === 'undefined') return;

    const previous = currentFrames[(frameIndex - 1 + currentFrames.length) % currentFrames.length]?.src;
    const next = currentFrames[(frameIndex + 1) % currentFrames.length]?.src;

    [...new Set([previous, next].filter(Boolean))].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [canSpin, currentFrames, frameIndex]);

  const stepFrame = (direction) => {
    if (!canSpin) return;
    setFrameIndex((current) => {
      const next = current + direction;
      if (next < 0) return currentFrames.length - 1;
      if (next >= currentFrames.length) return 0;
      return next;
    });
  };

  const pointerDown = (event) => {
    if (!canSpin) return;
    if (event.target?.closest?.('button, a, input, select, textarea, [role="button"]')) return;

    dragStart.current = { x: event.clientX, frameIndex };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const pointerMove = (event) => {
    if (!canSpin || !dragStart.current) return;
    const delta = event.clientX - dragStart.current.x;
    const steps = Math.trunc(delta / DRAG_STEP);
    if (!steps) return;
    const next = (dragStart.current.frameIndex - steps) % currentFrames.length;
    setFrameIndex(next < 0 ? next + currentFrames.length : next);
  };

  const pointerUp = (event) => {
    dragStart.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const keyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepFrame(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepFrame(1);
    }
  };

  return (
    <div className={hasRail ? 'product-viewer-shell has-rail' : 'product-viewer-shell'}>
      <WildCardCardFrame suit={suit} label={label} status={status} className="viewer-card">
        <div
          className={canSpin ? 'spin-stage is-spinnable' : 'spin-stage'}
          tabIndex={canSpin ? 0 : undefined}
          aria-label={canSpin ? 'Interactive product viewer. Drag, swipe, or use left and right arrow keys to rotate through image frames.' : undefined}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          onKeyDown={keyDown}
        >
          {frame ? (
            <img
              src={frame.src}
              alt={frame.alt || 'Product image'}
              draggable="false"
              loading="eager"
            />
          ) : (
            <div className="media-placeholder">PRODUCT IMAGE UNAVAILABLE</div>
          )}

          {canSpin && (
            <>
              <button type="button" className="viewer-nav viewer-nav-prev" onClick={() => stepFrame(-1)} aria-label="Previous product angle">‹</button>
              <button type="button" className="viewer-nav viewer-nav-next" onClick={() => stepFrame(1)} aria-label="Next product angle">›</button>
              <span className="spin-hint" aria-hidden="true">GRAB / SWIPE / ← →</span>
              <span className="frame-counter" aria-live="polite">{frameIndex + 1} / {currentFrames.length}</span>
            </>
          )}
        </div>
      </WildCardCardFrame>

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

import { useEffect, useMemo, useRef, useState } from 'react';
import WildCardCardFrame from './WildCardCardFrame.jsx';

const ROTATE_X_MIN = -20;
const ROTATE_X_MAX = 20;
const ROTATE_Y_MIN = -35;
const ROTATE_Y_MAX = 35;
const DRAG_YAW_SENSITIVITY = 0.16;
const DRAG_TILT_SENSITIVITY = 0.12;
const KEYBOARD_STEP = 5;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false);
  const dragStart = useRef(null);

  const activeFrames = activeGroup === 'main'
    ? frames
    : (sideImages.find((item) => item.id === activeGroup)?.frames || []);

  const currentFrames = activeFrames.length ? activeFrames : frames;
  const hasFrameSequence = viewer?.mode === 'spin-sequence' && currentFrames.length > 1;
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

  const pointerDown = (event) => {
    if (!frame || event.isPrimary === false || event.button !== 0) return;
    if (event.target?.closest?.('button, a, input, select, textarea, [role="button"]')) return;

    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rotateX: rotation.x,
      rotateY: rotation.y,
    };
    setIsGrabbing(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const pointerMove = (event) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    setRotation({
      x: clamp(start.rotateX - deltaY * DRAG_TILT_SENSITIVITY, ROTATE_X_MIN, ROTATE_X_MAX),
      y: clamp(start.rotateY + deltaX * DRAG_YAW_SENSITIVITY, ROTATE_Y_MIN, ROTATE_Y_MAX),
    });
  };

  const pointerUp = (event) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    dragStart.current = null;
    setIsGrabbing(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
  };

  const adjustRotation = (axis, amount) => {
    setRotation((current) => ({
      x: axis === 'x'
        ? clamp(current.x + amount, ROTATE_X_MIN, ROTATE_X_MAX)
        : current.x,
      y: axis === 'y'
        ? clamp(current.y + amount, ROTATE_Y_MIN, ROTATE_Y_MAX)
        : current.y,
    }));
  };

  const keyDown = (event) => {
    if (event.target !== event.currentTarget) return;

    const actions = {
      ArrowLeft: () => adjustRotation('y', -KEYBOARD_STEP),
      ArrowRight: () => adjustRotation('y', KEYBOARD_STEP),
      ArrowUp: () => adjustRotation('x', -KEYBOARD_STEP),
      ArrowDown: () => adjustRotation('x', KEYBOARD_STEP),
    };

    const action = actions[event.key];
    if (!action) return;

    event.preventDefault();
    action();
  };

  const resetView = () => setRotation({ x: 0, y: 0 });
  const shadowX = Math.round(rotation.y * -0.45);
  const shadowY = Math.round(18 + rotation.x * 0.35);

  return (
    <div className={hasRail ? 'product-viewer-shell has-rail' : 'product-viewer-shell'}>
      <div className="viewer-main-column">
        <div className="viewer-perspective-stage">
          <div
            className={isGrabbing ? 'viewer-tilt is-grabbing' : 'viewer-tilt'}
            role="group"
            tabIndex={frame ? 0 : undefined}
            aria-label={frame ? 'Interactive merchandise card. Drag to tilt and rotate. Use arrow keys to inspect angles.' : undefined}
            style={{
              '--viewer-rotate-x': rotation.x + 'deg',
              '--viewer-rotate-y': rotation.y + 'deg',
              '--viewer-shadow-x': shadowX + 'px',
              '--viewer-shadow-y': shadowY + 'px',
            }}
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
            onKeyDown={keyDown}
          >
            <div className="viewer-card-depth" aria-hidden="true" />

            <WildCardCardFrame suit={suit} label={label} status={status} className="viewer-card">
              <div className="viewer-face-media">
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
              </div>
            </WildCardCardFrame>
          </div>
        </div>

        <div className="viewer-controls" aria-label="Merchandise viewer controls">
          <button type="button" className="viewer-reset" onClick={resetView}>
            RESET VIEW
          </button>

          {hasFrameSequence && (
            <div className="viewer-frame-controls" aria-label="Frame sequence media controls">
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
        </div>

        <p className="viewer-instruction">
          GRAB CARD TO TILT · ARROW KEYS TO ROTATE
          {hasFrameSequence ? ' · IMAGE BUTTONS CHANGE MEDIA' : ''}
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

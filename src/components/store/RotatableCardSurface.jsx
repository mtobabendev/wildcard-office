import { useRef, useState } from 'react';

const DRAG_YAW_SENSITIVITY = 0.16;
const DRAG_TILT_SENSITIVITY = 0.12;
const KEYBOARD_STEP = 5;

function normalizeVisualAngle(value) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

export default function RotatableCardSurface({
  children,
  backSrc,
  backAlt = 'Merchandise back view',
  className = '',
  ariaLabel = 'Interactive merchandise card. Drag to rotate through full front, back, and edge views. Use arrow keys to inspect angles.',
  disabled = false,
  resetLabel = 'RESET VIEW',
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false);
  const dragStart = useRef(null);

  const pointerDown = (event) => {
    if (disabled || event.isPrimary === false || event.button !== 0) return;
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
      x: start.rotateX - deltaY * DRAG_TILT_SENSITIVITY,
      y: start.rotateY + deltaX * DRAG_YAW_SENSITIVITY,
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
    if (disabled) return;

    setRotation((current) => ({
      x: axis === 'x' ? current.x + amount : current.x,
      y: axis === 'y' ? current.y + amount : current.y,
    }));
  };

  const keyDown = (event) => {
    if (disabled || event.target !== event.currentTarget) return;

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
  const visualX = normalizeVisualAngle(rotation.x);
  const visualY = normalizeVisualAngle(rotation.y);
  const shadowX = Math.round(Math.sin((visualY * Math.PI) / 180) * -16);
  const shadowY = Math.round(18 + Math.sin((visualX * Math.PI) / 180) * 8);

  return (
    <div className={'rotatable-card-surface ' + className}>
      <div className="rotatable-card-perspective">
        <div
          className={
            'rotatable-card-object' +
            (isGrabbing ? ' is-grabbing' : '') +
            (disabled ? ' is-disabled' : '')
          }
          role={disabled ? undefined : 'group'}
          tabIndex={disabled ? undefined : 0}
          aria-label={disabled ? undefined : ariaLabel}
          style={{
            '--card-rotate-x': rotation.x + 'deg',
            '--card-rotate-y': rotation.y + 'deg',
            '--card-shadow-x': shadowX + 'px',
            '--card-shadow-y': shadowY + 'px',
          }}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          onKeyDown={keyDown}
        >
          <div className="rotatable-card-face rotatable-card-front">{children}</div>

          <div className="rotatable-card-face rotatable-card-back">
            {backSrc ? (
              <img
                className="rotatable-card-back-image"
                src={backSrc}
                alt={backAlt}
                draggable="false"
                loading="eager"
              />
            ) : (
              <div className="rotatable-card-back-fallback" aria-hidden="true">
                <span>♠</span>
              </div>
            )}
          </div>

          <div className="rotatable-card-edge rotatable-card-edge-left" aria-hidden="true" />
          <div className="rotatable-card-edge rotatable-card-edge-right" aria-hidden="true" />
          <div className="rotatable-card-edge rotatable-card-edge-top" aria-hidden="true" />
          <div className="rotatable-card-edge rotatable-card-edge-bottom" aria-hidden="true" />
        </div>
      </div>

      {!disabled && (
        <div className="rotatable-card-reset-row">
          <button type="button" className="viewer-reset" onClick={resetView}>
            {resetLabel}
          </button>
        </div>
      )}
    </div>
  );
}

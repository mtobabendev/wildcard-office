import { useRef, useState } from 'react';

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

export default function RotatableCardSurface({
  children,
  className = '',
  ariaLabel = 'Interactive merchandise card. Drag to tilt and rotate. Use arrow keys to inspect angles.',
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
    if (disabled) return;

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
  const shadowX = Math.round(rotation.y * -0.45);
  const shadowY = Math.round(18 + rotation.x * 0.35);

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
          <div className="rotatable-card-depth" aria-hidden="true" />
          <div className="rotatable-card-front">{children}</div>
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

(() => {
  const sequence = document.getElementById('strikeSequence');
  const trigger = document.getElementById('centerRedPill');
  const closeButton = document.getElementById('strikeClose');
  const replayButton = document.getElementById('strikeReplay');
  const video = document.getElementById('strikeVideo');
  const videoShell = document.getElementById('strikeVideoShell');
  const telemetry = document.getElementById('strikeTelemetry');
  const endControls = document.getElementById('strikeEndControls');
  const counterPanel = document.getElementById('strikeCounterPanel');
  const pennyVideo = document.getElementById('strikePennyVideo');
  const targetLock = document.getElementById('strikeTargetLock');
  const thought = document.getElementById('strikeThought');
  const beamOut = document.getElementById('strikeBeamOut');
  const beamIn = document.getElementById('strikeBeamIn');
  const impact = document.getElementById('strikeImpact');
  const firstProjectile = document.getElementById('strikeFirstProjectile');
  const responseProjectile = document.getElementById('strikeResponseProjectile');
  const evidenceCards = [...document.querySelectorAll('.strike-evidence-card')];
  const counterProjectiles = [...document.querySelectorAll('.strike-counter-projectile')];
  const boardTarget = document.querySelector('.different-approach');
  const avatarTarget = document.querySelector('.jake-nicole');

  if (!sequence || !trigger || !video || !videoShell || !targetLock) return;

  const phaseThresholds = [0.35, 2.15, 3.15, 4.15, 4.85, 5.65, 6.45, 7.25, 9.1, 18.4, 23.4];
  let phases = phaseThresholds.map(() => false);
  let active = false;
  let trackedAnimations = [];
  let trackedTimers = [];

  const centerOf = rect => ({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  });

  const rememberTimer = (callback, delay) => {
    const id = window.setTimeout(callback, delay);
    trackedTimers.push(id);
    return id;
  };

  const rememberAnimation = animation => {
    if (animation) trackedAnimations.push(animation);
    return animation;
  };

  function getBoardTargetRect() {
    const target = avatarTarget || boardTarget;
    const rect = target?.getBoundingClientRect();

    if (rect && rect.width && rect.height) return rect;

    return {
      left: window.innerWidth * 0.1,
      top: window.innerHeight * 0.68,
      width: 100,
      height: 82,
      right: window.innerWidth * 0.1 + 100,
      bottom: window.innerHeight * 0.68 + 82
    };
  }

  function placeTargetLock() {
    const rect = getBoardTargetRect();
    const center = centerOf(rect);
    targetLock.style.left = `${center.x}px`;
    targetLock.style.top = `${center.y}px`;

    if (thought.classList.contains('is-visible')) {
      placeThought();
    }
  }

  function placeThought() {
    const rect = targetLock.getBoundingClientRect();
    const center = centerOf(rect);
    thought.style.left = `${center.x}px`;
    thought.style.top = `${Math.max(54, rect.top - 24)}px`;
  }

  function fireBeam(element, fromRect, toRect, duration = 720) {
    const from = centerOf(fromRect);
    const to = centerOf(toRect);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    element.style.left = `${from.x}px`;
    element.style.top = `${from.y}px`;
    element.style.width = `${distance}px`;

    const animation = element.animate([
      { opacity: 0, transform: `rotate(${angle}deg) scaleX(0)` },
      { opacity: 1, offset: 0.16, transform: `rotate(${angle}deg) scaleX(0.18)` },
      { opacity: 0.95, offset: 0.7, transform: `rotate(${angle}deg) scaleX(1)` },
      { opacity: 0, transform: `rotate(${angle}deg) scaleX(1)` }
    ], {
      duration,
      easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      fill: 'none'
    });

    rememberAnimation(animation);
  }

  function flyCard(element, fromRect, toRect, options = {}) {
    const {
      duration = 1200,
      startScale = 0.45,
      endScale = 0.24,
      rotation = 10,
      onImpact = null
    } = options;
    const from = centerOf(fromRect);
    const to = centerOf(toRect);
    const width = element.offsetWidth || 160;
    const height = element.offsetHeight || 110;
    const startX = from.x - width / 2;
    const startY = from.y - height / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    element.style.left = `${startX}px`;
    element.style.top = `${startY}px`;

    const animation = element.animate([
      {
        opacity: 0,
        transform: `translate3d(0, 0, 0) scale(${startScale * 0.7}) rotate(${-rotation}deg)`
      },
      {
        opacity: 1,
        offset: 0.16,
        transform: `translate3d(${dx * 0.08}px, ${dy * 0.08 - 16}px, 0) scale(${startScale}) rotate(${-rotation * 0.45}deg)`
      },
      {
        opacity: 1,
        offset: 0.78,
        transform: `translate3d(${dx * 0.78}px, ${dy * 0.74 - 34}px, 0) scale(${Math.max(endScale + 0.18, 0.45)}) rotate(${rotation * 0.7}deg)`
      },
      {
        opacity: 0,
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${endScale}) rotate(${rotation}deg)`
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.18, 0.66, 0.2, 1)',
      fill: 'none'
    });

    if (onImpact) rememberTimer(onImpact, Math.max(0, duration - 120));
    rememberAnimation(animation);
  }

  function hitTarget() {
    const rect = targetLock.getBoundingClientRect();
    const center = centerOf(rect);
    impact.style.left = `${center.x}px`;
    impact.style.top = `${center.y}px`;

    [impact, targetLock, boardTarget, avatarTarget].forEach(element => {
      if (!element) return;
      element.classList.remove(element === impact ? 'is-hitting' : 'strike-hit');
      void element.offsetWidth;
      element.classList.add(element === impact ? 'is-hitting' : 'strike-hit');
    });

    rememberTimer(() => {
      impact.classList.remove('is-hitting');
      targetLock.classList.remove('strike-hit');
      boardTarget?.classList.remove('strike-hit');
      avatarTarget?.classList.remove('strike-hit');
    }, 720);
  }

  function launchFirstStrike() {
    telemetry.textContent = 'FIRST STRIKE // MESSAGE AWAY';
    const fromRect = videoShell.getBoundingClientRect();
    const toRect = targetLock.getBoundingClientRect();
    fireBeam(beamOut, fromRect, toRect, 820);
    flyCard(firstProjectile, fromRect, toRect, {
      duration: 1250,
      startScale: 0.52,
      endScale: 0.2,
      rotation: -12,
      onImpact: hitTarget
    });
  }

  function launchWeakResponse() {
    telemetry.textContent = 'INCOMING // LOW-ENERGY RETURN FIRE';
    const fromRect = targetLock.getBoundingClientRect();
    const toRect = videoShell.getBoundingClientRect();
    fireBeam(beamIn, fromRect, toRect, 940);
    flyCard(responseProjectile, fromRect, toRect, {
      duration: 1150,
      startScale: 0.28,
      endScale: 0.16,
      rotation: 5
    });
  }

  function openCounterPanel() {
    telemetry.textContent = 'PENNY // UNDERSTOOD. ANOTHER SHIP DETECTED.';
    counterPanel.classList.add('is-open');
    pennyVideo.currentTime = 0;
    pennyVideo.play().catch(() => {});
  }

  function launchCounterStrike(index) {
    const projectile = counterProjectiles[index];
    const source = evidenceCards[index];
    if (!projectile || !source) return;

    telemetry.textContent = `COUNTER-STRIKE // EXHIBIT ${index + 1} OF 4`;
    flyCard(projectile, source.getBoundingClientRect(), targetLock.getBoundingClientRect(), {
      duration: 1380,
      startScale: 0.74,
      endScale: 0.17,
      rotation: index % 2 ? 13 : -13,
      onImpact: hitTarget
    });
  }

  function runPhase(index) {
    if (phases[index]) return;
    phases[index] = true;

    switch (index) {
      case 0:
        launchFirstStrike();
        break;
      case 1:
        telemetry.textContent = 'DIFFERENT APPROACH // FIRE EVERYTHING!';
        placeThought();
        thought.classList.remove('is-visible');
        void thought.offsetWidth;
        thought.classList.add('is-visible');
        break;
      case 2:
        launchWeakResponse();
        break;
      case 3:
        openCounterPanel();
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        launchCounterStrike(index - 4);
        break;
      case 8:
        telemetry.textContent = 'COUNTER-STRIKE // DIFFERENT APPROACH DISABLED';
        hitTarget();
        break;
      case 9:
        telemetry.textContent = 'PORTAL RETURN // CAPTAIN PIKE RECOVERED';
        break;
      case 10:
        telemetry.textContent = "THAT'S DONE // NEXT TARGET";
        break;
      default:
        break;
    }
  }

  function resetVisuals() {
    trackedTimers.forEach(window.clearTimeout);
    trackedTimers = [];
    trackedAnimations.forEach(animation => animation.cancel());
    trackedAnimations = [];
    phases = phaseThresholds.map(() => false);

    thought.classList.remove('is-visible');
    counterPanel.classList.remove('is-open');
    endControls.classList.remove('is-visible');
    impact.classList.remove('is-hitting');
    targetLock.classList.remove('strike-hit');
    boardTarget?.classList.remove('strike-hit');
    avatarTarget?.classList.remove('strike-hit');
    telemetry.textContent = 'TACTICAL LINK // READY';

    pennyVideo.pause();
    pennyVideo.currentTime = 0;
  }

  function startSequence() {
    resetVisuals();
    active = true;
    document.body.classList.add('strike-running');
    sequence.classList.add('is-active');
    sequence.setAttribute('aria-hidden', 'false');
    placeTargetLock();
    targetLock.classList.add('is-locked');

    video.currentTime = 0;
    video.play().catch(() => {
      telemetry.textContent = 'TAP REPLAY TO START TACTICAL FEED';
      endControls.classList.add('is-visible');
    });

    closeButton.focus({ preventScroll: true });
  }

  function stopSequence() {
    if (!active) return;
    active = false;
    video.pause();
    video.currentTime = 0;
    resetVisuals();
    targetLock.classList.remove('is-locked');
    sequence.classList.remove('is-active');
    sequence.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('strike-running');
    trigger.focus({ preventScroll: true });
  }

  function replaySequence() {
    resetVisuals();
    placeTargetLock();
    targetLock.classList.add('is-locked');
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  trigger.addEventListener('click', startSequence);
  closeButton.addEventListener('click', stopSequence);
  replayButton.addEventListener('click', replaySequence);

  sequence.addEventListener('click', event => {
    if (event.target.classList.contains('strike-curtain')) stopSequence();
  });

  video.addEventListener('timeupdate', () => {
    if (!active) return;
    phaseThresholds.forEach((threshold, index) => {
      if (video.currentTime >= threshold) runPhase(index);
    });
  });

  video.addEventListener('ended', () => {
    telemetry.textContent = "THAT'S DONE // NEXT TARGET";
    endControls.classList.add('is-visible');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      event.stopImmediatePropagation();
      stopSequence();
    }
  }, true);

  window.addEventListener('resize', () => {
    if (active) placeTargetLock();
  });
})();

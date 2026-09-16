(() => {
  const button = document.getElementById('soundtrackToggle');
  const host = document.getElementById('soundtrackPlayer');
  const status = document.getElementById('soundtrackStatus');
  button.addEventListener('click', () => {
    if (host.firstElementChild) {
      host.replaceChildren();
      host.hidden = true;
      button.textContent = '▶ Play soundtrack';
      button.setAttribute('aria-expanded', 'false');
      status.textContent = 'Soundtrack stopped.';
      return;
    }
    const player = document.createElement('iframe');
    player.title = 'California Gurls — Katy Perry featuring Snoop Dogg';
    player.src = 'https://www.youtube.com/embed/F57P9C4SAW4?autoplay=1&playsinline=1&loop=1&playlist=F57P9C4SAW4&rel=0';
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    host.hidden = false;
    host.append(player);
    button.textContent = '■ Stop soundtrack';
    button.setAttribute('aria-expanded', 'true');
    status.textContent = 'Use the player to pause or adjust volume. If playback is blocked, tap play in the video or open it on YouTube.';
  });
})();

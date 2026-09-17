(() => {
  const notices = document.createElement('section');
  notices.className = 'office-notices';
  notices.setAttribute('aria-label', 'Office notices');
  document.querySelector('.office').after(notices);
  function disclosure(label, content) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = label;
    details.append(summary, content);
    notices.append(details);
  }
  disclosure('12-step notice', document.querySelector('.compatibility-notice'));
  disclosure('Evidence preview', document.querySelector('.inmate-cookie-gag'));
  const evidenceStage = document.querySelector('.evidence-stage');
  const cast = document.createElement('div');
  cast.className = 'assist-cast';
  cast.setAttribute('aria-label', 'Lucy, Erica and Penny');
  cast.append(document.querySelector('.lucy-entrance'), document.getElementById('ericaSlot'), document.querySelector('.penny-corner-mobile'));
  evidenceStage.prepend(cast);
  document.querySelector('.transparency-screen').after(document.querySelector('.bryan-vertical-spinner'));
  const tab = document.getElementById('tab');
  document.querySelector('.profit-donate-strip').after(tab);
  tab.querySelector('.tab-touch-label').textContent = 'Open Penny’s help & tools';
  tab.setAttribute('aria-controls', 'bar');
  tab.setAttribute('aria-expanded', 'false');
  document.querySelector('.office-label').textContent = 'Penny’s help & tools are available at the top of the page.';
  const bar = document.getElementById('bar');
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Penny’s help & tools');
  bar.setAttribute('aria-modal', 'true');
  bar.inert = true;
  const closeButton = document.createElement('button');
  closeButton.className = 'assist-close';
  closeButton.type = 'button';
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close help & tools');
  bar.querySelector('.header').append(closeButton);
  closeButton.addEventListener('click', close);
  new MutationObserver(() => {
    const isOpen = bar.classList.contains('open');
    tab.setAttribute('aria-expanded', String(isOpen));
    bar.inert = !isOpen;
    document.querySelector('.office').inert = isOpen;
    notices.inert = isOpen;
    if (isOpen) closeButton.focus(); else tab.focus();
  }).observe(bar, { attributes: true, attributeFilter: ['class'] });
  bar.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...bar.querySelectorAll('button, a[href], iframe, [tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.querySelector('.skip-intro').addEventListener('click', finishLandingIntro);
})();

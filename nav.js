/* Mobile navigation: toggle, scrim, Escape, tap-outside, ARIA state. */
(function () {
  var body = document.body;
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('header nav');
  if (!toggle || !nav) return;

  // The scrim lives on <body>, not in <header>: the header's backdrop-filter
  // makes it the containing block for fixed children, which collapses bottom:0.
  var scrim = document.createElement('div');
  scrim.className = 'nav-scrim';
  document.body.appendChild(scrim);

  function set(open) {
    body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function close(returnFocus) {
    if (!body.classList.contains('nav-open')) return;
    set(false);
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    set(!body.classList.contains('nav-open'));
  });

  scrim.addEventListener('click', function () { close(true); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close(true);
  });

  // Following a link closes the panel; the group labels are not links.
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) close(false);
  });

  // Resizing or rotating up to desktop must not strand the panel open —
  // body.nav-open locks page scroll.
  addEventListener('resize', function () {
    if (innerWidth > 820) close(false);
  });
})();

/* Luxury motion: scroll-reveal + scroll-progress bar + subtle parallax.
   Safe by design: if JS is off or reduced-motion is set, nothing is ever hidden. */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll progress bar (always on; it's subtle) ---------- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  (document.body || document.documentElement).appendChild(bar);
  function updBar(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  addEventListener('scroll', updBar, { passive: true });
  addEventListener('resize', updBar);
  updBar();

  if (reduce) return;                                  /* no further motion */
  document.documentElement.classList.add('anim-ready');

  /* ---------- scroll-reveal: fade + rise with a soft stagger ---------- */
  var selectors = [
    '.hero .eyebrow', '.hero h1', '.hero .sub', '.strip',
    '.tagline .rule', '.tagline p',
    '.work-head', '.tile',
    '.testi h2', '.testi .sub', '.testi-carousel',
    '.clients h3', '.logos',
    'footer .cta', 'footer .mail', 'footer .foot-nav',
    '.p-band > *', '.p-subband > *', '.p-hero > *',
    '.impact-item', '.p-media > *',
    '.cs-hero-grid > *', '.cs-info > *', '.cs-phone',
    '.cs-section > *', '.cs-grid figure', '.cs-img'
  ];
  var els = [];
  selectors.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){
      if (els.indexOf(el) < 0){ els.push(el); el.classList.add('reveal'); }
    });
  });
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        var el = e.target, delay = 0;
        if (el.parentNode){
          var sibs = Array.prototype.filter.call(el.parentNode.children, function(s){
            return s.classList && s.classList.contains('reveal');
          });
          var idx = sibs.indexOf(el);
          if (idx > 0) delay = Math.min(idx, 6) * 75;
        }
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- subtle parallax on banner backgrounds & feature images ---------- */
  var pItems = [];
  document.querySelectorAll('.p-band--img').forEach(function(el){ pItems.push({ el: el, type: 'bg', speed: 0.16 }); });
  document.querySelectorAll('.cs-phone img').forEach(function(el){ pItems.push({ el: el, type: 'img', speed: 0.10 }); });
  if (pItems.length){
    var ticking = false;
    function frame(){
      var vh = window.innerHeight;
      pItems.forEach(function(it){
        var r = it.el.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) return;
        var off = ((r.top + r.height / 2) - vh / 2) * it.speed;
        if (it.type === 'bg'){
          it.el.style.backgroundPosition = 'center calc(50% + ' + (-off).toFixed(1) + 'px)';
        } else {
          it.el.style.transform = 'translateY(' + (off * 0.4).toFixed(1) + 'px)';
        }
      });
      ticking = false;
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    frame();
  }
})();

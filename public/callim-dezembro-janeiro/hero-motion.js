(function () {
  var cm = document.getElementById('cm');
  if (!cm || !window.gsap) return;
  var $ = function (id) { return document.getElementById(id); };
  var txt = $('txt'), plate = $('plate');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PINK = '#E0738B', GREEN = '#C1DB6C';

  // Digita/apaga: um contador anima de a até b e o texto acompanha (seek-safe).
  function typer(tl, at, text, from, to, dur) {
    var o = { n: from };
    tl.to(o, { n: to, duration: dur, ease: 'none',
      onUpdate: function () { txt.textContent = text.slice(0, Math.round(o.n)); } }, at);
  }
  // "tecla": a placa dá um micro-tranco a cada ~3 letras digitadas
  function tick(tl, at, dur, text) {
    var steps = Math.max(1, Math.floor(text.length / 3));
    for (var i = 0; i < steps; i++) {
      tl.fromTo(plate, { y: '0.35cqw' }, { y: 0, duration: 0.09, ease: 'power2.out' }, at + (dur / steps) * i);
    }
  }

  var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

  tl.set(txt, { textContent: '' }, 0)
    .set(plate, { color: '#FFFFFF', opacity: 0, scale: 0.9, y: 0 }, 0)
    .set('#main', { opacity: 1, y: 0, filter: 'blur(0px)' }, 0)
    .set(['#kicker', '#mova'], { opacity: 0, y: 24 }, 0);

  // Abertura
  tl.to('#kicker', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.2)
    .to('#mova', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' }, 0.4)
    .to(plate, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, 0.9);

  // Lettering 1: "pelo que te inspira"
  var s1 = 'pelo que te inspira';
  typer(tl, 1.5, s1, 0, s1.length, 1.7); tick(tl, 1.5, 1.7, s1);
  typer(tl, 4.4, s1, s1.length, 0, 0.7);

  // Lettering 2: "Para Conquistar"
  var s2 = 'Para Conquistar';
  tl.set(plate, { color: GREEN }, 5.15);
  typer(tl, 5.2, s2, 0, s2.length, 1.3); tick(tl, 5.2, 1.3, s2);
  typer(tl, 7.7, s2, s2.length, 0, 0.55);

  // Lettering 3: "Para Celebrar" (final)
  var s3 = 'Para Celebrar';
  tl.set(plate, { color: PINK }, 8.4);
  typer(tl, 8.45, s3, 0, s3.length, 1.15); tick(tl, 8.45, 1.15, s3);

  // Sino final: a placa estoura e um anel se expande; a frase fica em tela
  tl.to(plate, { scale: 1.07, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, 9.85)
    .fromTo('#ring', { opacity: 0.9, scale: 0.4 }, { opacity: 0, scale: 9, duration: 1.1, ease: 'power2.out' }, 9.85)
    .to('#main', { opacity: 0, y: -20, filter: 'blur(6px)', duration: 0.55, ease: 'power2.in' }, 13.6);

  if (reduce) {
    tl.pause(0).kill();
    txt.textContent = 'Para Celebrar';
    gsap.set(['#kicker', '#mova', plate], { opacity: 1, y: 0, scale: 1 });
    gsap.set(plate, { color: PINK });
    $('caret').style.display = 'none';
  }

  cm.addEventListener('click', function () { tl.restart(); });
  window.CallimMotion = { timeline: tl, duration: tl.duration() };
})();

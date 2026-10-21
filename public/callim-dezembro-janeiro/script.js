(function () {
  // Mede cabeçalho e menu para que Hero e seções ocupem exatamente uma tela
  function measure() {
    var hd = document.querySelector('.hd'), nav = document.querySelector('.nav');
    if (hd) document.documentElement.style.setProperty('--hd-h', hd.offsetHeight + 'px');
    if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  var MESSAGE = '"Todo ano faz promessas. Mas só o movimento realiza.\n\n' +
    'O calendário vira folha, mas quem vira a própria história é você.\n' +
    'Seus novos projetos não precisam de garantias; precisam de partida.\n' +
    'Seus maiores sonhos não pedem perfeição; pedem coragem.\n\n' +
    'Celebre o chão que te trouxe até aqui.\n' +
    'E mova-se com tudo em direção ao que faz seu coração bater forte.\n\n' +
    'A vida não espera janeiro esquentar.\n' +
    'Ela começa no instante exato em que você decide não ficar parado.\n\n' +
    'CALLIM. MOVA-SE PARA CONQUISTAR."';

  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer;
  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }

  function legacyCopy() {
    try {
      var ta = document.createElement('textarea');
      ta.value = MESSAGE;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var done = document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(done ? 'Mensagem copiada com sucesso para sua área de transferência!' : 'Não foi possível copiar automaticamente.');
    } catch (e) { showToast('Não foi possível copiar automaticamente.'); }
  }

  function copyMessage() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(MESSAGE).then(function () {
        showToast('Mensagem copiada com sucesso para sua área de transferência!');
      }, legacyCopy);
    } else { legacyCopy(); }
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', copyMessage); });

  /* Simulador typewriter */
  var tw = document.getElementById('tw');
  var statusEl = document.getElementById('status');
  var run = 0, timer = null, cur = '';

  function setTw(s) { cur = s; tw.textContent = s; }
  function setStatus(s) { statusEl.textContent = s; }
  function later(r, fn, ms) { timer = setTimeout(function () { if (r === run) fn(); }, ms); }

  function type(r, str, speed, done) {
    setTw('');
    var i = 0;
    (function step() {
      if (r !== run) return;
      if (i < str.length) { i++; setTw(str.slice(0, i)); later(r, step, speed); }
      else if (done) later(r, done, 1200);
    })();
  }

  function erase(r, done) {
    (function step() {
      if (r !== run) return;
      if (cur.length > 0) { setTw(cur.slice(0, -1)); later(r, step, 45); }
      else if (done) later(r, done, 350);
    })();
  }

  function loop() {
    var r = run;
    setStatus('Lettering 1: "pelo que te inspira" (55s)');
    type(r, 'pelo que te inspira', 80, function () {
      setStatus('Apagando "pelo que te inspira"...');
      erase(r, function () {
        setStatus('Lettering 2: "Para Celebrar" (Dezembro / Fechamento)');
        type(r, 'Para Celebrar', 85, function () {
          setStatus('Apagando "Para Celebrar"...');
          erase(r, function () {
            setStatus('Lettering 3: "Para Conquistar" (Janeiro / Rumo ao Novo Ciclo)');
            type(r, 'Para Conquistar', 90, function () {
              setStatus('Fechamento final: CALLIM · MOVA-SE PARA CONQUISTAR. (Reiniciando em 4s)');
              later(r, function () { erase(r, loop); }, 4000);
            });
          });
        });
      });
    });
  }

  document.getElementById('restart').addEventListener('click', function () {
    run++; clearTimeout(timer); loop();
  });
  loop();
})();

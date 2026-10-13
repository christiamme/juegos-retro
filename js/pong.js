(() => {
  const cv = document.getElementById('pongCanvas');
  const ctx = cv.getContext('2d');
  const s1El = document.getElementById('s1');
  const s2El = document.getElementById('s2');
  const sGoalEl = document.getElementById('sGoal');
  const msg = document.getElementById('msg');

  const W = cv.width, H = cv.height;
  const PW = 12, PH = 80, SPEED = 6;
  let p1 = { y: H / 2 - PH / 2, score: 0 };
  let p2 = { y: H / 2 - PH / 2, score: 0 };
  let ball = { x: W / 2, y: H / 2, vx: 4, vy: 3, r: 9 };
  let running = false, paused = false;
  let keys = {};
  let mode = 'cpu';
  let goal = 5;

  document.querySelectorAll('input[name="mode"]').forEach(r =>
    r.addEventListener('change', e => { mode = e.target.value; reset(); }));
  document.querySelectorAll('input[name="goal"]').forEach(r =>
    r.addEventListener('change', e => { goal = parseInt(e.target.value, 10); sGoalEl.textContent = goal; reset(); }));

  document.getElementById('startBtn').addEventListener('click', () => { reset(); running = true; paused = false; msg.textContent = '¡A jugar! Primero en llegar a ' + goal + '.'; });
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  window.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ') { e.preventDefault(); togglePause(); }
  });
  window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

  function togglePause() {
    if (!running) return;
    paused = !paused;
    msg.textContent = paused ? 'En pausa (Espacio para continuar)' : '¡A jugar!';
  }

  function reset() {
    p1.score = 0; p2.score = 0;
    p1.y = p2.y = H / 2 - PH / 2;
    serve(Math.random() < 0.5 ? 1 : -1);
    running = false; paused = false;
    updateHUD();
    msg.textContent = 'Pulsa Iniciar — meta: ' + goal + ' puntos.';
  }

  function serve(dir) {
    ball.x = W / 2; ball.y = H / 2;
    const speed = 4 + (p1.score + p2.score) * 0.15;
    ball.vx = dir * speed;
    ball.vy = (Math.random() * 4 - 2) || 2;
  }

  function updateHUD() { s1El.textContent = p1.score; s2El.textContent = p2.score; sGoalEl.textContent = goal; }

  function step() {
    if (running && !paused) {
      // Jugador 1
      if (keys['w']) p1.y -= SPEED;
      if (keys['s']) p1.y += SPEED;
      // Jugador 2 o CPU
      if (mode === '2p') {
        if (keys['arrowup']) p2.y -= SPEED;
        if (keys['arrowdown']) p2.y += SPEED;
      } else {
        const c = p2.y + PH / 2;
        if (c < ball.y - 8) p2.y += SPEED * 0.75;
        else if (c > ball.y + 8) p2.y -= SPEED * 0.75;
      }
      p1.y = Math.max(0, Math.min(H - PH, p1.y));
      p2.y = Math.max(0, Math.min(H - PH, p2.y));

      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.y - ball.r < 0 || ball.y + ball.r > H) ball.vy *= -1;

      // Paletas
      if (ball.x - ball.r < 20 && ball.y > p1.y && ball.y < p1.y + PH) {
        ball.x = 20 + ball.r; ball.vx = Math.abs(ball.vx) * 1.05;
        ball.vy += (Math.random() * 2 - 1);
      }
      if (ball.x + ball.r > W - 20 && ball.y > p2.y && ball.y < p2.y + PH) {
        ball.x = W - 20 - ball.r; ball.vx = -Math.abs(ball.vx) * 1.05;
        ball.vy += (Math.random() * 2 - 1);
      }

      // Gol
      if (ball.x < 0) { p2.score++; onGoal(2); }
      if (ball.x > W) { p1.score++; onGoal(1); }
    }
    draw();
    requestAnimationFrame(step);
  }

  function onGoal(who) {
    updateHUD();
    if (p1.score >= goal || p2.score >= goal) {
      running = false;
      const name = who === 1 ? '¡Jugador 1 gana!' : (mode === 'cpu' ? '¡La CPU gana!' : '¡Jugador 2 gana!');
      msg.textContent = name + ' (' + p1.score + '–' + p2.score + '). Pulsa Iniciar para revancha.';
    } else {
      serve(who === 1 ? -1 : 1);
    }
  }

  function draw() {
    ctx.fillStyle = '#2f3b2f'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(245,236,215,.5)'; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f5ecd7';
    ctx.fillRect(8, p1.y, PW, PH);
    ctx.fillRect(W - 8 - PW, p2.y, PW, PH);
    ctx.fillStyle = '#e8b04b';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
  }

  reset();
  requestAnimationFrame(step);
})();

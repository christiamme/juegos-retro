(() => {
  const cv = document.getElementById('snakeCanvas');
  const ctx = cv.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const msg = document.getElementById('msg');

  const N = 20, CELL = cv.width / N;
  let snake, dir, nextDir, food, score, alive, lastTime, acc, stepMs;
  let best = parseInt(localStorage.getItem('papiro_snake_best') || '0', 10);
  bestEl.textContent = best;

  function reset() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = { x: 1, y: 0 }; nextDir = dir;
    score = 0; alive = true; stepMs = 140; acc = 0; lastTime = performance.now();
    placeFood();
    scoreEl.textContent = '0';
    msg.textContent = '¡Come manzanas!';
  }

  function placeFood() {
    while (true) {
      const f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
      if (!snake.some(s => s.x === f.x && s.y === f.y)) { food = f; return; }
    }
  }

  function setDir(x, y) {
    if (dir.x === -x && dir.y === -y) return; // no reversa
    if (dir.x === x && dir.y === y) return;
    nextDir = { x, y };
  }

  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'arrowup' || k === 'w') { setDir(0, -1); e.preventDefault(); }
    if (k === 'arrowdown' || k === 's') { setDir(0, 1); e.preventDefault(); }
    if (k === 'arrowleft' || k === 'a') { setDir(-1, 0); e.preventDefault(); }
    if (k === 'arrowright' || k === 'd') { setDir(1, 0); e.preventDefault(); }
  });
  document.querySelectorAll('.dpad button').forEach(b =>
    b.addEventListener('click', () => {
      const d = b.dataset.dir;
      if (d === 'up') setDir(0, -1);
      if (d === 'down') setDir(0, 1);
      if (d === 'left') setDir(-1, 0);
      if (d === 'right') setDir(1, 0);
    }));

  document.getElementById('startBtn').addEventListener('click', reset);

  function tick(now) {
    const dt = now - lastTime; lastTime = now;
    if (alive) {
      acc += dt;
      if (acc >= stepMs) {
        acc = 0; dir = nextDir;
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N ||
            snake.some(s => s.x === head.x && s.y === head.y)) {
          alive = false;
          msg.textContent = 'Fin del juego. Pulsa Iniciar para reintentar.';
          if (score > best) { best = score; localStorage.setItem('papiro_snake_best', String(best)); bestEl.textContent = best; }
        } else {
          snake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            score += 10; scoreEl.textContent = score;
            stepMs = Math.max(70, stepMs - 3);
            placeFood();
          } else snake.pop();
        }
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    ctx.fillStyle = '#3c4a2e'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgba(255,255,255,.08)';
    for (let i = 1; i < N; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, cv.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(cv.width, i * CELL); ctx.stroke();
    }
    // comida
    ctx.fillStyle = '#c0392b';
    ctx.beginPath(); ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.38, 0, Math.PI * 2); ctx.fill();
    // serpiente
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#d9e39a' : '#a9c25d';
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }

  reset(); alive = false;
  msg.textContent = 'Pulsa Iniciar';
  requestAnimationFrame(tick);
})();

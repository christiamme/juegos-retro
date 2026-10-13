(() => {
  const cv = document.getElementById('tetrisCanvas');
  const ctx = cv.getContext('2d');
  const nx = document.getElementById('nextCanvas').getContext('2d');
  const scoreEl = document.getElementById('tScore');
  const linesEl = document.getElementById('tLines');
  const levelEl = document.getElementById('tLevel');
  const msg = document.getElementById('msg');

  const COLS = 10, ROWS = 20, S = 30;
  const SHAPES = {
    I: [[1,1,1,1]], J: [[1,0,0],[1,1,1]], L: [[0,0,1],[1,1,1]],
    O: [[1,1],[1,1]], S: [[0,1,1],[1,1,0]], T: [[0,1,0],[1,1,1]], Z: [[1,1,0],[0,1,1]]
  };
  const COLORS = { I:'#5d7fa3', J:'#7d7fbf', L:'#c96f2e', O:'#c9a83a', S:'#7d9b58', T:'#a3546b', Z:'#b5542d' };
  const KEYS = Object.keys(SHAPES);

  let grid, cur, next, score, lines, level, dropMs, acc, last, running, paused;

  function newPiece() {
    const k = KEYS[Math.floor(Math.random() * KEYS.length)];
    return { shape: SHAPES[k].map(r => r.slice()), color: COLORS[k], x: 3, y: 0 };
  }
  const rot = m => m[0].map((_, i) => m.map(r => r[i]).reverse());
  const cellsOf = p => { const out = []; p.shape.forEach((r, y) => r.forEach((v, x) => { if (v) out.push([p.x + x, p.y + y]); })); return out; };
  const collides = p => cellsOf(p).some(([x, y]) => x < 0 || x >= COLS || y >= ROWS || (y >= 0 && grid[y][x]));

  function reset() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
    cur = newPiece(); next = newPiece();
    score = 0; lines = 0; level = 1; dropMs = 700; acc = 0;
    running = true; paused = false; last = performance.now();
    hud(); msg.textContent = '¡A apilar!';
  }

  function hud() { scoreEl.textContent = score; linesEl.textContent = lines; levelEl.textContent = level; }

  function lock() {
    cellsOf(cur).forEach(([x, y]) => { if (y >= 0) grid[y][x] = cur.color; });
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (grid[y].every(Boolean)) { grid.splice(y, 1); grid.unshift(Array(COLS).fill('')); cleared++; y++; }
    }
    if (cleared) {
      lines += cleared;
      score += [0, 100, 300, 500, 800][cleared] * level;
      level = Math.floor(lines / 10) + 1;
      dropMs = Math.max(90, 700 - (level - 1) * 60);
      hud();
    }
    cur = next; next = newPiece();
    if (collides(cur)) { running = false; msg.textContent = 'Fin del juego. Pulsa Iniciar.'; }
  }

  function step(now) {
    const dt = now - last; last = now;
    if (running && !paused) {
      acc += dt;
      if (acc >= dropMs) { acc = 0; cur.y++; if (collides(cur)) { cur.y--; lock(); } }
    }
    draw(); drawNext();
    requestAnimationFrame(step);
  }

  function drawCell(g, x, y, c) {
    g.fillStyle = c; g.fillRect(x * S + 1, y * S + 1, S - 2, S - 2);
    g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x * S + 1, y * S + 1, S - 2, 5);
  }

  function draw() {
    ctx.fillStyle = '#22303a'; ctx.fillRect(0, 0, cv.width, cv.height);
    grid.forEach((row, y) => row.forEach((c, x) => { if (c) drawCell(ctx, x, y, c); }));
    if (running) cellsOf(cur).forEach(([x, y]) => { if (y >= 0) drawCell(ctx, x, y, cur.color); });
  }

  function drawNext() {
    nx.clearRect(0, 0, 120, 120);
    nx.fillStyle = '#22303a'; nx.fillRect(0, 0, 120, 120);
    next.shape.forEach((r, y) => r.forEach((v, x) => {
      if (v) { nx.fillStyle = next.color; nx.fillRect(20 + x * 20, 20 + y * 20, 18, 18); }
    }));
  }

  window.addEventListener('keydown', e => {
    if (!running) return;
    const k = e.key.toLowerCase();
    if (['arrowleft','arrowright','arrowdown',' '].includes(k) || k === ' ') e.preventDefault();
    if (k === 'p') { paused = !paused; return; }
    if (paused) return;
    const t = { ...cur, shape: cur.shape.map(r => r.slice()) };
    if (k === 'arrowleft') t.x--;
    else if (k === 'arrowright') t.x++;
    else if (k === 'arrowdown') t.y++;
    else if (k === 'arrowup' || k === 'x') t.shape = rot(t.shape);
    else if (k === ' ') { while (!collides({ ...t, y: t.y + 1 })) t.y++; Object.assign(cur, t); cur.y++; lock(); return; }
    else return;
    if (!collides(t)) Object.assign(cur, t);
    else if (k === 'arrowdown') lock();
  });

  document.getElementById('startBtn').addEventListener('click', reset);
  document.getElementById('pauseBtn').addEventListener('click', () => {
    if (!running) return; paused = !paused;
    msg.textContent = paused ? 'En pausa' : '¡A apilar!';
  });

  reset(); running = false;
  msg.textContent = 'Pulsa Iniciar';
  requestAnimationFrame(step);
})();

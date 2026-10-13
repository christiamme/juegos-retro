(() => {
  const boardEl = document.getElementById('board');
  const status = document.getElementById('status');
  const wX = document.getElementById('wX');
  const wO = document.getElementById('wO');
  const wD = document.getElementById('wD');

  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let cells = Array(9).fill('');
  let turn = 'X';
  let over = false;
  let mode = 'pvp';
  let wins = { X: 0, O: 0, D: 0 };

  document.querySelectorAll('input[name="gmode"]').forEach(r =>
    r.addEventListener('change', e => { mode = e.target.value; newRound(); }));
  document.getElementById('nextRound').addEventListener('click', newRound);
  document.getElementById('resetMatch').addEventListener('click', () => {
    wins = { X: 0, O: 0, D: 0 }; paintScore(); newRound();
  });

  function build() {
    boardEl.innerHTML = '';
    cells.forEach((_, i) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => play(i));
      boardEl.appendChild(b);
    });
  }

  function paint() {
    [...boardEl.children].forEach((b, i) => {
      b.textContent = cells[i];
      b.disabled = over || cells[i] !== '';
    });
  }

  function paintScore() { wX.textContent = wins.X; wO.textContent = wins.O; wD.textContent = wins.D; }

  function winner() {
    for (const [a, b, c] of LINES)
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return { who: cells[a], line: [a, b, c] };
    if (cells.every(v => v)) return { who: 'D', line: [] };
    return null;
  }

  function play(i) {
    if (over || cells[i]) return;
    cells[i] = turn;
    const w = winner();
    if (w) return endRound(w);
    turn = turn === 'X' ? 'O' : 'X';
    paint();
    status.textContent = 'Turno de ' + turn;
    if (mode === 'cpu' && turn === 'O' && !over) setTimeout(cpuMove, 350);
  }

  function cpuMove() {
    if (over) return;
    // 1. ganar, 2. bloquear, 3. centro, 4. aleatorio
    const empty = cells.map((v, i) => v ? null : i).filter(v => v !== null);
    const pick = tryWin('O') ?? tryWin('X') ?? (cells[4] === '' ? 4 : null) ?? empty[Math.floor(Math.random() * empty.length)];
    if (pick !== null && pick !== undefined) play(pick);
  }

  function tryWin(mark) {
    for (const [a, b, c] of LINES) {
      const trio = [cells[a], cells[b], cells[c]];
      if (trio.filter(v => v === mark).length === 2 && trio.includes('')) {
        if (cells[a] === '') return a;
        if (cells[b] === '') return b;
        return c;
      }
    }
    return null;
  }

  function endRound(w) {
    over = true;
    w.line.forEach(i => boardEl.children[i].classList.add('win'));
    if (w.who === 'D') { wins.D++; status.textContent = 'Empate. ¡Otra ronda!'; }
    else { wins[w.who]++; status.textContent = '¡Gana ' + w.who + ' esta ronda! (' + wins.X + '–' + wins.O + ')'; }
    paintScore(); paint();
  }

  function newRound() {
    cells = Array(9).fill('');
    turn = 'X'; over = false;
    [...boardEl.children].forEach(b => b.classList.remove('win'));
    status.textContent = 'Turno de X — ronda nueva';
    paint();
  }

  build(); paintScore(); paint();
})();

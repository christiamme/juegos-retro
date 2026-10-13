const featured = [
  { title: 'Pong', desc: 'El clásico de paletas. Elige jugar a 5 o 10 puntos, contra la CPU o contra un amigo.', href: 'juegos/pong.html', art: 'cover cover-pong', artHTML: '<div class="net"></div><div class="pad l"></div><div class="pad r"></div><div class="ball"></div>' },
  { title: 'Snake', desc: 'Come, crece y no te muerdas. Récord guardado en tu navegador.', href: 'juegos/snake.html', art: 'cover cover-snake', artHTML: '<div class="snake"><div class="s"></div><div class="s"></div><div class="s head">›</div><div class="food"></div></div>' },
  { title: 'Gato', desc: 'Tres en raya contra un amigo o la CPU, con marcador de rondas ganadas.', href: 'juegos/gato.html', art: 'cover cover-gato', artHTML: '<div class="mini-grid"><div>X</div><div>O</div><div>X</div><div>O</div><div class="win">X</div><div></div><div></div><div>O</div><div>X</div></div>' },
  { title: 'Tetris', desc: 'Apila bloques, limpia líneas y sube de nivel.', href: 'juegos/tetris.html', art: 'cover cover-tetris', artHTML: '<div class="tblock t1"></div><div class="tblock t2"></div><div class="tblock t3"></div><div class="tblock t4"></div>' },
];

const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');
const heroBtn = document.getElementById('heroBtn');
const heroArt = document.getElementById('heroArt');
const dotsBox = document.getElementById('heroDots');
let idx = 0, timer = null;

function show(i) {
  idx = (i + featured.length) % featured.length;
  const f = featured[idx];
  heroTitle.textContent = f.title;
  heroDesc.textContent = f.desc;
  heroBtn.href = f.href;
  heroBtn.textContent = 'Jugar ' + f.title;
  heroArt.className = 'hero-art ' + f.art;
  heroArt.innerHTML = f.artHTML;
  dotsBox.querySelectorAll('button').forEach((b, j) => b.classList.toggle('active', j === idx));
}

featured.forEach((_, j) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Destacado ' + (j + 1));
  b.addEventListener('click', () => { show(j); restart(); });
  dotsBox.appendChild(b);
});

function restart() { clearInterval(timer); timer = setInterval(() => show(idx + 1), 4000); }
show(0); restart();

// Búsqueda / filtro
const search = document.getElementById('search');
const cards = document.querySelectorAll('#gameGrid .card');
search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  cards.forEach(c => {
    const name = (c.dataset.name + ' ' + c.querySelector('h3').textContent).toLowerCase();
    c.style.display = name.includes(q) ? '' : 'none';
  });
});

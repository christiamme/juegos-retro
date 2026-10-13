# 📜 Papiro Games

Homepage estilo Steam con 4 juegos clásicos jugables en el navegador. Sin dependencias, sin build: solo **HTML + CSS + JS** vanilla. Estética de papel papiro en beige claro.

## 🎮 Juegos

| Juego | Descripción | Modos |
|-------|-------------|-------|
| 🏓 **Pong** | Paletas y rebote infinito | 1P vs CPU · 2 jugadores · meta a **5 o 10 puntos** a elección |
| 🐍 **Snake** | Come, crece y no te muerdas | 1 jugador · récord en `localStorage` · velocidad progresiva |
| ❌ **Gato** | Tres en raya | 2 jugadores · vs CPU · **marcador de rondas** (X / O / empates) |
| 🧱 **Tetris** | Apila bloques y limpia líneas | 1 jugador · puntos, líneas, niveles y pieza siguiente |

## 📁 Estructura

```
├── index.html          # homepage (hero + catálogo + búsqueda)
├── css/style.css       # tema papiro compartido + portadas CSS
├── js/main.js          # hero rotativo + filtro de búsqueda
├── js/pong.js
├── js/snake.js
├── js/gato.js
├── js/tetris.js
└── juegos/             # pong.html, snake.html, gato.html, tetris.html
```

## 🚀 Cómo jugar

1. Abre `index.html` en tu navegador (doble clic basta, no requiere servidor).
2. Elige un juego en el catálogo o en el destacado.
3. Juega. Para volver, usa el botón **← Volver**.

O con servidor local:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## 🕹️ Controles

- **Pong:** J1 `W`/`S` · J2 `↑`/`↓` · pausa `Espacio`
- **Snake:** `↑↓←→` o `WASD` (+ pad táctil en pantalla)
- **Gato:** clic/toque en las casillas
- **Tetris:** `←→` mover · `↓` bajar · `↑`/`X` rotar · `Espacio` caída instantánea · `P` pausa

## 🎨 Paleta papiro

Fondo `#f5ecd7` · paneles `#e8dcc0` · bordes `#d4c5a0` · texto `#3e2f1c` · acento terracota `#b5542d`. Textura de papel y portadas hechas 100% con CSS (sin imágenes).

## 📄 Licencia

Uso libre para fines educativos.

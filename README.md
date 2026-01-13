```markdown
# LottozahlenGenerator

Dieses Projekt liefert einen kleinen Lottozahlen-Generator mit Web-Frontend.

Features:
- Web-Frontend mit animierter Erzeugung der Zahlen (`static/`).
- Speicherung des Verlaufs in `localStorage`.
- WebAssembly-Backend (Rust) in `rust/` — kann mit `wasm-pack` gebaut werden.
- Fallback-JavaScript-Generator, falls WASM nicht gebaut wurde.

Schnellstart (lokal öffnen):

1. Öffne `static/index.html` in einem Browser (oder starte einen lokalen Webserver).

WASM bauen (optional):

1. Installiere `wasm-pack`.
2. Im Projektordner: `cd rust && wasm-pack build --target web`.
3. Das bundelt ein `pkg/`-Verzeichnis, das automatisch vom Frontend geladen wird.

Tests (Node.js):

1. `node tests/test_generator.js`

Designhinweise:
- Die Erzeugung vermeidet offensichtliche Muster (z.B. alle Zahlen < 32), prüft auf
	zu lange Sequenzen und auf Duplikate.
- Der Frontend-Code lädt das gebaute WASM-Modul falls vorhanden, sonst den Fallback.

Lizenz: Unbestimmt — nutze frei für Lernzwecke.

```
# LottozahlenGenerator
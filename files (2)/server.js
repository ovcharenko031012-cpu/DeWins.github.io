// DeWins: один сервер для сайта + лента дропов и онлайн в реальном времени.
// Запуск:  npm install  →  npm start  →  открой http://localhost:8080
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const ROOT = path.join(__dirname, '..');
const PUBLIC = { 'index.html': 'text/html; charset=utf-8', 'style.css': 'text/css; charset=utf-8',
                 'script.js': 'text/javascript; charset=utf-8', 'promos.js': 'text/javascript; charset=utf-8' };
const RARITIES = ['c', 'u', 'r', 'e', 'l'];
const TYPES = ['pistol', 'rifle', 'knife', 'glove'];
const NICK_RE = /^[A-Za-z0-9А-Яа-яІіЇїЄєҐґ_ .-]{4,24}$/;
const history = [];

// --- сайт: отдаём только разрешённые файлы ---
const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url === '/health') { res.writeHead(200); return res.end('ok'); }
  if (url === '/config.js') {            // включает реальный режим автоматически
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end("window.DEWINS_CONFIG={liveUrl:'auto'};");
  }
  const name = url === '/' ? 'index.html' : url.slice(1);
  if (!Object.prototype.hasOwnProperty.call(PUBLIC, name)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(path.join(ROOT, name), (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': PUBLIC[name] });
    res.end(data);
  });
});

// --- реальное время ---
const wss = new WebSocketServer({
  server,
  maxPayload: 1024,
  // ORIGIN=https://мой-сайт.com  — разрешить подключения только с твоего сайта (необязательно)
  verifyClient: (info) => !process.env.ORIGIN || info.origin === process.env.ORIGIN,
});

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  wss.clients.forEach((c) => { if (c.readyState === 1) c.send(msg); });
}
const sendOnline = () => broadcast({ type: 'online', n: wss.clients.size });

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  ws.send(JSON.stringify({ type: 'history', items: history.slice(0, 24) }));
  sendOnline();
  let lastDrop = 0;

  ws.on('message', (raw) => {
    let d;
    try { d = JSON.parse(raw); } catch { return; }
    if (!d || d.type !== 'drop' || !d.item) return;
    const it = d.item;
    if (typeof it.name !== 'string' || it.name.length < 1 || it.name.length > 40) return;
    if (!RARITIES.includes(it.rar) || !TYPES.includes(it.type)) return;
    const now = Date.now();
    if (now - lastDrop < 1000) return;   // не чаще 1 дропа в секунду от одного клиента
    lastDrop = now;
    const nick = typeof it.nick === 'string' && NICK_RE.test(it.nick) ? it.nick : 'Игрок';
    const item = { name: it.name, type: it.type, rar: it.rar, nick };
    history.unshift(item);
    if (history.length > 50) history.length = 50;
    broadcast({ type: 'drop', item });
  });

  ws.on('close', sendOnline);
  ws.on('error', () => {});
});

// раз в 30 сек отключаем «мёртвые» соединения, чтобы онлайн был точным
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

server.listen(PORT, () => console.log('DeWins запущен: http://localhost:' + PORT));

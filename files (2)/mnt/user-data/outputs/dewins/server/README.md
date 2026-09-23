# DeWins live-сервер

Один сервер отдаёт сайт и считает онлайн + ленту дропов в реальном времени.

    cd server
    npm install
    npm start

Открой http://localhost:8080 — в ленте будут только реальные игроки.
Открой сайт в двух вкладках: онлайн станет 2, а дроп из одной вкладки появится в другой.

Хостинг: Render / Railway / Fly.io (тип «Web Service», Node).
Root directory: корень проекта, Start command: `node server/server.js`, Build command: `cd server && npm install`.
Переменная ORIGIN=https://твой-адрес (необязательно) ограничивает подключения к WebSocket только твоим сайтом.

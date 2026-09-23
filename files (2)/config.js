/* DeWins — настройки */
window.DEWINS_CONFIG = {
  /* Лента дропов и счётчик онлайна. Выбери ОДИН вариант:

     1) Google Firebase (без своего сервера) — заполни блок ниже:
        firebase: { apiKey:'...', authDomain:'...', databaseURL:'https://ИМЯ-default-rtdb.firebaseio.com', projectId:'...', appId:'...' }
        (все значения — из Firebase Console → Project settings → Your apps → Web app → Config)

     2) Свой сервер: liveUrl: 'auto' (сайт и сервер на одном адресе) или 'wss://твой-сервер.com'

     3) Ничего не заполнять = демо-режим: дропы и онлайн имитируются в браузере. */
  firebase: null,
  liveUrl: ''
};

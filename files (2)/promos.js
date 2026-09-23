/* ============================================================
   DeWins — промокоды
   Здесь можно добавлять, менять и удалять коды. Больше нигде
   ничего править не нужно. Каждый код работает один раз на аккаунт.

   Формат:  'КОД': { тип и параметры }   (код пиши ЗАГЛАВНЫМИ буквами)

   Типы промокодов:
   1) Деньги на баланс
      'WELCOME': { type: 'balance', amount: 500 }

   2) Бесплатные открытия кейса
      'FREEDEW': { type: 'freecase', case: 'dew', count: 3 }

   3) Случайный предмет нужной редкости из кейса
      'RAINDROP': { type: 'item', case: 'storm', rarity: 'r' }

   Необязательно: срок действия (включительно), формат ГГГГ-ММ-ДД
      expires: '2026-12-31'

   ID кейсов:   dew (Росинка), dusk (Полночь), storm (Гроза),
                waste (Пустошь), retro (Ретро), neon (Неон),
                deep (Глубина), crown (Корона)
   Редкость:    c обычный, u необычный, r редкий, e эпический, l легендарный

   ВАЖНО: это сайт без сервера, поэтому файл promos.js виден любому,
   кто откроет сайт. Для настоящих секретных кодов нужна серверная проверка.
   ============================================================ */
window.DEWINS_PROMOS = {
  'DEWINS':    { type: 'balance',  amount: 250 },
  'WELCOME':   { type: 'balance',  amount: 500, expires: '2026-12-31' },
  'FREEDEW':   { type: 'freecase', case: 'dew',   count: 3 },
  'STORMFREE': { type: 'freecase', case: 'storm', count: 1 },
  'RAINDROP':  { type: 'item',     case: 'storm', rarity: 'r' },
  'GOLDRUSH':  { type: 'item',     case: 'deep',  rarity: 'e' },
  'DexWins':  { type: 'item',     case: 'deep',  rarity: 'e' },
};

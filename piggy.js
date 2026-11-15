// Shared by all of piggy's games: coins (mynt) that you earn by finishing games,
// and the hat shop where they buy new hats. Everything is saved in the browser.
//
// A game uses it like this:
//   <span id="hats"></span>                         where the hat shop button should go
//   Piggy.mount(document.getElementById('hats'));
//   let hat = Piggy.hat();  Piggy.onHatChange(h => { hat = h; });
//   const earned = Piggy.reward(10);                when the game is completed
const Piggy = (() => {
  const HATS = [
    { hat: null, icon: '🚫', name: 'Ingen hatt', price: 0 },
    { hat: '🎩', name: 'Hög hatt', price: 0 },
    { hat: '👑', name: 'Krona', price: 0 },
    { hat: '🧢', name: 'Keps', price: 0 },
    { hat: '👒', name: 'Solhatt', price: 0 },
    { hat: '🎓', name: 'Studentmössa', price: 0 },
    { hat: '🎀', name: 'Rosett', price: 0 },
    // These have to be bought with coins. Anything can be a hat!
    { hat: '🌸', name: 'Blomma', price: 10 },
    { hat: '🍌', name: 'Banan', price: 12 },
    { hat: '🍄', name: 'Svamp', price: 15 },
    { hat: '⛑️', name: 'Hjälm', price: 20 },
    { hat: '🧁', name: 'Muffin', price: 25 },
    { hat: '🐸', name: 'Groda', price: 30 },
    { hat: '🍦', name: 'Glass', price: 35 },
    { hat: '🎃', name: 'Pumpa', price: 40 },
    { hat: '🐢', name: 'Sköldpadda', price: 45 },
    { hat: '🦆', name: 'Anka', price: 50 },
    { hat: '🌵', name: 'Kaktus', price: 55 },
    { hat: '🍕', name: 'Pizza', price: 60 },
    { hat: '🍉', name: 'Vattenmelon', price: 70 },
    { hat: '🌈', name: 'Regnbåge', price: 80 },
    { hat: '🦖', name: 'Dinosaurie', price: 90 },
    { hat: '🦄', name: 'Enhörning', price: 100 },
    { hat: '🚀', name: 'Raket', price: 110 },
    { hat: '🐙', name: 'Bläckfisk', price: 120 },
    { hat: '🪐', name: 'Planet', price: 150 },
  ];

  // ---- Saved state (storage can be blocked, e.g. in private windows: then it lasts until reload) ----
  const get = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch (_) { /* storage blocked */ } };
  let coins = Number(get('piggyCoins')) || 0;
  let bought = [];
  try { bought = JSON.parse(get('piggyHatsBought')) || []; } catch (_) { bought = []; }
  let hat = get('piggyHat') || null;
  const owns = h => h.price === 0 || bought.includes(h.hat);
  if (hat && !HATS.some(h => h.hat === hat && owns(h))) hat = null;

  const listeners = [];
  const buttons = [];

  function save() {
    set('piggyCoins', String(coins));
    set('piggyHatsBought', JSON.stringify(bought));
    set('piggyHat', hat || '');
  }

  // ---- Looks (only uses classes starting with pg- so it never clashes with a game) ----
  const css = `
    .pg-btn { font: inherit; font-size: 20px; border: none; border-radius: 14px; padding: 6px 14px;
      background: #fff; color: #5a3b2e; cursor: pointer; box-shadow: 0 3px 0 #0002; touch-action: manipulation; }
    .pg-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 #0002; }
    .pg-btn.pg-pulse { animation: pg-pulse 0.6s 3; }
    @keyframes pg-pulse { 50% { transform: scale(1.2); background: #ffe27a; } }
    .pg-shop { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      background: #0005; padding: 16px; z-index: 100; touch-action: manipulation; }
    .pg-card { max-width: 560px; width: 100%; max-height: calc(100vh - 32px); overflow-y: auto; background: #fff;
      color: #5a3b2e; border-radius: 24px; padding: 20px 24px; text-align: center; box-shadow: 0 10px 40px #0003;
      font-family: "Comic Sans MS", "Chalkboard SE", "Comic Neue", system-ui, sans-serif; }
    .pg-card h2 { margin: 0 0 4px; font-size: 30px; }
    .pg-coins { font-size: 24px; margin-bottom: 12px; }
    .pg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; }
    .pg-hat { font: inherit; border: 3px solid transparent; border-radius: 16px; padding: 8px 4px; cursor: pointer;
      background: #fdf3e1; color: #5a3b2e; display: flex; flex-direction: column; align-items: center; gap: 2px;
      box-shadow: 0 3px 0 #0001; }
    .pg-hat .pg-icon { font-size: 40px; line-height: 1.2; }
    .pg-hat .pg-name { font-size: 15px; }
    .pg-hat .pg-tag { font-size: 16px; font-weight: bold; }
    .pg-hat.pg-chosen { border-color: #ff8fb1; background: #ffe3ec; }
    .pg-hat.pg-locked { background: #f1ece6; }
    .pg-hat.pg-locked .pg-icon { filter: grayscale(1); opacity: 0.45; }
    .pg-hat.pg-afford { background: #fff6cf; border-color: #ffc35a; }
    .pg-hat.pg-afford .pg-icon { filter: none; opacity: 1; }
    .pg-hat.pg-new { animation: pg-pop 0.5s; }
    @keyframes pg-pop { 0% { transform: scale(0.5); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
    .pg-hat.pg-shake { animation: pg-shake 0.4s; }
    @keyframes pg-shake { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
    .pg-top { position: sticky; top: -20px; z-index: 1; background: #fff; margin: 0 -8px; padding: 0 8px 4px; }
    .pg-preview { position: relative; display: inline-block; font-size: 72px; line-height: 1; margin: 22px 0 6px; }
    .pg-phat { position: absolute; left: 50%; top: -0.32em; font-size: 0.5em; transform: translateX(-50%) rotate(-12deg); }
    .pg-phat.pg-new { animation: pg-hatpop 0.4s; }
    @keyframes pg-hatpop { 0% { transform: translateX(-50%) translateY(-30px) rotate(-12deg); opacity: 0; } }
    .pg-hat.pg-trying { border-color: #ffc35a; border-style: dashed; }
    .pg-hat.pg-trying .pg-icon { filter: none; opacity: 1; }
    .pg-buy { font: inherit; font-size: 22px; border: none; border-radius: 14px; padding: 8px 20px; cursor: pointer;
      background: #ffc35a; color: #5a3b2e; box-shadow: 0 3px 0 #c98a1e; margin: 0 6px 14px; }
    .pg-buy.pg-poor { background: #e6ded5; box-shadow: 0 3px 0 #0002; }
    .pg-buy.pg-shake { animation: pg-shake 0.4s; }
    .pg-msg { min-height: 1.4em; margin: 4px 0 10px; font-size: 19px; }
    .pg-done { font: inherit; font-size: 24px; margin-top: 16px; border: none; border-radius: 14px; padding: 8px 24px; cursor: pointer;
      background: #ff8fb1; color: #fff; box-shadow: 0 3px 0 #c4577b; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---- The button that opens the shop: shows the hat you wear and your coins ----
  function refreshButtons() {
    for (const b of buttons) b.textContent = `${hat || '🎩'} Hattar · 🪙 ${coins}`;
  }

  function mount(el) {
    const btn = document.createElement('button');
    btn.className = 'pg-btn';
    btn.title = 'Hattbutiken: välj eller köp en hatt åt grisen';
    btn.onclick = () => { btn.blur(); open(); };
    el.appendChild(btn);
    buttons.push(btn);
    refreshButtons();
  }

  // ---- The shop ----
  let shop = null;
  let trying = null;   // a hat that isn't bought yet but that the pig is trying on in the shop
  function open() {
    if (shop) return;
    shop = document.createElement('div');
    shop.className = 'pg-shop';
    shop.innerHTML = `
      <div class="pg-card" role="dialog" aria-label="Hattbutiken">
        <h2>🎩 Hattbutiken</h2>
        <div class="pg-coins"></div>
        <div class="pg-top">
          <div class="pg-preview"><span class="pg-phat"></span>🐷</div>
          <p class="pg-msg">Tryck på en hatt för att prova den! Klara spel för att tjäna mynt 🪙</p>
          <button class="pg-buy" hidden></button>
        </div>
        <div class="pg-grid"></div>
        <button class="pg-done">Klar ✔️</button>
      </div>`;
    shop.querySelector('.pg-done').onclick = close;
    shop.querySelector('.pg-buy').onclick = () => buy(trying);
    shop.addEventListener('click', e => { if (e.target === shop) close(); });   // tap outside the card
    document.body.appendChild(shop);
    renderShop();
    shop.querySelector('.pg-done').focus({ preventScroll: true });
  }

  function close() {
    if (!shop) return;
    shop.remove();
    shop = null;
    trying = null;   // a hat you only tried on comes off again
  }

  function say(text) { shop.querySelector('.pg-msg').textContent = text; }

  function renderShop(popHat) {
    shop.querySelector('.pg-coins').textContent = `Du har 🪙 ${coins} mynt`;
    const worn = trying ? trying.hat : hat;
    const phat = shop.querySelector('.pg-phat');
    phat.textContent = worn || '';
    phat.classList.remove('pg-new');
    if (popHat !== undefined) { void phat.offsetWidth; phat.classList.add('pg-new'); }
    const buyBtn = shop.querySelector('.pg-buy');
    buyBtn.hidden = !trying;
    if (trying) {
      buyBtn.textContent = `Köp ${trying.hat} för 🪙 ${trying.price}`;
      buyBtn.classList.toggle('pg-poor', coins < trying.price);
    }
    const grid = shop.querySelector('.pg-grid');
    grid.innerHTML = '';
    for (const h of HATS) {
      const b = document.createElement('button');
      const have = owns(h);
      b.className = 'pg-hat';
      if (h.hat === hat && !trying) b.classList.add('pg-chosen');
      if (h === trying) b.classList.add('pg-trying');
      if (!have) b.classList.add('pg-locked');
      if (!have && coins >= h.price) b.classList.add('pg-afford');
      if (h.hat === popHat) b.classList.add('pg-new');
      const tag = h === trying ? '👀 Provar' : h.hat === hat && !trying ? '✔️ På' : have ? 'Välj' : `🪙 ${h.price}`;
      b.innerHTML = `<span class="pg-icon">${h.icon || h.hat}</span><span class="pg-name">${h.name}</span><span class="pg-tag">${tag}</span>`;
      b.onclick = () => choose(h);
      grid.appendChild(b);
    }
  }

  // Tapping a hat you own puts it on. Tapping one you don't own lets the pig try it on first;
  // tapping it again (or the buy button) buys it.
  function choose(h) {
    if (!owns(h)) {
      if (trying === h) { buy(h); return; }
      trying = h;
      const left = h.price - coins;
      say(left > 0
        ? `Grisen provar ${h.name.toLowerCase()} ${h.hat}. Den kostar ${h.price} mynt, du behöver ${left} till.`
        : `Grisen provar ${h.name.toLowerCase()} ${h.hat}. Vill du köpa den för ${h.price} mynt?`);
      renderShop(h.hat);
      return;
    }
    trying = null;
    say(h.hat ? `Grisen har på sig ${h.name.toLowerCase()} ${h.hat}` : 'Ingen hatt');
    wear(h, h.hat);
  }

  function buy(h) {
    if (!h) return;
    if (coins < h.price) {
      const btn = shop.querySelector('.pg-buy');
      btn.classList.remove('pg-shake');
      void btn.offsetWidth;   // restart the shake
      btn.classList.add('pg-shake');
      say(`${h.hat} kostar ${h.price} mynt. Du behöver ${h.price - coins} till!`);
      return;
    }
    coins -= h.price;
    bought.push(h.hat);
    trying = null;
    say(`Du köpte ${h.name.toLowerCase()} ${h.hat}! 🎉`);
    wear(h, h.hat);
  }

  function wear(h, popHat) {
    hat = h.hat;
    save();
    renderShop(popHat);
    refreshButtons();
    listeners.forEach(cb => cb(hat));
  }

  // While the shop is open, keys and taps belong to the shop and not to the game behind it
  addEventListener('keydown', e => {
    if (!shop) return;
    if (e.key === 'Escape') close();
    e.stopImmediatePropagation();
  }, true);
  addEventListener('pointerdown', e => { if (shop) e.stopImmediatePropagation(); }, true);

  // ---- Earning coins ----
  function reward(n) {
    coins += n;
    save();
    refreshButtons();
    for (const b of buttons) {
      b.classList.remove('pg-pulse');
      void b.offsetWidth;
      b.classList.add('pg-pulse');
    }
    return n;
  }

  return {
    mount, reward, open, close,
    isOpen: () => !!shop,
    hat: () => hat,
    coins: () => coins,
    onHatChange: cb => listeners.push(cb),
  };
})();

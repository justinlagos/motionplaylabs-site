/* ===== Festival Town: remote control, keyboard and gamepad play =====
   Five keys do everything: four arrows move a big ring between the things you can press,
   OK presses the thing under the ring, Back goes to the map, the town, then the title.
   Works with: Android TV and Google TV remotes, Fire TV remotes, Samsung and LG TV remotes,
   HDMI-CEC remotes through Chromecast, keyboards on laptops, and game controllers.

   The game itself is built from <button> elements and every activity already works with
   taps alone (tap a thing, then tap where it goes), so the remote only has to move a ring
   and press. Nothing here changes the activities.

   Platform wrappers can call window.FT_TV.back() when the hardware Back button is pressed
   (it returns true when the game handled it) and set window.FT_TV.exit to a function that
   closes the app. */
(function(){
  'use strict';
  if (window.FT_TV) return;

  /* ---------- platform ---------- */
  const UA = navigator.userAgent || '';
  const q = new URLSearchParams(location.search);
  const PLATFORM = (function(){
    if (window.FT_PLATFORM) return String(window.FT_PLATFORM);
    if (q.get('platform')) return q.get('platform');
    if (/Tizen/i.test(UA)) return 'tizen';
    if (/Web0S|webOS|NetCast/i.test(UA)) return 'webos';
    if (/AFT[A-Z0-9]|FireTV|Fire TV/i.test(UA)) return 'firetv';
    if (/Android TV|GoogleTV|BRAVIA|CrKey|SHIELD|AndroidTV/i.test(UA)) return 'androidtv';
    if (/VIDAA|Hisense|SMART-TV|SmartTV|HbbTV/i.test(UA)) return 'tv';
    return 'web';
  })();
  const TV_PLATFORMS = ['androidtv', 'firetv', 'tizen', 'webos', 'tv'];
  const IS_TV = TV_PLATFORMS.includes(PLATFORM) || q.get('tv') === '1' || (window.matchMedia && matchMedia('(pointer: none)').matches && !('ontouchstart' in window));

  const app = document.getElementById('app');
  if (IS_TV){
    app.dataset.tv = '1'; document.documentElement.classList.add('tv');
    /* the stage was measured before the overscan inset applied: measure again */
    const refit = () => { try { if (typeof fit === 'function') fit(); else window.dispatchEvent(new Event('resize')); } catch (e) {} };
    refit(); setTimeout(refit, 50);
  }

  /* ---------- key map ---------- */
  const KEY = {
    left:  new Set(['ArrowLeft', 'Left', 'a', 'A']),
    right: new Set(['ArrowRight', 'Right', 'd', 'D']),
    up:    new Set(['ArrowUp', 'Up', 'w', 'W']),
    down:  new Set(['ArrowDown', 'Down', 's', 'S']),
    ok:    new Set(['Enter', ' ', 'Spacebar', 'Select', 'OK', 'NumpadEnter']),
    back:  new Set(['Escape', 'Esc', 'GoBack', 'BrowserBack', 'XF86Back', 'Backspace']),
    again: new Set(['MediaPlayPause', 'MediaPlay', 'ContextMenu', 'Menu', 'r', 'R', 'ColorF0Red'])
  };
  const CODE = { 37:'left', 38:'up', 39:'right', 40:'down', 13:'ok', 32:'ok',
    27:'back', 8:'back', 4:'back', 166:'back', 10009:'back', 461:'back', 65385:'back',
    82:'again', 415:'again', 19:'again', 10252:'again', 179:'again', 403:'again' };
  function action(e){
    for (const k in KEY) if (KEY[k].has(e.key)) return k;
    return CODE[e.keyCode] || null;
  }

  /* ---------- the ring ---------- */
  const ring = document.createElement('div'); ring.id = 'tvring'; document.body.appendChild(ring);
  const hint = document.createElement('div'); hint.id = 'tvhint'; hint.innerHTML = '<b>&larr;</b><b>&uarr;</b><b>&darr;</b><b>&rarr;</b> move &nbsp; <b>OK</b> press &nbsp; <b>Back</b> go back'; document.body.appendChild(hint);
  let focused = null, lastRect = null, ringOn = false, hintShown = false, ringLoop = 0;

  function showHint(){
    if (hintShown || !IS_TV) return; hintShown = true;
    try { if (localStorage.getItem('ft.tvhint') === '1') return; localStorage.setItem('ft.tvhint', '1'); } catch (e) {}
    hint.classList.add('on'); setTimeout(() => hint.classList.remove('on'), 6000);
  }
  function radiusOf(el){
    const r = getComputedStyle(el).borderTopLeftRadius || '28px';
    if (r.endsWith('%')) return '50%';
    const v = parseFloat(r); return (isFinite(v) && v > 12 ? Math.min(v + 10, 60) : 28) + 'px';
  }
  let painted = '', burstUntil = 0, slowT = 0;
  function paint(){
    if (!focused || !ringOn) return;
    const r = focused.getBoundingClientRect();
    if (!r.width && !r.height) return;
    const pad = focused.classList.contains('obj') || focused.classList.contains('tile') || focused.classList.contains('card') ? 10 : 8;
    const bw = Math.max(5, Math.min(window.innerWidth, window.innerHeight) * .0055);
    const L = Math.round(r.left - pad - bw), T = Math.round(r.top - pad - bw), W = Math.round(r.width + 2 * (pad + bw)), H = Math.round(r.height + 2 * (pad + bw));
    lastRect = { x:r.left + r.width / 2, y:r.top + r.height / 2 };
    const key = L + ',' + T + ',' + W + ',' + H;
    if (key === painted) return;
    painted = key;
    ring.style.left = L + 'px'; ring.style.top = T + 'px'; ring.style.width = W + 'px'; ring.style.height = H + 'px';
    ring.style.borderRadius = radiusOf(focused);
  }
  function burst(ms){ burstUntil = Math.max(burstUntil, performance.now() + (ms || 900)); if (ringOn && !ringLoop) ringLoop = requestAnimationFrame(tick); }
  function tick(){ paint(); ringLoop = ringOn && performance.now() < burstUntil ? requestAnimationFrame(tick) : 0; }
  function ringShow(on){
    ringOn = on; ring.classList.toggle('on', on && !!focused);
    if (on){ burst(); if (!slowT) slowT = setInterval(() => { if (ringOn && !ringLoop) paint(); }, 250); }
    if (!on){ if (ringLoop){ cancelAnimationFrame(ringLoop); ringLoop = 0; } if (slowT){ clearInterval(slowT); slowT = 0; } }
  }
  function flash(cls){ ring.classList.remove(cls); void ring.offsetWidth; ring.classList.add(cls); }

  /* ---------- what can be pressed right now ---------- */
  const parentEl = document.getElementById('parent');
  const leaveEl = () => document.getElementById('tvleave');
  let csCache = null;
  const styleOf = el => { if (!csCache) return getComputedStyle(el); let c = csCache.get(el); if (!c){ c = getComputedStyle(el); csCache.set(el, c); } return c; };
  function visible(el){
    if (!el.isConnected) return false;
    const cs = styleOf(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .08) return false;
    if (cs.pointerEvents === 'none' && !el.classList.contains('wait')) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return false;
    if (r.right < 0 || r.bottom < 0 || r.left > window.innerWidth || r.top > window.innerHeight) return false;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement){
      if (p.hidden) return false;
      const ps = styleOf(p); if (ps.display === 'none' || ps.visibility === 'hidden' || +ps.opacity < .08) return false;
    }
    /* covered by something else (a card, the iris, a panel)? */
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    if (top && top !== el && !el.contains(top) && !top.contains(el)){
      /* objects have an invisible 12px hit halo; try a point nearer the top-left */
      const t2 = document.elementFromPoint(r.left + r.width * .3, r.top + r.height * .3);
      if (t2 && t2 !== el && !el.contains(t2)) return false;
    }
    return true;
  }
  const SEL = 'button, [role="button"], [role="tab"], input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])';
  function scope(){
    const L = leaveEl(); if (L && !L.hidden) return L;
    if (parentEl && !parentEl.hidden) return parentEl;
    return document.getElementById('stage');
  }
  function isHud(el){ return !!el.closest('#hud'); }
  function irisShut(){ try { return typeof Iris !== 'undefined' && Iris.isShut && (Iris.isShut() || Iris.busy); } catch (e) { return false; } }
  function candidates(){
    const root = scope();
    if (root.id === 'stage' && irisShut()) return [];
    csCache = new Map();
    try {
      const list = [...root.querySelectorAll(SEL)].filter(el => !el.disabled && el.getAttribute('aria-disabled') !== 'true' && !el.classList.contains('off') && visible(el));
      if (root.id === 'stage'){
        const task = document.getElementById('task');
        if (task && !task.hidden && visible(task)) list.push(task);
      }
      return list;
    } finally { csCache = null; }
  }
  const content = list => list.filter(el => !isHud(el) && el.id !== 'task');

  /* ---------- choosing where to go ---------- */
  function center(el){ const r = el.getBoundingClientRect(); return { l:r.left, t:r.top, r:r.right, b:r.bottom, x:r.left + r.width / 2, y:r.top + r.height / 2 }; }
  function pickDir(cur, list, dir){
    const c = cur ? center(cur) : (lastRect ? { l:lastRect.x, r:lastRect.x, t:lastRect.y, b:lastRect.y, x:lastRect.x, y:lastRect.y } : null);
    if (!c) return list[0] || null;
    let best = null, bestScore = Infinity, loose = null, looseScore = Infinity;
    for (const el of list){
      if (el === cur) continue;
      const r = center(el);
      let primary, secondary;
      /* the candidate's centre has to be clearly on that side, not just a few pixels over on a big overlapping button */
      const cw = Math.min(c.r - c.l, r.r - r.l) * .2, ch = Math.min(c.b - c.t, r.b - r.t) * .2;
      if (dir === 'left' || dir === 'right'){
        if (dir === 'right' ? r.x <= c.x + cw : r.x >= c.x - cw) continue;
        primary = dir === 'right' ? Math.max(0, r.l - c.r) : Math.max(0, c.l - r.r);
        const ov = Math.min(c.b, r.b) - Math.max(c.t, r.t);
        secondary = ov > 0 ? 0 : -ov;
        primary += Math.abs(r.x - c.x) * .15;
      } else {
        if (dir === 'down' ? r.y <= c.y + ch : r.y >= c.y - ch) continue;
        primary = dir === 'down' ? Math.max(0, r.t - c.b) : Math.max(0, c.t - r.b);
        const ov = Math.min(c.r, r.r) - Math.max(c.l, r.l);
        secondary = ov > 0 ? 0 : -ov;
        primary += Math.abs(r.y - c.y) * .15;
      }
      const score = primary + secondary * 3;
      const along = Math.abs(dir === 'left' || dir === 'right' ? r.x - c.x : r.y - c.y);
      const inCone = secondary <= along * 1.1 + 24;        /* within about 45 degrees */
      const roughly = secondary <= along * 1.75 + 40;      /* within about 60 degrees */
      if (inCone && score < bestScore){ best = el; bestScore = score; }
      else if (roughly && score < looseScore){ loose = el; looseScore = score; }
    }
    return best || loose;
  }
  function nearest(list, pt){
    if (!list.length) return null;
    if (!pt) return list[0];
    let best = null, bd = Infinity;
    for (const el of list){ const r = center(el); const d = Math.hypot(r.x - pt.x, r.y - pt.y); if (d < bd){ bd = d; best = el; } }
    return best;
  }
  function defaultTarget(list){
    const c = content(list).filter(el => !el.classList.contains('pg-x'));
    const pool = c.length ? c : list;
    if (!pool.length) return null;
    /* the game already marks the obvious next thing */
    const hinted = pool.find(el => el.classList.contains('next') || el.classList.contains('glow') || el.classList.contains('fa-sel') || el.classList.contains('sel') || el.classList.contains('pick-go') || el.id === 'b-play');
    if (hinted) return hinted;
    /* start on something to pick up (an object, a number, a card, an arrow) rather than on a place to put it */
    const pickable = c.filter(el => el.classList.contains('live') || el.classList.contains('tile') || el.classList.contains('card') || el.classList.contains('te-arrow') || el.classList.contains('pcard'));
    if (pickable.length) return pickable[0];
    if (c.length && lastRect) return nearest(c, lastRect);
    return pool[0];
  }

  let focusedBy = 'auto';
  function setFocus(el, how){
    if (how) focusedBy = how;
    if (el === focused) { paint(); return; }
    focused = el; painted = '';
    if (!el){ ring.classList.remove('on'); return; }
    if (el.matches && el.matches('input, textarea, select')) { try { el.focus({ preventScroll:true }); } catch (e) {} }
    else if (document.activeElement && document.activeElement !== document.body && document.activeElement.matches('input, textarea, select')) { try { document.activeElement.blur(); } catch (e) {} }
    paint();
    if (ringOn){ ring.classList.add('on'); if (how === 'move') flash('jump'); burst(); }
  }

  /* keep the focus on something that exists and can be pressed */
  let refreshT = 0, lastSig = '';
  const sig = list => { const c = content(list); return c.length + ':' + (c[0] ? c[0].className + '|' + c[0].id : '') + ':' + (c[c.length - 1] ? c[c.length - 1].className : ''); };
  function refresh(reason){
    if (refreshT){ clearTimeout(refreshT); refreshT = 0; }
    const list = candidates();
    const s = sig(list), changed = s !== lastSig; lastSig = s;
    const stillOk = focused && list.includes(focused);
    if (stillOk){
      const onContent = !isHud(focused) && focused.id !== 'task';
      /* new things to play with appeared while the ring sat on a corner button, or on a provisional spot
         the player never chose (a board builds up over a second or two): go to the best starting place */
      if (changed && content(list).length && (!onContent || focusedBy === 'auto')) setFocus(defaultTarget(list), 'auto');
      else paint();
      return;
    }
    /* the focused thing is gone. With nothing to play with on screen the ring rests (OK then moves the story along);
       the corner buttons are reached with an arrow key from something on screen, and the remote's Back key always works */
    setFocus(content(list).length ? defaultTarget(list) : null, reason === 'key' ? 'move' : 'auto');
  }
  let lastRefresh = 0;
  function scheduleRefresh(){
    if (refreshT) return;
    const wait = Math.max(0, 120 - (performance.now() - lastRefresh));
    refreshT = setTimeout(() => requestAnimationFrame(() => { lastRefresh = performance.now(); refresh('dom'); burst(600); }), wait);
  }
  const noise = n => !n || n === ring || n === hint || (n.nodeType === 1 && (n.closest('svg, .actor, .sparkle, #fx, #tvring, #tvhint, .hhint') || n.classList.contains('sparkle'))) || (n.nodeType !== 1 && n.parentElement && n.parentElement.closest('svg, .actor'));
  const mo = new MutationObserver(recs => {
    if (!ringOn && !IS_TV) return;
    for (const r of recs){
      if (r.type === 'attributes'){ if (!noise(r.target)) return scheduleRefresh(); continue; }
      if (noise(r.target)) continue;
      for (const n of r.addedNodes) if (!noise(n)) return scheduleRefresh();
      for (const n of r.removedNodes) if (n.nodeType === 1 && !(n.classList && (n.classList.contains('sparkle') || n.classList.contains('hhint')))) return scheduleRefresh();
    }
  });
  mo.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['hidden', 'class', 'disabled', 'aria-disabled'] });
  setInterval(() => { if (ringOn) refresh('tick'); }, 600);
  window.addEventListener('resize', () => setTimeout(paint, 50));

  /* ---------- doing things ---------- */
  function unlock(){ try { if (typeof audio === 'function') audio(); } catch (e) {} }
  function move(dir){
    unlock(); showHint();
    if (!ringOn) ringShow(true);
    const list = candidates();
    if (!list.length){ setFocus(null); return; }
    if (!focused || !list.includes(focused)){
      /* while the story plays there is nothing to pick yet; don't park the ring on the corner Back button
         (the remote's own Back key still goes back) */
      if (!content(list).length){ ring.style.setProperty('--bx', '0'); ring.style.setProperty('--by', '0'); return; }
      setFocus(defaultTarget(list), 'move'); return;
    }
    const next = pickDir(focused, list, dir);
    if (next){ setFocus(next, 'move'); try { if (typeof tone === 'function') tone(880, .035, { type:'triangle', vol:.06 }); } catch (e) {} }
    else { ring.style.setProperty('--bx', dir === 'left' ? '-10px' : dir === 'right' ? '10px' : '0'); ring.style.setProperty('--by', dir === 'up' ? '-10px' : dir === 'down' ? '10px' : '0'); flash('bump'); }
  }
  function press(){
    unlock();
    const list = candidates();
    if (focused && list.includes(focused)){
      flash('press');
      const el = focused;
      if (el.matches('input[type="checkbox"]')){ el.click(); return; }
      if (el.matches('input, textarea')){ el.focus(); return; }
      el.click();
      return;
    }
    /* nothing to press: OK moves the story along, the same as a tap on the speech bar */
    if (!ringOn) ringShow(true);
    const dlg = document.getElementById('dlg');
    if (dlg && !dlg.hidden){ dlg.click(); return; }
    const task = document.getElementById('task');
    if (task && !task.hidden){ task.click(); return; }
    /* only ever land on something to play with: a child pressing OK during the story must never
       end up on the corner Back button and leave the activity on the next press */
    if (content(list).length) setFocus(defaultTarget(list), 'move');
  }
  function again(){ unlock(); try { if (typeof sayAgain === 'function' && typeof MODE !== 'undefined' && MODE === 'play') sayAgain(); else { const d = document.getElementById('dlg'); if (d && !d.hidden) d.click(); } } catch (e) {} }

  /* Back: close a panel, leave the activity, leave the world, then ask before leaving the game */
  function leaveCard(){
    let L = leaveEl();
    if (L) return L;
    L = document.createElement('div'); L.id = 'tvleave'; L.hidden = true;
    L.innerHTML = '<div class="tvl-card" role="dialog" aria-modal="true"><h2>Leave Festival Town?</h2><p>Your progress is saved.</p><div class="tvl-row"><button type="button" class="tvl-stay">Keep playing</button><button type="button" class="tvl-go">Leave</button></div></div>';
    L.querySelector('.tvl-stay').onclick = () => { L.hidden = true; scheduleRefresh(); };
    L.querySelector('.tvl-go').onclick = () => { L.hidden = true; doExit(); };
    document.body.appendChild(L);
    return L;
  }
  function doExit(){
    try { if (typeof FT_TV.exit === 'function') return FT_TV.exit(); } catch (e) {}
    try { if (window.FTAndroid && FTAndroid.exit) return FTAndroid.exit(); } catch (e) {}
    try { if (window.tizen && tizen.application) return tizen.application.getCurrentApplication().exit(); } catch (e) {}
    try { if (window.PalmSystem && PalmSystem.platformBack) return PalmSystem.platformBack(); } catch (e) {}
    try { if (window.webOS && webOS.platformBack) return webOS.platformBack(); } catch (e) {}
    try { window.close(); } catch (e) {}
  }
  function canExit(){ return PLATFORM !== 'web' || !!(window.FTAndroid || window.tizen || window.PalmSystem); }
  function back(){
    unlock();
    /* Back pressed again while the screen is already changing: that press is used up, nothing more to do */
    if (irisShut() && !(parentEl && !parentEl.hidden)) return true;
    const L = leaveEl();
    if (L && !L.hidden){ L.hidden = true; scheduleRefresh(); return true; }
    if (parentEl && !parentEl.hidden){ const x = parentEl.querySelector('.pg-x'); if (x) x.click(); else if (window.Parent) Parent.close(); return true; }
    const sid = typeof screenId !== 'undefined' ? screenId : app.dataset.screen;
    if (sid !== 'title'){ const b = document.getElementById('b-back'); if (b){ b.click(); return true; } }
    if (!canExit()) return false;
    const card = leaveCard(); card.hidden = false;
    setTimeout(() => { if (!ringOn) ringShow(true); setFocus(card.querySelector('.tvl-stay'), 'move'); }, 30);
    return true;
  }

  /* ---------- keyboard and remote ---------- */
  let lastMove = 0;
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    const typing = t && t.matches && t.matches('input[type="text"], input:not([type]), textarea') && document.activeElement === t;
    const a = action(e);
    if (typing){
      /* letters, arrows and backspace go to the text box; OK and Back leave it */
      if (a === 'back' || (a === 'ok' && e.key !== ' ')){ t.blur(); e.preventDefault(); }
      return;
    }
    if (!a) { if (IS_TV) e.preventDefault(); return; }
    if (a === 'left' || a === 'right' || a === 'up' || a === 'down'){
      e.preventDefault();
      const now = Date.now(); if (e.repeat && now - lastMove < 170) return; lastMove = now;
      move(a);
    } else if (a === 'ok'){
      e.preventDefault(); if (e.repeat) return; press();
    } else if (a === 'back'){
      if (e.repeat){ e.preventDefault(); return; }
      if (back()) e.preventDefault();
    } else if (a === 'again'){
      e.preventDefault(); if (e.repeat) return; again();
    }
  }, true);
  /* keyup of a swallowed key must not reach the page either */
  document.addEventListener('keyup', e => { if (action(e) && !(e.target && e.target.matches && e.target.matches('input, textarea'))) e.preventDefault(); }, true);

  /* a mouse or finger takes over: the ring steps aside until the next arrow key */
  document.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' && e.pointerType !== 'touch' && e.pointerType !== 'pen') return; if (ringOn && !IS_TV) ringShow(false); }, true);

  /* ---------- game controllers (Fire TV controller, Android TV gamepads, USB pads) ---------- */
  const PAD = { pressed:{}, loop:0, axisDir:null, axisAt:0 };
  function padTick(){
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let any = false;
    for (const gp of pads){
      if (!gp) continue; any = true;
      const now = Date.now();
      const map = { 12:'up', 13:'down', 14:'left', 15:'right', 0:'ok', 1:'back', 2:'again', 3:'again', 9:'back', 8:'again' };
      for (const i in map){
        const b = gp.buttons[i]; if (!b) continue;
        const down = b.pressed || b.value > .5, key = gp.index + ':' + i;
        if (down && !PAD.pressed[key]){ PAD.pressed[key] = now; fire(map[i]); }
        else if (down && PAD.pressed[key] && (map[i] === 'up' || map[i] === 'down' || map[i] === 'left' || map[i] === 'right') && now - PAD.pressed[key] > 420){ PAD.pressed[key] = now - 250; fire(map[i]); }
        else if (!down) delete PAD.pressed[key];
      }
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      const dir = Math.abs(ax) > .6 ? (ax > 0 ? 'right' : 'left') : Math.abs(ay) > .6 ? (ay > 0 ? 'down' : 'up') : null;
      if (dir && (dir !== PAD.axisDir || now - PAD.axisAt > 320)){ PAD.axisDir = dir; PAD.axisAt = now; fire(dir); }
      if (!dir) PAD.axisDir = null;
    }
    PAD.loop = any ? requestAnimationFrame(padTick) : 0;
  }
  function fire(a){ if (a === 'ok') press(); else if (a === 'back') back(); else if (a === 'again') again(); else move(a); }
  window.addEventListener('gamepadconnected', () => { if (!PAD.loop) PAD.loop = requestAnimationFrame(padTick); });
  try { if (navigator.getGamepads && [...navigator.getGamepads()].some(Boolean)) PAD.loop = requestAnimationFrame(padTick); } catch (e) {}

  /* ---------- platform extras ---------- */
  try { if (window.tizen && tizen.tvinputdevice){ ['MediaPlayPause', 'MediaPlay', 'ColorF0Red'].forEach(k => { try { tizen.tvinputdevice.registerKey(k); } catch (e) {} }); } } catch (e) {}
  /* on a TV the ring is on from the start, sitting on the Play button */
  if (IS_TV){ setTimeout(() => { ringShow(true); refresh('boot'); showHint(); }, 400); }
  /* pause the music when the app goes to the background on a TV (Home button) */
  window.addEventListener('blur', () => { try { if (IS_TV && typeof musicStop === 'function') musicStop(); } catch (e) {} });
  window.addEventListener('focus', () => { try { if (IS_TV && typeof Store !== 'undefined' && Store.s.settings.music && typeof AC !== 'undefined' && AC && typeof musicStart === 'function') musicStart(); } catch (e) {} });

  window.FT_TV = { platform:PLATFORM, isTV:IS_TV, back, press, move, again, exit:null, refresh:() => refresh('api'), get focused(){ return focused; }, candidates,
    focus(el){ if (!ringOn) ringShow(true); setFocus(el, 'move'); }, next(el, dir){ return pickDir(el, candidates(), dir); } };
})();

/* SubelJapan — Phát âm tiếng Nhật (Web Speech) + bộ âm thanh dễ thương TỰ TỔNG HỢP (Web Audio)
 * Không dùng file âm thanh có sẵn: chuông "pin-pon", đàn koto (Karplus-Strong), kalimba,
 * bong bóng, gỗ gõ, tiếng mèo "nya~", con dấu "pon". Thang âm ngũ cung Nhật (yo-sen).
 */
window.SJ = window.SJ || {};
(function (SJ) {
  // ================= GIỌNG ĐỌC =================
  const hasTTS = 'speechSynthesis' in window;
  let voice = null, voicesLoaded = false, warned = false;
  function pickVoice() {
    if (!hasTTS) return;
    const vs = speechSynthesis.getVoices();
    if (!vs.length) return;
    voicesLoaded = true;
    const ja = vs.filter(v => /^ja/i.test(v.lang) || /japan/i.test(v.name));
    voice = ja.find(v => /Google/i.test(v.name)) || ja.find(v => /Nanami|Kyoko|Haruka|Ayumi|Mizuki|Otoya|Keita/i.test(v.name)) || ja[0] || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function warn() {
    if (warned) return; warned = true;
    SJ.ui && SJ.ui.toast(SJ.icon('mute', 22) + ' Máy bạn chưa có giọng đọc tiếng Nhật. Hãy mở bằng Chrome/Edge hoặc cài thêm giọng Nhật trong cài đặt máy nhé!', 5200);
  }
  function speak(text, opts) {
    if (!text) return;
    if (!hasTTS) { warn(); return; }
    opts = opts || {};
    const clean = String(text).replace(/_+/g, '、').replace(/[〜~]/g, '');
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'ja-JP';
      if (voice) u.voice = voice; else if (voicesLoaded) warn();
      u.rate = opts.rate || (SJ.store ? SJ.store.get().settings.rate : 0.85);
      u.pitch = opts.pitch || 1.1;
      if (opts.onend) u.onend = opts.onend;
      setTimeout(() => speechSynthesis.speak(u), 30);
    } catch (e) { }
  }
  function stop() { if (hasTTS) try { speechSynthesis.cancel(); } catch (e) { } }

  // ================= BỘ TỔNG HỢP ÂM =================
  let ctx = null, master = null, verb = null;
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      // trình duyệt chỉ cho phát tiếng sau lần chạm / bấm đầu tiên: chưa chạm thì bỏ qua (khỏi tạo bộ âm vô ích)
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      master.connect(comp); comp.connect(ctx.destination);
      // tiếng vang nhẹ kiểu hộp nhạc
      verb = ctx.createGain(); verb.gain.value = 1;
      const d1 = ctx.createDelay(); d1.delayTime.value = 0.11;
      const fb = ctx.createGain(); fb.gain.value = 0.32;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
      verb.connect(d1); d1.connect(lp); lp.connect(fb); fb.connect(d1); lp.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    try { master.gain.value = 0.62 * (SJ.store ? (SJ.store.get().settings.volume ?? 0.8) : 0.8); } catch (e) { }
    return ctx;
  }
  const out = (node, wet) => { node.connect(master); if (wet) { const g = ctx.createGain(); g.gain.value = wet; node.connect(g); g.connect(verb); } };
  const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); };
  const N = n => 440 * Math.pow(2, (n - 69) / 12); // số nốt MIDI → Hz

  // Chuông FM (glockenspiel) — tiếng "pin-pon"
  function bell(f, t, vol, dec) {
    const c = ctx, car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(), g = c.createGain();
    car.frequency.value = f; mod.frequency.value = f * 3.5;
    mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(1, t + (dec || .6));
    mod.connect(mg); mg.connect(car.frequency); car.connect(g);
    env(g, t, 0.004, vol || 0.22, dec || 0.6);
    out(g, 0.5); car.start(t); mod.start(t); car.stop(t + (dec || .6) + .1); mod.stop(t + (dec || .6) + .1);
  }
  // Kalimba / hộp nhạc
  function kalimba(f, t, vol, dec) {
    const c = ctx; dec = dec || 0.5;
    [[1, 1], [4.1, 0.22], [7.3, 0.07]].forEach(([m, a], i) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f * m;
      env(g, t, 0.003, (vol || 0.2) * a, i ? dec * 0.25 : dec);
      o.connect(g); out(g, 0.45); o.start(t); o.stop(t + dec + .05);
    });
  }
  // Đàn koto (Karplus-Strong)
  const ksCache = {};
  function koto(f, t, vol, dur) {
    const c = ctx; dur = dur || 1.1;
    const key = Math.round(f) + ':' + dur;
    let buf = ksCache[key];
    if (!buf) {
      const sr = c.sampleRate, len = Math.floor(sr * dur), p = Math.max(2, Math.round(sr / f));
      buf = c.createBuffer(1, len, sr); const d = buf.getChannelData(0);
      const ring = new Float32Array(p); for (let i = 0; i < p; i++) ring[i] = Math.random() * 2 - 1;
      let idx = 0;
      for (let i = 0; i < len; i++) { const nx = (idx + 1) % p; const v = ring[idx]; ring[idx] = 0.5 * (v + ring[nx]) * 0.996; d[i] = v; idx = nx; }
      ksCache[key] = buf;
    }
    const s = c.createBufferSource(), g = c.createGain(), lp = c.createBiquadFilter();
    s.buffer = buf; lp.type = 'lowpass'; lp.frequency.value = 3800;
    g.gain.setValueAtTime(vol || 0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(lp); lp.connect(g); out(g, 0.4); s.start(t); s.stop(t + dur);
  }
  // nhiễu trắng ngắn
  let noiseBuf = null;
  function noise(t, dur, f1, f2, q, vol, type) {
    const c = ctx;
    if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
    s.buffer = noiseBuf; bp.type = type || 'bandpass'; bp.Q.value = q || 1.2;
    bp.frequency.setValueAtTime(f1, t); if (f2) bp.frequency.exponentialRampToValueAtTime(f2, t + dur);
    env(g, t, 0.004, vol || 0.2, dur);
    s.connect(bp); bp.connect(g); out(g, 0); s.start(t); s.stop(t + dur + .05);
  }
  function blip(f1, f2, t, dur, vol, type, wet) {
    const c = ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    env(g, t, 0.005, vol || 0.2, dur);
    o.connect(g); out(g, wet || 0); o.start(t); o.stop(t + dur + .05);
  }
  // "Puyon~" — tiếng nảy hoạt hình dễ thương (khi sai)
  function boing(t) {
    const c = ctx, o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(190, t + 0.42);
    lfo.frequency.setValueAtTime(16, t); lfo.frequency.linearRampToValueAtTime(7, t + 0.42); lg.gain.value = 32;
    lfo.connect(lg); lg.connect(o.frequency);
    lp.type = 'lowpass'; lp.frequency.value = 1400;
    env(g, t, 0.01, 0.26, 0.45);
    o.connect(lp); lp.connect(g); out(g, 0.15); o.start(t); lfo.start(t); o.stop(t + 0.5); lfo.stop(t + 0.5);
  }
  // "Nya~" — tiếng mèo Mochi
  function meow(t, pitch) {
    const c = ctx, p = pitch || 1, dur = 0.5;
    const o1 = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    const f1 = c.createBiquadFilter(), f2 = c.createBiquadFilter(), mix = c.createGain();
    o1.type = 'sawtooth'; o2.type = 'sawtooth'; o2.detune.value = 9;
    [o1, o2].forEach(o => { o.frequency.setValueAtTime(520 * p, t); o.frequency.linearRampToValueAtTime(820 * p, t + 0.14); o.frequency.linearRampToValueAtTime(610 * p, t + dur); o.connect(mix); });
    f1.type = 'bandpass'; f1.Q.value = 6; f1.frequency.setValueAtTime(700, t); f1.frequency.linearRampToValueAtTime(1150, t + 0.15); f1.frequency.linearRampToValueAtTime(800, t + dur);
    f2.type = 'bandpass'; f2.Q.value = 8; f2.frequency.setValueAtTime(1700, t); f2.frequency.linearRampToValueAtTime(2300, t + 0.2);
    mix.gain.value = 0.5; mix.connect(f1); mix.connect(f2); f1.connect(g); f2.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.05); g.gain.setValueAtTime(0.3, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out(g, 0.2); o1.start(t); o2.start(t); o1.stop(t + dur + .05); o2.stop(t + dur + .05);
  }

  // thang ngũ cung Nhật (yo-sen: D E G A B)
  const YO = [62, 64, 67, 69, 71, 74, 76, 79, 81, 83, 86, 88];
  const SFX = {
    ok: t => { bell(N(88), t, 0.2, 0.5); bell(N(84), t + 0.13, 0.2, 0.8); },                    // ピンポン
    bad: t => { boing(t); },
    click: t => { blip(1900, 1300, t, 0.035, 0.1, 'sine'); noise(t, 0.025, 3000, 0, 3, 0.05); },  // gõ gỗ
    tap: t => { kalimba(N(86), t, 0.12, 0.18); },
    pop: t => { blip(320, 1250, t, 0.07, 0.24, 'sine', 0.2); },                                 // bong bóng
    flip: t => { noise(t, 0.14, 900, 3800, 1.5, 0.12); },                                        // lật giấy
    combo: t => { [74, 76, 79, 81, 83, 86].forEach((n, i) => kalimba(N(n + 12), t + i * 0.055, 0.14, 0.35)); },
    win: t => { [62, 64, 67, 69, 71, 74].forEach((n, i) => koto(N(n + 12), t + i * 0.11, 0.3, 1.2)); bell(N(86), t + 0.72, 0.16, 1.2); bell(N(91), t + 0.72, 0.1, 1.2); },
    level: t => { [67, 71, 74, 79, 83, 86].forEach((n, i) => kalimba(N(n + 12), t + i * 0.08, 0.18, 0.6)); [74, 79, 83].forEach(n => bell(N(n + 12), t + 0.56, 0.12, 1.4)); },
    tick: t => { blip(2400, 1800, t, 0.02, 0.05); },
    meow: t => { meow(t, 1); },
    meow2: t => { meow(t, 1.25); meow(t + 0.32, 1.1); },
    stamp: t => { blip(170, 55, t, 0.18, 0.5, 'sine'); noise(t, 0.08, 600, 0, 0.8, 0.25, 'lowpass'); },  // con dấu "pon"
    star: t => { kalimba(N(93), t, 0.14, 0.4); kalimba(N(98), t + 0.07, 0.1, 0.5); },
    sparkle: t => { [0, 1, 2].forEach(i => bell(N(YO[9 + (i % 3)] + 12), t + i * 0.05, 0.06, 0.35)); },
    open: t => { koto(N(74), t, 0.22, 0.8); koto(N(81), t + 0.08, 0.18, 0.9); },
    note: (t, i) => { kalimba(N(YO[(i || 0) % YO.length] + 12), t, 0.16, 0.4); },
    coin: t => { bell(N(93), t, 0.12, 0.3); bell(N(98), t + 0.08, 0.12, 0.5); },                // leng keng cá vàng
    chest: t => { [62, 67, 69, 74, 79, 81, 86].forEach((n, i) => koto(N(n + 12), t + i * 0.06, 0.24, 1)); [0, 1, 2, 3].forEach(i => bell(N(YO[8 + (i % 4)] + 12), t + 0.5 + i * 0.07, 0.08, 0.6)); },
    buy: t => { blip(500, 1400, t, 0.09, 0.2, 'sine', 0.2); bell(N(91), t + 0.1, 0.14, 0.6); bell(N(95), t + 0.2, 0.12, 0.7); },
    quest: t => { [74, 79, 83].forEach((n, i) => bell(N(n + 12), t + i * 0.09, 0.13, 0.7)); },
  };
  function sfx(name, arg) {
    if (SJ.store && !SJ.store.get().settings.sound) return;
    try { if (!ac()) return; SFX[name] && SFX[name](ctx.currentTime + 0.005, arg); } catch (e) { }
  }
  // mở khoá âm thanh trên điện thoại ngay lần chạm đầu tiên
  const unlock = () => { try { ac(); } catch (e) { } document.removeEventListener('pointerdown', unlock); };
  document.addEventListener('pointerdown', unlock);
  // tiếng gõ nhẹ cho mọi nút bấm
  document.addEventListener('click', e => { const b = e.target.closest('button, .btn, a.card, .tab'); if (b && !b.dataset.say && !b.dataset.nosfx) sfx('click'); }, true);

  // "Không nghe được lúc này": tắt câu nghe một lúc (ngồi chỗ đông người, máy không có giọng Nhật…)
  const NL = 'sj_nolisten';
  const offUntil = () => { try { return +localStorage.getItem(NL) || 0; } catch (e) { return 0; } };
  const noVoice = () => !hasTTS || (voicesLoaded && !voice);
  const canListen = () => !noVoice() && offUntil() <= Date.now();
  const listenOff = min => { try { localStorage.setItem(NL, String(Date.now() + (min || 60) * 60000)); } catch (e) { } SJ.emit && SJ.emit('listen', false); };
  const listenOn = () => { try { localStorage.removeItem(NL); } catch (e) { } SJ.emit && SJ.emit('listen', true); };
  /** lý do đang tắt câu nghe (để hiện cho người học) */
  const listenWhy = () => noVoice() ? 'Máy bạn chưa có giọng đọc tiếng Nhật nên Mochi tạm ẩn các câu nghe.' : offUntil() > Date.now() ? `Bạn đã tắt câu nghe — tự bật lại lúc ${new Date(offUntil()).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.` : '';
  SJ.audio = { speak, stop, sfx, hasTTS, hasVoice: () => !!voice, canListen, listenOff, listenOn, listenWhy, noVoice };
})(window.SJ);

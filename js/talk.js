/* SubelJapan — Nói & Ngữ pháp: lộ trình mẫu câu + bài học luyện nói (tách riêng với phần viết chữ)
 * Mỗi bài đi từ dễ đến khó: xem mẫu câu → nghe & nói theo → hiểu nghĩa → chọn câu đúng
 * → điền chỗ trống → xếp câu → đáp lại trong hội thoại → tự nói từ nghĩa tiếng Việt.
 * Phần nói: chấm bằng nhận dạng giọng nói của trình duyệt (tiếng Nhật) nếu có; không có thì tự kiểm tra.
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui, I = (n, s, c) => SJ.icon(n, s, c), esc = s => SJ.ui.esc(s);
  const ico = (n, s) => I(SJ.hasIcon && SJ.hasIcon(n) ? n : 'speech', s);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const NS = 'sj_nospeak', RK = 'sj_talk_romaji';
  const speakOffUntil = () => { try { return +localStorage.getItem(NS) || 0; } catch (e) { return 0; } };
  const canSpeak = () => !!SR && speakOffUntil() <= Date.now();
  const speakOff = min => { try { localStorage.setItem(NS, String(Date.now() + (min || 60) * 60000)); } catch (e) { } };
  let showRomaji = true; try { showRomaji = localStorage.getItem(RK) !== '0'; } catch (e) { }

  // ---------- chấm phần nói ----------
  const norm = s => Array.from(String(s || '')).map(c => (SJ.toHira ? SJ.toHira(c) : c)).join('').replace(/[\s、。！？!?,.…「」（）()・〜~]/g, '');
  function lev(a, b) {
    a = Array.from(a); b = Array.from(b);
    const d = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } }
    return d[b.length];
  }
  const sim = (a, b) => { const n = Math.max(Array.from(a).length, Array.from(b).length, 1); return 1 - lev(a, b) / n; };
  const scoreSpeech = (heard, ex) => Math.max(sim(norm(heard), norm(ex.jp)), ex.k ? sim(norm(heard), norm(ex.k)) : 0);

  // ---------- tiện ích hiển thị ----------
  const optOf = (l, x) => typeof x === 'number' ? { jp: l.ex[x].jp, r: l.ex[x].rom, v: l.ex[x].v } : { jp: x[0], r: x[1] || '', v: x[2] || '' };
  const clean = t => String(t).replace(/[。、？！…]/g, '').trim();
  const jpLine = (jp, r) => `<div class="tj jp">${esc(jp)}</div>${r ? `<div class="tr">${esc(r)}</div>` : ''}`;
  const sayBtn = (text, big) => `<button class="say-btn ${big ? 'big' : ''}" data-say="${esc(text)}" title="Nghe" aria-label="Nghe">${I('speaker', big ? 30 : 22)}</button>`;
  function patternHTML(p) {
    if (!p) return '';
    const parts = p.parts.map(([lab, kind, rom]) => /^[pqet]$/.test(kind)
      ? `<span class="tp tp-${kind}"><b class="jp">${esc(lab)}</b>${rom ? `<small>${esc(rom)}</small>` : ''}</span>`
      : `<span class="tp tp-slot">${esc(lab)}</span>`).join('<i class="tp-plus">+</i>');
    return `<div class="tpat"><div class="tpat-row">${parts}</div><div class="tpat-mean">${esc(p.mean)}</div></div>`;
  }
  const exRow = e => `<div class="tex" data-say="${esc(e.say)}">${sayBtn(e.say)}<div class="tex-txt"><div class="tex-jp jp">${esc(e.jp)}</div><div class="tex-r tr">${esc(e.rom)}</div><div class="tex-v">${esc(e.v)}</div></div></div>`;

  // ---------- tiến độ / mở khoá ----------
  const state = id => (SJ.store.talkState ? SJ.store.talkState(id) : null);
  const done = id => !!(state(id) && state(id).done);
  /** bài đầu tiên chưa xong — các bài sau nó bị khoá để học lần lượt từng cái */
  const curId = () => { const l = SJ.TALK_LESSONS.find(x => !done(x.id)); return l ? l.id : null; };
  const unlocked = id => { const c = curId(); if (!c) return true; return SJ.TALK_LESSONS.findIndex(x => x.id === id) <= SJ.TALK_LESSONS.findIndex(x => x.id === c); };

  // ===================== TRANG LỘ TRÌNH =====================
  function page(root, arg) {
    if (arg) return lesson(root, arg);
    const cur = curId();
    let n = 0;
    const total = SJ.TALK_LESSONS.length, doneN = SJ.TALK_LESSONS.filter(l => done(l.id)).length;
    root.innerHTML = `<div class="page-mid talk-page">
      <div class="page-head"><div class="ph-icon">${ico('talk', 52)}</div><div><h1>Nói & Ngữ pháp</h1>
        <p>Học từng <b>mẫu câu</b> người Nhật nói hằng ngày — từ chào hỏi tới rủ rê, nhờ vả. Không cần biết viết chữ: câu nào cũng có <b>romaji</b> và nghĩa tiếng Việt. Đã xong <b>${doneN}/${total}</b> bài.</p></div></div>
      <div class="talk-how card">${[['eye', 'Xem mẫu câu', 'Công thức câu + ví dụ người Nhật nói thật'], ['mic', 'Nghe & nói theo', SR ? 'Mochi nghe và chấm cách bạn nói' : 'Nghe rồi nói to theo'], ['stairs', 'Luyện dễ → khó', 'Hiểu nghĩa, điền, xếp câu, hội thoại']].map((s, i) => `<div class="th-step"><i class="th-num">${i + 1}</i>${ico(s[0] === 'mic' ? 'speech' : s[0] === 'stairs' ? 'star' : 'eye', 36)}<div><b>${s[1]}</b><small>${s[2]}</small></div></div>`).join('')}</div>
      ${SJ.TALK.map((u, ui) => {
        const ud = u.lessons.filter(l => done(l.id)).length;
        return `<section class="tunit" style="--uc:${u.color}">
          <div class="tunit-head"><span class="tu-icon">${ico(u.icon, 40)}</span><div class="grow"><div class="tu-kicker">Chặng ${ui + 1}</div><h2>${esc(u.title)} <span class="jp">${esc(u.jp)}</span></h2><p>${esc(u.desc)}</p></div><span class="tu-prog">${ud}/${u.lessons.length}</span></div>
          <div class="tlist">${u.lessons.map(l => {
            n++;
            const st = state(l.id), isCur = l.id === cur, lock = !unlocked(l.id);
            const end = st && st.done ? `<span class="tc-stars">${[1, 2, 3].map(k => `<i class="${k <= st.stars ? 'on' : ''}">${I('star', 18)}</i>`).join('')}</span>`
              : lock ? `<span class="tc-lock">${I('lock', 22)}</span>` : `<span class="btn btn-sm tc-go">Học ${I('arrow_r', 16)}</span>`;
            return `<a class="tcard ${st && st.done ? 'done' : ''} ${isCur ? 'cur' : ''} ${lock ? 'lock' : ''}" href="#/talk/${l.id}" data-l="${l.id}"><span class="tc-num">${n}</span><span class="tc-ico">${ico(l.icon, 34)}</span>
              <div class="tc-main"><b>${esc(l.title)}</b> <span class="tc-jp jp">${esc(l.jp)}</span><small>${esc(l.goal)}</small></div>${end}</a>`;
          }).join('')}</div></section>`;
      }).join('')}
      <div class="talk-more card">${U().mascot('happy', 70)}<div class="grow"><b>Muốn nói chuyện thật?</b><p class="muted small bold">Học xong vài bài, vào Sensei Mochi chọn <b>Luyện hội thoại</b> để nói chuyện nhập vai với Mochi.</p></div><a class="btn btn-white" href="#/sensei/role">${ico('sensei', 22)} Luyện với Mochi</a></div>
    </div>`;
    root.querySelectorAll('.tcard.lock').forEach(a => a.onclick = e => { e.preventDefault(); const c = SJ.TALK_MAP[cur]; U().toast(`${I('lock', 24)} Học lần lượt nha — xong bài "${esc(c ? c.title : '')}" trước đã`); SJ.audio.sfx('bad'); });
    return {};
  }

  // ===================== BÀI HỌC =====================
  function lesson(root, id) {
    const L = SJ.TALK_MAP[id];
    if (!L) { root.innerHTML = `<div class="page-narrow center"><h2>Không tìm thấy bài này</h2><a class="btn" href="#/talk">Về lộ trình Nói</a></div>`; return {}; }
    const unit = SJ.TALK.find(u => u.id === L.unit);
    let steps = [], si = 0, graded = 0, firstOk = 0, answered = false, rec = null, destroyed = false, tmo = null, streak = 0;
    root.innerHTML = `<div class="lesson talk-lesson ${showRomaji ? '' : 'no-romaji'}" style="--uc:${unit.color}">
      <div class="lesson-top"><button class="lesson-x" aria-label="Thoát">${I('batsu', 24)}</button><div class="bar lesson-prog"><i style="width:0"></i></div>
        <button class="tr-tog ${showRomaji ? 'on' : ''}" data-rtog title="Hiện / ẩn romaji">Romaji</button></div>
      <div class="lesson-body"></div>
      <div class="lesson-foot"></div></div>`;
    const wrap = root.querySelector('.talk-lesson'), body = root.querySelector('.lesson-body'), foot = root.querySelector('.lesson-foot'), fill = root.querySelector('.lesson-prog > i');
    const setFoot = (html, cls) => { foot.className = 'lesson-foot ' + (cls || ''); foot.innerHTML = html ? `<div class="foot-in">${html}</div>` : ''; };
    const setProg = () => { fill.style.width = (si / Math.max(steps.length, 1) * 100) + '%'; };
    const stopRec = () => { if (rec) { try { rec.abort(); } catch (e) { } rec = null; } };
    const say = (t, o) => SJ.audio.speak(t, o);
    root.querySelector('.lesson-x').onclick = async () => {
      if (si === 0 || si >= steps.length || await U().confirm('Thoát bài bây giờ hả? Tiến độ bài này sẽ chưa được lưu đâu nha.', 'Thoát', 'Học tiếp')) location.hash = '#/talk';
    };
    root.querySelector('[data-rtog]').onclick = e => { showRomaji = !showRomaji; try { localStorage.setItem(RK, showRomaji ? '1' : '0'); } catch (er) { } wrap.classList.toggle('no-romaji', !showRomaji); e.currentTarget.classList.toggle('on', showRomaji); };
    // nghe: bấm vào bất cứ nút / dòng có data-say
    body.addEventListener('click', e => { const s = e.target.closest('[data-say]'); if (s && !e.target.closest('.opt, .ttile')) say(s.dataset.say); const sl = e.target.closest('[data-slow]'); if (sl) say(sl.dataset.slow, { rate: 0.55 }); });

    // ----- dựng các bước, dễ → khó -----
    function build() {
      const ex = L.ex, many = (arr, k) => U().shuffle(arr).slice(0, k);
      const multi = ex.filter(e => e.toks.length >= 3);
      steps = [{ t: 'learn' }];
      ex.slice(0, L.kind === 'phrase' ? 4 : 3).forEach(e => steps.push({ t: 'say', ex: e }));           // 1. nghe & nói theo
      many(ex, 2).forEach(e => steps.push({ t: 'mean', ex: e, g: 1 }));                                  // 2. hiểu nghĩa
      many(ex, 2).forEach(e => steps.push({ t: 'pick', ex: e, g: 1 }));                                  // 3. chọn câu đúng
      (L.fill || []).forEach(f => steps.push({ t: 'fill', f, g: 1 }));                                   // 4. điền chỗ trống
      many(multi, 2).forEach(e => steps.push({ t: 'build', ex: e, g: 1 }));                              // 5. xếp câu
      (L.talk || []).forEach(d => steps.push({ t: 'talk', d, g: 1 }));                                   // 6. hội thoại
      many(L.kind === 'phrase' ? ex : multi.length ? multi : ex, 1).forEach(e => steps.push({ t: 'recall', ex: e, g: 1 })); // 7. tự nói
    }
    function next() { stopRec(); clearTimeout(tmo); si++; render(); }
    function render() {
      if (destroyed) return;
      stopRec(); answered = false; setProg(); setFoot('');
      if (si >= steps.length) return result();
      const s = steps[si];
      ({ learn: rLearn, say: rSay, mean: rMean, pick: rPick, fill: rFill, build: rBuild, talk: rTalk, recall: rRecall })[s.t](s);
      window.scrollTo(0, 0);
    }
    /** chấm một bước; sai thì làm lại ở cuối bài (một lần) */
    function grade(ok, hint, opt) {
      answered = true;
      const s = steps[si];
      if (s.g && !s.retry) { graded++; if (ok) firstOk++; }
      if (!ok && s.g && !s.retry) steps.push(Object.assign({}, s, { retry: true }));
      streak = ok ? streak + 1 : 0;
      SJ.emit('answer', { ok, streak });
      if (!(opt && opt.silent)) SJ.audio.sfx(ok ? 'ok' : 'bad');
      setFoot(`<div class="fb slide-up"><span class="fb-badge">${I(ok ? 'check' : 'batsu', 36)}</span><div><div class="fb-title">${ok ? (opt && opt.title) || U().pick(SJ.CHEERS) : U().pick(SJ.COMFORTS)}</div>${hint ? `<div class="fb-hint">${hint}</div>` : ''}</div></div><button class="btn btn-lg ${ok ? 'btn-green' : 'btn-red'}" data-cont>Tiếp tục</button>`, ok ? 'ok' : 'bad');
      foot.querySelector('[data-cont]').onclick = next;
      setTimeout(() => { const b = foot.querySelector('[data-cont]'); b && b.focus({ preventScroll: true }); }, 50);
      if (opt && opt.say) setTimeout(() => say(opt.say), 300);
    }
    const tag = s => s.retry ? `<div class="retry-tag">${I('refresh', 16)} Làm lại câu này nha</div>` : '';
    function choice(s, ask, prompt, opts, answer, hint, sayAfter) {
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">${ask}</div><div class="quiz-prompt">${prompt}</div>
        <div class="quiz-opts tq-opts">${opts.map((o, i) => `<button class="opt" data-nosfx="1" data-v="${i}"><kbd>${i + 1}</kbd><span class="opt-in">${o.html}</span></button>`).join('')}</div></div>`;
      body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (answered) return;
        const ok = +b.dataset.v === answer;
        body.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.v === answer) x.classList.add('ok'); });
        if (!ok) b.classList.add('bad', 'shake');
        grade(ok, hint, { say: sayAfter });
      });
    }
    const optJP = o => `<span class="jp tq-j">${esc(o.jp)}</span>${o.r ? `<small class="tq-r tr">${esc(o.r)}</small>` : ''}`;
    const others = (e, k) => U().shuffle(L.ex.filter(x => x !== e && x.v !== e.v)).slice(0, k);

    // 0. xem mẫu câu
    function rLearn() {
      body.innerHTML = `<div class="tl-learn pop-in">
        <div class="unit-pill">${ico(unit.icon, 22)} ${esc(unit.title)}</div>
        <h1>${esc(L.title)} <span class="jp">${esc(L.jp)}</span></h1><p class="tl-goal">${esc(L.goal)}</p>
        ${patternHTML(L.pattern)}
        <ul class="tpoints">${L.points.map(p => `<li>${p}</li>`).join('')}</ul>
        <div class="tl-sub">${I('speaker', 22)} Câu mẫu — bấm để nghe</div>
        <div class="tex-list">${L.ex.map(exRow).join('')}</div>
        <div class="ttip">${I('bulb', 30)}<div><b>Người Nhật thường…</b><p>${L.tip}</p></div></div></div>`;
      setFoot(`<span class="grow muted small bold">${steps.length - 1} bước luyện · từ dễ đến khó</span><button class="btn btn-lg btn-cat" data-go>${U().ears ? U().ears() : ''}Bắt đầu luyện ${I('arrow_r', 22)}</button>`);
      foot.querySelector('[data-go]').onclick = next;
    }
    // 1. nghe & nói theo
    function rSay(s) {
      const e = s.ex, mic = canSpeak();
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">Nghe rồi nói theo Mochi</div>
        <div class="tsay card"><div class="tsay-play"><button class="listen-btn" data-say="${esc(e.say)}" aria-label="Nghe">${I('speaker', 56)}</button><button class="listen-btn listen-slow" data-slow="${esc(e.say)}" aria-label="Nghe chậm">${I('slow', 34)}</button></div>
          ${jpLine(e.jp, e.rom)}<div class="tv">${esc(e.v)}</div></div>
        ${mic ? `<div class="tmic-wrap"><button class="tmic" data-mic aria-label="Bấm rồi nói">${I('speech', 34)}<span>Bấm rồi nói</span></button><div class="theard" data-heard>Nghe vài lần, rồi bấm nút và nói to câu trên nhé.</div></div>`
          : `<p class="tself muted bold">${SR ? 'Đang tắt phần nói. ' : ''}Nghe 2–3 lần rồi nói to theo, nhái cả giọng lên xuống nha.</p>`}</div>`;
      setTimeout(() => say(e.say), 300);
      if (mic) {
        setFoot(`<button class="btn btn-white" data-nospeak>${I('mute', 20)} Không nói được lúc này</button><span class="grow"></span><button class="btn btn-white" data-skip>Bỏ qua ${I('arrow_r', 18)}</button>`);
        foot.querySelector('[data-nospeak]').onclick = noSpeak;
        foot.querySelector('[data-skip]').onclick = next;
        let tries = 0;
        body.querySelector('[data-mic]').onclick = () => listen(body.querySelector('[data-mic]'), body.querySelector('[data-heard]'), e, sc => {
          tries++;
          const h = body.querySelector('[data-heard]');
          if (sc >= 0.75) { h.className = 'theard ok'; h.insertAdjacentHTML('beforeend', `<b>${I('check', 18)} Chuẩn lắm!</b>`); SJ.audio.sfx('ok'); setFoot(`<span class="grow"></span><button class="btn btn-lg btn-green" data-cont>Tiếp tục</button>`, 'ok'); foot.querySelector('[data-cont]').onclick = next; tmo = setTimeout(next, 1600); }
          else if (sc >= 0.5) { h.className = 'theard mid'; h.insertAdjacentHTML('beforeend', `<b>Gần đúng rồi — nghe lại rồi nói chậm, rõ hơn chút nha</b>`); SJ.audio.sfx('note', 2); setFoot(`<button class="btn btn-white" data-again>${I('refresh', 18)} Nói lại</button><span class="grow"></span><button class="btn btn-lg btn-green" data-cont>Tiếp tục</button>`, 'ok'); foot.querySelector('[data-cont]').onclick = next; foot.querySelector('[data-again]').onclick = () => body.querySelector('[data-mic]').click(); }
          else { h.className = 'theard bad'; h.insertAdjacentHTML('beforeend', `<b>Mochi chưa nghe rõ — bấm nghe mẫu rồi thử lại nha</b>`); SJ.audio.sfx('bad'); if (tries >= 2) { setFoot(`<button class="btn btn-white" data-nospeak>${I('mute', 20)} Không nói được lúc này</button><span class="grow"></span><button class="btn btn-lg" data-cont>Tiếp tục</button>`); foot.querySelector('[data-cont]').onclick = next; foot.querySelector('[data-nospeak]').onclick = noSpeak; } }
        });
      } else {
        setFoot(`<span class="grow"></span><button class="btn btn-lg btn-green" data-cont>${I('check', 20)} Mình đã nói theo</button>`);
        foot.querySelector('[data-cont]').onclick = next;
      }
    }
    /** tắt phần nói 1 tiếng: bỏ các bước nói còn lại */
    function noSpeak() {
      speakOff(60); stopRec();
      U().toast(`${I('mute', 24)} Đã tắt phần nói trong 1 tiếng — lúc tiện thì luyện nói lại nha`, 3000);
      steps = steps.slice(0, si).concat(steps.slice(si).filter(x => x.t !== 'say' && x.t !== 'recall'));
      render();
    }
    /** bật micro, nhận câu tiếng Nhật, trả về điểm giống câu mẫu */
    function listen(btn, out, ex, done) {
      if (rec) { try { rec.stop(); } catch (e) { } return; }
      SJ.audio.stop();
      const r = new SR(); rec = r;
      r.lang = 'ja-JP'; r.interimResults = true; r.maxAlternatives = 3;
      let best = 0, heard = '', fin = false;
      btn.classList.add('rec'); btn.querySelector('span').textContent = 'Đang nghe…';
      out.className = 'theard'; out.innerHTML = '<span class="muted">Mochi đang nghe…</span>';
      r.onresult = ev => {
        let t = '';
        for (let i = 0; i < ev.results.length; i++) {
          const res = ev.results[i];
          t += res[0].transcript;
          if (res.isFinal) for (let a = 0; a < res.length; a++) best = Math.max(best, scoreSpeech(res[a].transcript, ex));
        }
        heard = t; best = Math.max(best, scoreSpeech(t, ex));
        out.innerHTML = `<span class="th-lab">Mochi nghe được:</span> <span class="jp th-txt">${esc(t)}</span>`;
      };
      r.onerror = ev => {
        if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { U().toast(`${I('mute', 26)} Bạn chưa cho phép dùng micro — bấm biểu tượng ổ khoá trên thanh địa chỉ để bật nha`, 4200); }
        else if (ev.error === 'no-speech') out.innerHTML = '<span class="muted">Chưa nghe thấy gì — bấm nút rồi nói to hơn chút nha.</span>';
        else if (ev.error === 'network') out.innerHTML = '<span class="muted">Nhận giọng nói cần có mạng. Kiểm tra mạng rồi thử lại nha.</span>';
      };
      r.onend = () => {
        if (rec === r) rec = null;
        btn.classList.remove('rec'); const sp = btn.querySelector('span'); if (sp) sp.textContent = 'Bấm rồi nói';
        if (!fin && heard) { fin = true; done(best, heard); }
      };
      try { r.start(); SJ.audio.sfx('tap'); } catch (e) { rec = null; btn.classList.remove('rec'); }
    }
    // 2. hiểu nghĩa: câu Nhật → nghĩa
    function rMean(s) {
      const e = s.ex, opts = U().shuffle([e].concat(others(e, 2)));
      choice(s, 'Câu này nghĩa là gì?', `<div class="tq-prompt">${sayBtn(e.say, true)}<div>${jpLine(e.jp, e.rom)}</div></div>`,
        opts.map(o => ({ html: esc(o.v) })), opts.indexOf(e), `<span class="jp">${esc(e.jp)}</span> = ${esc(e.v)}`);
      setTimeout(() => say(e.say), 250);
    }
    // 3. chọn câu đúng: nghĩa → câu Nhật
    function rPick(s) {
      const e = s.ex, opts = U().shuffle([e].concat(others(e, 2)));
      choice(s, 'Nói câu này bằng tiếng Nhật thế nào?', `<div class="tq-vi">${esc(e.v)}</div>`,
        opts.map(o => ({ html: optJP({ jp: o.jp, r: o.rom }) })), opts.indexOf(e), `${esc(e.v)} = <span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})`, e.say);
    }
    // 4. điền chỗ trống
    function rFill(s) {
      const f = s.f, e = L.ex[f.ex], right = clean(e.toks[f.tok]);
      const shown = e.toks.map((t, i) => i === f.tok ? `<span class="tblank">？</span>${/\s$/.test(t) ? ' ' : ''}${/[。？！…]$/.test(t) ? t.slice(-1) : ''}` : esc(t)).join('');
      const opts = U().shuffle([right].concat(f.wrong.map(clean)));
      choice(s, 'Chọn chữ còn thiếu', `<div class="tq-fill jp">${shown}</div><div class="tq-vi sm">${esc(e.v)}</div>`,
        opts.map(o => ({ html: `<span class="jp tq-j">${esc(o)}</span>` })), opts.indexOf(right), `${f.why}<br><span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})`, e.say);
      if (opts.every(o => Array.from(o).length <= 5)) body.querySelector('.tq-opts').classList.add('short');
    }
    // 5. xếp câu từ các cụm chữ
    function rBuild(s) {
      const e = s.ex;
      const tiles = e.toks.map((t, i) => ({ t: clean(t), r: (e.rtoks[i] || '').replace(/,$/, '').trim(), i }));
      const order = U().shuffle(tiles.slice());
      if (order.every((x, k) => x.i === k) && order.length > 1) order.push(order.shift());
      const placed = [];
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">Xếp thành câu tiếng Nhật</div><div class="quiz-prompt"><div class="tq-vi">${esc(e.v)}</div></div>
        <div class="tb-slots" data-slots></div><div class="tb-tiles" data-tiles>${order.map((x, k) => `<button class="ttile" data-k="${k}"><span class="jp">${esc(x.t)}</span>${x.r ? `<small class="tr">${esc(x.r)}</small>` : ''}</button>`).join('')}</div></div>`;
      const slots = body.querySelector('[data-slots]');
      const draw = () => {
        slots.innerHTML = placed.length ? placed.map((k, j) => `<button class="ttile in" data-j="${j}"><span class="jp">${esc(order[k].t)}</span>${order[k].r ? `<small class="tr">${esc(order[k].r)}</small>` : ''}</button>`).join('') : '<span class="tb-hint">Bấm các cụm chữ bên dưới theo đúng thứ tự</span>';
        body.querySelectorAll('[data-tiles] .ttile').forEach(b => b.classList.toggle('used', placed.includes(+b.dataset.k)));
        setFoot(placed.length === order.length ? `<button class="btn btn-white" data-reset>${I('refresh', 18)} Xếp lại</button><span class="grow"></span><button class="btn btn-lg" data-check>Kiểm tra</button>` : placed.length ? `<button class="btn btn-white" data-reset>${I('refresh', 18)} Xếp lại</button>` : '');
        const c = foot.querySelector('[data-check]'); if (c) c.onclick = check;
        const rs = foot.querySelector('[data-reset]'); if (rs) rs.onclick = () => { placed.length = 0; draw(); };
      };
      const check = () => {
        if (answered) return;
        const ok = placed.map(k => order[k].t).join('') === tiles.map(x => x.t).join('');
        slots.classList.add(ok ? 'ok' : 'bad');
        grade(ok, `<span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})`, { say: e.say });
      };
      body.querySelector('[data-tiles]').onclick = ev => { const b = ev.target.closest('.ttile'); if (!b || answered || placed.includes(+b.dataset.k)) return; placed.push(+b.dataset.k); SJ.audio.sfx('tap'); draw(); };
      slots.onclick = ev => { const b = ev.target.closest('.ttile'); if (!b || answered) return; placed.splice(+b.dataset.j, 1); draw(); };
      draw();
    }
    // 6. hội thoại: chọn câu đáp tự nhiên
    function rTalk(s) {
      const d = s.d, right = optOf(L, d.a), opts = U().shuffle([right].concat(d.wrong.map(w => optOf(L, w))));
      const prompt = d.q
        ? `<div class="tdlg"><div class="tdlg-ava">${U().mascot('happy', 64)}</div><div class="tdlg-bub" data-say="${esc(d.q)}">${I('speaker', 20)}<div>${jpLine(d.q, d.qr)}<div class="tv">${esc(d.qv)}</div></div></div></div>`
        : `<div class="tsit">${I('bulb', 30)}<b>${esc(d.sit)}</b></div>`;
      choice(s, d.q ? 'Bạn đáp lại thế nào cho tự nhiên?' : 'Tình huống', prompt, opts.map(o => ({ html: optJP(o) })), opts.indexOf(right),
        `${right.v ? esc(right.v) + ' — ' : ''}<span class="jp">${esc(right.jp)}</span>${right.r ? ` (${esc(right.r)})` : ''}`, /[ぁ-んァ-ヶ]/.test(right.jp) && !/（/.test(right.jp) ? right.jp : '');
      if (d.q) setTimeout(() => say(d.q), 300);
    }
    // 7. tự nói câu tiếng Nhật từ nghĩa tiếng Việt (khó nhất)
    function rRecall(s) {
      const e = s.ex, mic = canSpeak();
      body.innerHTML = `<div class="quiz slide-in-r">${tag(s)}<div class="quiz-ask">Tự nói bằng tiếng Nhật</div>
        <div class="quiz-prompt"><div class="tq-vi">${esc(e.v)}</div><button class="link-btn tr-peek" data-peek>${I('eye', 18)} Gợi ý romaji</button><div class="tr-peeked" data-peeked hidden>${esc(e.rom)}</div></div>
        ${mic ? `<div class="tmic-wrap"><button class="tmic" data-mic>${I('speech', 34)}<span>Bấm rồi nói</span></button><div class="theard" data-heard>Nghĩ một chút rồi bấm nút và nói nhé.</div></div>` : `<p class="tself muted bold">Nói to câu tiếng Nhật, rồi bấm <b>Xem đáp án</b> để tự kiểm tra.</p>`}</div>`;
      body.querySelector('[data-peek]').onclick = ev => { ev.currentTarget.hidden = true; body.querySelector('[data-peeked]').hidden = false; };
      const reveal = ok => grade(ok, `<span class="jp">${esc(e.jp)}</span> (${esc(e.rom)})`, { say: e.say, title: ok ? 'Nói giỏi quá!' : null });
      if (mic) {
        setFoot(`<button class="btn btn-white" data-nospeak>${I('mute', 20)} Không nói được lúc này</button><span class="grow"></span><button class="btn btn-white" data-show>Xem đáp án</button>`);
        foot.querySelector('[data-nospeak]').onclick = noSpeak;
        foot.querySelector('[data-show]').onclick = () => !answered && reveal(false);
        let tries = 0;
        body.querySelector('[data-mic]').onclick = () => listen(body.querySelector('[data-mic]'), body.querySelector('[data-heard]'), e, sc => {
          tries++;
          if (sc >= 0.6 || tries >= 2) reveal(sc >= 0.6);
          else { const h = body.querySelector('[data-heard]'); h.className = 'theard mid'; h.insertAdjacentHTML('beforeend', '<b>Chưa giống lắm — thử nói lại một lần nữa nha</b>'); SJ.audio.sfx('note', 2); }
        });
      } else {
        setFoot(`<span class="grow"></span><button class="btn btn-lg" data-show>Xem đáp án</button>`);
        foot.querySelector('[data-show]').onclick = () => {
          say(e.say);
          body.querySelector('.quiz-prompt').insertAdjacentHTML('beforeend', `<div class="tans">${jpLine(e.jp, e.rom)}</div>`);
          setFoot(`<span class="grow muted bold">Bạn nói đúng không?</span><button class="btn btn-red" data-no>Chưa đúng</button><button class="btn btn-green" data-yes>Mình nói đúng</button>`);
          foot.querySelector('[data-yes]').onclick = () => reveal(true);
          foot.querySelector('[data-no]').onclick = () => reveal(false);
        };
      }
    }
    // ----- kết quả -----
    function result() {
      fill.style.width = '100%';
      const pct = graded ? Math.round(firstOk / graded * 100) : 100;
      const r = SJ.store.completeTalk(L.id, pct);
      const i = SJ.TALK_LESSONS.indexOf(L), nx = SJ.TALK_LESSONS[i + 1];
      SJ.audio.sfx('win'); if (r.stars >= 2) U().confetti(80);
      body.innerHTML = `<div class="result pop-in"><div class="result-mochi">${U().mascot(r.stars >= 3 ? 'love' : 'cheer', 140, 'jump')}${U().hanko ? U().hanko(r.stars >= 3 ? '満点' : '合格', 'stamp-in') : ''}</div>
        <h1>Xong bài "${esc(L.title)}"!</h1>
        <div class="result-stars">${U().stars(r.stars, 3, 52)}</div>
        <div class="result-stats"><div class="rs card mint">${I('check', 30)}<b>${pct}%</b><span>đúng ngay lần đầu</span></div><div class="rs card sun">${I('star', 30)}<b>+${r.xp}</b><span>XP</span></div><div class="rs card sky">${I('fishcoin', 30)}<b>+${r.fish}</b><span>cá vàng</span></div></div>
        <div class="tl-recap card"><div class="tl-sub">${I('speech', 22)} Câu bạn vừa học</div>${L.ex.slice(0, 3).map(exRow).join('')}</div></div>`;
      setFoot(`<a class="btn btn-white" href="#/talk">${I('arrow_l', 20)} Lộ trình Nói</a><span class="grow"></span>${nx ? `<a class="btn btn-lg btn-cat" href="#/talk/${nx.id}">${U().ears ? U().ears() : ''}Bài tiếp: ${esc(nx.title)} ${I('arrow_r', 20)}</a>` : `<a class="btn btn-lg" href="#/sensei/role">${ico('sensei', 22)} Nói chuyện với Mochi</a>`}`);
    }
    const onKey = e => {
      if (document.querySelector('.modal-back')) return;
      if (/^[1-4]$/.test(e.key) && !answered) { const b = body.querySelectorAll('.opt')[+e.key - 1]; if (b) b.click(); }
      if (e.key === 'Enter' && answered) { const c = foot.querySelector('[data-cont]'); if (c && document.activeElement !== c) { e.preventDefault(); c.click(); } }
    };
    document.addEventListener('keydown', onKey);
    build(); render();
    return { destroy() { destroyed = true; stopRec(); clearTimeout(tmo); SJ.audio.stop(); document.removeEventListener('keydown', onKey); } };
  }

  // thẻ nhỏ cho trang chủ: bài Nói tiếp theo
  function teaser() {
    const c = curId(), l = c ? SJ.TALK_MAP[c] : null, d = SJ.TALK_LESSONS.filter(x => done(x.id)).length;
    return `<a class="card talk-teaser hov" href="#/talk${l ? '/' + l.id : ''}"><span class="tt-ico">${ico('talk', 44)}</span><div class="grow"><div class="tt-kicker">Nói & Ngữ pháp · ${d}/${SJ.TALK_LESSONS.length} bài</div><b>${l ? esc(l.title) + ' <span class="jp">' + esc(l.jp) + '</span>' : 'Đã học hết mẫu câu!'}</b><small>${l ? esc(l.goal) : 'Ôn lại hoặc nói chuyện với Sensei Mochi nha'}</small></div><span class="btn btn-sm">${d ? 'Học tiếp' : 'Bắt đầu'} ${I('arrow_r', 16)}</span></a>`;
  }

  SJ.talk = { page, teaser, canSpeak };
})(window.SJ);

/* SubelJapan — Sensei Mochi: gia sư AI (Claude) chạy ngay trong trình duyệt
 * - Người học tự dán khoá API Anthropic của mình. Khoá chỉ lưu trong trình duyệt này
 *   (localStorage riêng 'subeljapan_ai', không nằm trong file sao lưu) và chỉ gửi thẳng tới api.anthropic.com.
 * - Gọi API bằng thư viện chính thức @anthropic-ai/sdk, đóng gói sẵn ở js/vendor/anthropic-sdk.esm.js (chỉ tải khi dùng AI).
 * - Trang #/sensei: hỏi đáp, luyện hội thoại nhập vai, sửa câu, giải thích ngữ pháp, dịch.
 * - SJ.ai.explain(): Mochi giải thích câu trả lời sai trong bài học.
 * - SJ.ai.storyGen(): Mochi viết truyện đọc mới theo trình độ (thêm vào trang Đọc hiểu).
 */
window.SJ = window.SJ || {};
(function (SJ) {
  const U = () => SJ.ui;
  const I = (n, s, c) => SJ.icon(n, s, c);
  const G = (n, s, c) => SJ.glyph(n, s, c);
  const esc = s => SJ.ui.esc(s);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  // ---------- icon tự vẽ cho phần AI ----------
  SJ.addIcons({
    sensei: K => K.P('M11 14 L12.5 4 L20.5 10.5 Z', K.C.wht) + K.P('M37 14 L35.5 4 L27.5 10.5 Z', K.C.wht)
      + K.F('M13.2 11.5 L14 7 L17.6 10 Z', K.C.pink) + K.F('M34.8 11.5 L34 7 L30.4 10 Z', K.C.pink)
      + K.P('M5 21 q0 -10 10 -10 h18 q10 0 10 10 v3 q0 10 -10 10 h-9 l-7.5 6.5 l1.2 -6.6 q-12.7 -0.9 -12.7 -9.9 Z', K.C.wht)
      + K.D(17.5, 21.5, 2.3) + K.D(30.5, 21.5, 2.3) + K.P('M20.5 26 q1.75 2.2 3.5 0 q1.75 2.2 3.5 0')
      + K.D(13, 26, 2.4, K.C.pink, .85) + K.D(35, 26, 2.4, K.C.pink, .85) + K.H('M10 17 q1.5 -3 4.5 -4')
      + K.P('M42 2.5 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3 z', K.C.yel),
    ai_story: K => K.R(9, 7, 27, 34, 4, K.C.cream) + K.P('M15 15 h15 M15 21 h15 M15 27 h9') + K.P('M33.5 40 l-3 -9 l13 -19 q2 -2.6 4.2 -1 q2 1.6 0.2 4.2 l-13 19 Z', K.C.yel)
      + K.P('M30.5 31 l3 9 l1.6 -6.4 Z', K.C.peach) + K.P('M8 4 l1 2.5 2.5 1 -2.5 1 -1 2.5 -1 -2.5 -2.5 -1 2.5 -1 z', K.C.pink),
  }, {
    send: '<path d="M4.6 11.4 19 4.7c.6-.3 1.2.3.9.9l-6.7 14.4c-.3.6-1.2.5-1.3-.1l-1.4-5.9-5.9-1.4c-.6-.2-.7-1-.1-1.3z"/><path d="M10.6 13.4 19.6 5"/>',
    mic: '<rect x="9" y="3.4" width="6" height="11.2" rx="3"/><path d="M5.6 11.6a6.4 6.4 0 0 0 12.8 0M12 18v2.6M9 20.6h6"/>',
    stop: '<rect x="6.6" y="6.6" width="10.8" height="10.8" rx="2.6"/>',
    key: '<circle cx="8.2" cy="15.6" r="4.3"/><path d="M11.3 12.5 19.8 4M16.6 7.2l2.5 2.5M14.3 9.5l2 2"/>',
    plus: '<path d="M12 5.2v13.6M5.2 12h13.6"/>',
    chat: '<path d="M4.2 7.2a2.2 2.2 0 0 1 2.2-2.2h11.2a2.2 2.2 0 0 1 2.2 2.2v7.6a2.2 2.2 0 0 1-2.2 2.2h-6.4l-4.6 3.4V17H6.4a2.2 2.2 0 0 1-2.2-2.2z"/>',
  });

  // ---------- cấu hình & lưu trữ (tách riêng khỏi tiến độ học) ----------
  const KEY = 'subeljapan_ai';
  const MODELS = [
    { id: 'claude-opus-5-5', name: 'Claude Opus 5.5', note: 'Thông minh nhất, giải thích kỹ nhất', tag: 'Mặc định' },
    { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5', note: 'Nhanh hơn, rẻ hơn, vẫn rất giỏi', tag: '' },
    { id: 'claude-haiku-5-5', name: 'Claude Haiku 5.5', note: 'Siêu nhanh, rẻ nhất, hợp hỏi nhanh', tag: '' },
  ];
  const MAX_MSG = 60; // quá dài thì mở cuộc trò chuyện mới (không cắt bớt giữa chừng)
  const DEF = () => ({ key: '', model: MODELS[0].id, chats: {}, stories: [], autoRead: true, ime: false, xpDay: '', xpToday: 0 });
  let A = load();
  function load() {
    try { const o = Object.assign(DEF(), JSON.parse(localStorage.getItem(KEY) || '{}')); if (!MODELS.some(m => m.id === o.model)) o.model = MODELS[0].id; return o; }
    catch (e) { return DEF(); }
  }
  function save() {
    for (let tries = 0; tries < 8; tries++) {
      try { localStorage.setItem(KEY, JSON.stringify(A)); return; }
      catch (e) { // đầy bộ nhớ: bỏ cả cuộc trò chuyện cũ nhất rồi thử lại
        const ks = Object.keys(A.chats).sort((a, b) => (A.chats[a].t || 0) - (A.chats[b].t || 0));
        if (!ks.length) return; delete A.chats[ks[0]];
      }
    }
  }
  const hasKey = () => !!A.key;
  const modelName = () => (MODELS.find(m => m.id === A.model) || MODELS[0]).name;
  const maskKey = k => k ? k.slice(0, 7) + '…' + k.slice(-4) : '';

  // ---------- thư viện Claude (tải lười) ----------
  let sdkP = null, client = null, clientKey = '';
  function sdk() {
    return sdkP || (sdkP = import(new URL('js/vendor/anthropic-sdk.esm.js?v=1.6.0', document.baseURI).href).catch(e => { sdkP = null; throw e; }));
  }
  async function getClient() {
    const mod = await sdk();
    if (!client || clientKey !== A.key) {
      const Anthropic = mod.default || mod.Anthropic;
      // khoá của chính người học, gọi thẳng từ trình duyệt của họ
      client = new Anthropic({ apiKey: A.key, dangerouslyAllowBrowser: true, maxRetries: 2 });
      clientKey = A.key;
    }
    return { client, mod };
  }

  /** Gọi Claude, nhận chữ chạy dần. Trả về { text, msg }. */
  async function run({ system, messages, effort, format, maxTokens, onText, signal }) {
    const { client, mod } = await getClient();
    const params = {
      model: A.model,
      max_tokens: maxTokens || 64000,
      system,
      messages,
      output_config: { effort: effort || 'low' },
      cache_control: { type: 'ephemeral' },
    };
    if (format) params.output_config.format = format;
    // nếu bộ lọc an toàn từ chối nhầm, máy chủ tự chuyển sang mô hình dự phòng (Haiku không có dự phòng)
    if (A.model !== 'claude-haiku-5-5') { params.betas = ['server-side-fallback-2026-07-01']; params.fallbacks = 'default'; }
    try {
      const stream = client.beta.messages.stream(params, { signal });
      let text = '';
      for await (const ev of stream) {
        if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') { text += ev.delta.text; onText && onText(text); }
      }
      const msg = await stream.finalMessage();
      if (msg.stop_reason === 'refusal') { const er = new Error('refusal'); er.kind = 'refusal'; throw er; }
      if (msg.stop_reason === 'max_tokens') { const er = new Error('max'); er.kind = 'max'; er.text = text; throw er; }
      return { text, msg };
    } catch (e) { e.__mod = mod; throw e; }
  }
  // giữ nguyên các khối trả về để gửi lại ở lượt sau (kể cả khối suy nghĩ), chỉ bỏ phần trước điểm chuyển mô hình dự phòng
  function echoContent(content) {
    const last = content.map(b => b.type).lastIndexOf('fallback');
    return content.filter((b, i) => !(i < last && ['thinking', 'redacted_thinking', 'tool_use', 'server_tool_use'].includes(b.type)));
  }
  const textOf = c => typeof c === 'string' ? c : (c || []).filter(b => b.type === 'text').map(b => b.text).join('');

  function errText(e) {
    const M = (e && e.__mod) || {};
    const is = name => M[name] && e instanceof M[name];
    if (!e) return 'Có lỗi nhỏ, thử lại nha.';
    if (e.name === 'AbortError' || is('APIUserAbortError')) return '';
    if (e.kind === 'refusal') return 'Câu này Mochi không trả lời được. Mình hỏi chuyện khác về tiếng Nhật nha!';
    if (e.kind === 'max') return 'Câu trả lời dài quá nên bị cắt giữa chừng. Thử hỏi ngắn gọn hơn nha.';
    if (is('AuthenticationError')) return 'Khoá API chưa đúng hoặc đã bị xoá. Kiểm tra lại khoá trong Cài đặt AI nha.';
    if (is('PermissionDeniedError')) return 'Khoá này chưa được phép dùng mô hình đã chọn. Thử chọn mô hình khác trong Cài đặt AI.';
    if (is('NotFoundError')) return 'Tài khoản của bạn chưa dùng được mô hình này. Thử chọn mô hình khác trong Cài đặt AI.';
    if (is('RateLimitError')) return 'Mochi đang được hỏi dồn dập quá. Nghỉ vài giây rồi thử lại nha.';
    if (e.status === 402 || /credit balance|billing/i.test(e.message || '')) return 'Tài khoản Anthropic hết tiền rồi. Nạp thêm ở console.anthropic.com rồi quay lại nha.';
    if (is('BadRequestError')) return 'Yêu cầu chưa hợp lệ: ' + String(e.message || '').slice(0, 180);
    if (is('OverloadedError') || is('InternalServerError') || is('ServiceUnavailableError')) return 'Máy chủ AI đang bận. Đợi một chút rồi thử lại nha.';
    if (is('APIConnectionError')) return 'Không kết nối được tới máy chủ AI. Kiểm tra mạng rồi thử lại nha.';
    if (/Failed to fetch|import|module/i.test(e.message || '')) return 'Chưa tải được bộ kết nối AI. Kiểm tra mạng rồi tải lại trang nha.';
    return 'Có lỗi nhỏ: ' + String(e.message || e).slice(0, 180);
  }
  function giveXP() {
    const t = new Date().toDateString();
    if (A.xpDay !== t) { A.xpDay = t; A.xpToday = 0; }
    if (A.xpToday >= 30) return;
    A.xpToday += 2; save(); SJ.store.addXP(2);
  }

  // ---------- lời dặn cho Mochi ----------
  function learner() {
    const S = SJ.store.get(), lv = SJ.store.level();
    const units = (SJ.UNITS || []).map(u => `${u.title}: ${u.lessons.filter(l => S.lessons[l.id] && S.lessons[l.id].done).length}/${u.lessons.length}`).join('; ');
    return `Learner: ${S.name || 'bạn'}; site level ${lv.level}; lessons finished per unit: ${units}. If they have not finished Hiragana yet, always add romaji next to Japanese and avoid katakana/kanji unless asked. Match difficulty to this progress.`;
  }
  const BASE = () => `You are "Mochi" (もち), a cheerful white cat who teaches Japanese inside SubelJapan, a website where Vietnamese speakers learn to read and write Japanese from zero.

The person you talk to is a Vietnamese beginner. ${learner()}
Call them "bạn" and yourself "Mochi". Always reply in Vietnamese (apart from the Japanese you teach). Be warm and encouraging; mistakes are normal and never a reason to feel bad.

Keep replies short: usually 2 to 6 short lines. One idea at a time, plain words, concrete examples. Offer to go deeper instead of saying everything at once.

Formatting: the app renders only the following, so use nothing else.
- Furigana: whenever Japanese contains kanji, write each kanji word as {漢字|かな}, for example {日本|にほん}{語|ご}. Kana needs no markup.
- Example card: put each Japanese example sentence on its own line starting with "> " in the form
> Japanese | romaji | Vietnamese meaning
  for example:
> {水|みず}を ください。 | mizu o kudasai. | Cho mình xin nước.
- Bullet lines start with "- ". Bold with **like this**.
- No headings, tables, code blocks, links or emoji (the app draws its own pictures).
- Romaji only inside example cards, or in parentheses right after a new word, so the learner gets used to kana.

Accuracy matters more than sounding sure: if you are unsure about a reading or usage, say so briefly. Stay on Japanese and Japanese culture; if asked about something unrelated, answer in one friendly line and steer back to learning.`;

  const SUGG_RULE = 'When helpful, end with up to 3 short follow-up questions the learner could ask next, each on its own line starting with "+ " and written in Vietnamese.';
  const MODES = {
    chat: { icon: 'speech', name: 'Hỏi đáp', ph: 'Hỏi Mochi về tiếng Nhật…',
      hello: 'Chào bạn! Mình là **Sensei Mochi**. Hỏi mình bất cứ điều gì về tiếng Nhật nha: chữ cái, từ vựng, ngữ pháp, cách phát âm hay văn hoá Nhật.',
      sugg: ['Phân biệt は và が thế nào?', 'Mẹo nhớ bảng Hiragana thật nhanh?', 'Chào buổi sáng, trưa, tối nói sao?', 'Vì sao người Nhật nói いただきます?'],
      sys: 'Mode: free questions and answers. ' + SUGG_RULE },
    fix: { icon: 'pencil', name: 'Sửa câu', ph: 'Viết một câu tiếng Nhật…',
      hello: 'Gửi Mochi một câu tiếng Nhật bạn tự đặt (gõ kana hoặc romaji đều được), kèm ý bạn muốn nói nếu có. Mochi chấm điểm, sửa lỗi và giải thích cho nha!',
      sugg: ['わたしは がくせい です。', 'watashi wa neko ga suki', 'きのう がっこうに いきます。', 'Tôi muốn nói "tôi thích ăn phở": わたしは フォーを たべるが すき'],
      sys: 'Mode: sentence check. The learner sends a Japanese sentence (kana, kanji or romaji), sometimes with the meaning they intended. Begin your reply with exactly one tag on its own first line: [[OK]] if it is correct and natural, [[GAN]] if it is understandable but has small problems, [[SAI]] if it is wrong. Then give the corrected, natural version as an example card, then 1 to 3 bullets that explain each fix simply, then one short tip. If the message is not a Japanese sentence, kindly ask for one and do not use a tag.' },
    grammar: { icon: 'book', name: 'Ngữ pháp', ph: 'Mẫu ngữ pháp muốn hỏi…',
      hello: 'Bạn muốn Mochi giảng mẫu ngữ pháp nào? Mochi giải thích dễ hiểu, cho ví dụ từ dễ tới khó và một câu đố nhỏ để kiểm tra.',
      sugg: ['Mẫu 〜です', 'Trợ từ を dùng khi nào?', 'Thể ます là gì?', '〜たい: muốn làm gì đó'],
      sys: 'Mode: grammar explainer. For the grammar point asked: its meaning, the pattern in bold, 2 or 3 example cards from easy to a bit harder, one common mistake Vietnamese speakers make, then a one-question mini quiz (do not reveal the answer; ask them to reply). When they answer a quiz, grade gently and explain.' },
    translate: { icon: 'globe', name: 'Dịch', ph: 'Câu cần dịch…',
      hello: 'Gõ câu tiếng Việt, Mochi dịch sang tiếng Nhật tự nhiên và dễ nói. Gõ tiếng Nhật thì Mochi dịch sang tiếng Việt, kèm giải nghĩa từng từ.',
      sugg: ['Rất vui được gặp bạn', 'Nhà vệ sinh ở đâu ạ?', 'Tôi thích ăn phở', 'おなかが すきました'],
      sys: 'Mode: translator. If the input is Vietnamese, translate it into natural, simple Japanese as an example card; if it is Japanese, translate it into Vietnamese and still show it as an example card. Then a short word-by-word breakdown as bullets: word (romaji) — meaning. Mention a more polite or more casual version when it matters.' },
    role: { icon: 'talk', name: 'Luyện hội thoại', ph: 'Trả lời Mochi…' },
  };
  const SCENES = [
    { id: 'cafe', icon: 'coffee', name: 'Quán cà phê', desc: 'Gọi đồ uống, chọn cỡ ly, trả tiền', mochi: 'a friendly café staff member', you: 'a customer', col: '#f7dcc2' },
    { id: 'konbini', icon: 'shop', name: 'Cửa hàng tiện lợi', desc: 'Mua đồ, hâm nóng cơm hộp, xin túi', mochi: 'a convenience store (konbini) clerk', you: 'a customer', col: '#d6efe2' },
    { id: 'ramen', icon: 'ramen', name: 'Quán ramen', desc: 'Gọi món, hỏi món ngon, khen ngon', mochi: 'the owner of a small ramen shop', you: 'a customer', col: '#ffe1cf' },
    { id: 'road', icon: 'map', name: 'Hỏi đường', desc: 'Tìm ga tàu, rẽ trái rẽ phải', mochi: 'a kind passer-by on the street', you: 'a tourist who is lost', col: '#dcebff' },
    { id: 'intro', icon: 'nametag', name: 'Tự giới thiệu', desc: 'Tên, quê, sở thích, buổi gặp đầu', mochi: 'a Japanese person meeting the learner for the first time', you: 'themself', col: '#ffe0ea' },
    { id: 'friend', icon: 'friends', name: 'Làm quen bạn mới', desc: 'Nói chuyện thân mật, rủ đi chơi', mochi: 'a Japanese student of the same age (use casual but simple Japanese)', you: 'a new friend', col: '#efe6ff' },
    { id: 'hotel', icon: 'suitcase', name: 'Khách sạn', desc: 'Nhận phòng, hỏi giờ ăn sáng, wifi', mochi: 'a hotel front desk receptionist', you: 'a guest checking in', col: '#e2f3fb' },
    { id: 'shirt', icon: 'shirt', name: 'Mua quần áo', desc: 'Hỏi cỡ, màu, thử đồ, giá tiền', mochi: 'a clothing shop assistant', you: 'a shopper', col: '#fff1c9' },
    { id: 'plane', icon: 'plane', name: 'Sân bay', desc: 'Làm thủ tục, hỏi cổng lên máy bay', mochi: 'an airport check-in staff member', you: 'a traveller', col: '#dff5f2' },
    { id: 'school', icon: 'school', name: 'Lớp học tiếng Nhật', desc: 'Chào thầy cô, hỏi bài, xin phép', mochi: 'a kind Japanese teacher in class', you: 'a student', col: '#e9f1d9' },
  ];
  const roleSys = sc => `Mode: roleplay. Scene: ${sc.name} (${sc.desc}). You play ${sc.mochi}; the learner plays ${sc.you}. Stay in character and speak simple, polite Japanese suited to a beginner: short sentences, mostly kana, kanji only with furigana markup.
Every reply contains, in this order:
1) Your line in character as 1 or 2 example cards.
2) Only if the learner's last message had a mistake: one line starting with "Mochi sửa nhẹ:" that gives the natural way to say it.
3) 2 or 3 replies the learner could say next, each on its own line starting with "+ ", written in Japanese, then " — " and the Vietnamese meaning.
The learner may answer in Japanese, romaji or Vietnamese; if they write Vietnamese, first show how to say it in Japanese, then continue the scene. After about 8 to 10 exchanges, end the scene naturally, then write a short review in Vietnamese: what they did well and 2 phrases worth remembering (as example cards).
The first user message only means "start the scene": open the scene yourself with a greeting.`;

  // ---------- hiển thị chữ trả lời ----------
  function splitBar(s) { const out = []; let cur = '', d = 0; for (const ch of s) { if (ch === '{') d++; else if (ch === '}') d = Math.max(0, d - 1); if (ch === '|' && !d) { out.push(cur.trim()); cur = ''; } else cur += ch; } out.push(cur.trim()); return out; }
  const inline = t => U().ruby(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  function exCard(body) {
    const [jp, r, vi] = splitBar(body);
    if (!jp) return '';
    return `<div class="ai-ex"><button class="ai-ex-say" data-say="${esc(U().reading(jp))}" title="Nghe" aria-label="Nghe">${I('speaker', 22)}</button><div class="grow"><div class="ai-ex-jp jp">${U().ruby(jp)}</div>${r ? `<div class="ai-ex-r">${esc(r)}</div>` : ''}${vi ? `<div class="ai-ex-vi">${inline(vi)}</div>` : ''}</div></div>`;
  }
  const STAMP = { OK: ['正解', 'Chuẩn rồi!', 'ok'], GAN: ['惜しい', 'Gần đúng rồi', 'near'], SAI: ['直し', 'Sửa chút nha', 'bad'] };
  function md(src, streaming) {
    let s = String(src || '').replace(/\r/g, '');
    if (streaming) s = s.replace(/\{[^}\n]*$/, '').replace(/\[\[[A-Z]*\]?$/, '');
    let tag = '';
    s = s.replace(/^\s*\[\[(OK|GAN|SAI)\]\]\s*/, (_, t) => { tag = t; return ''; });
    let out = '', list = null, gap = false;
    const sugg = [];
    const close = () => { if (list) { out += `</${list}>`; list = null; } };
    for (const raw of s.split('\n')) {
      const ln = raw.trimEnd();
      let m;
      if ((m = ln.match(/^\s*>\s?(.*)/))) { close(); out += exCard(m[1]); gap = false; continue; }
      if ((m = ln.match(/^\s*\+\s+(.*)/))) { close(); sugg.push(m[1]); continue; }
      if ((m = ln.match(/^\s*[-•*]\s+(.*)/))) { if (list !== 'ul') { close(); out += '<ul>'; list = 'ul'; } out += `<li>${inline(m[1])}</li>`; gap = false; continue; }
      if ((m = ln.match(/^\s*(\d+)[.)]\s+(.*)/))) { if (list !== 'ol') { close(); out += '<ol>'; list = 'ol'; } out += `<li>${inline(m[2])}</li>`; gap = false; continue; }
      close();
      if (!ln.trim()) { if (out && !gap) { out += '<div class="ai-gap"></div>'; gap = true; } continue; }
      out += `<p>${inline(ln.replace(/^#+\s*/, ''))}</p>`; gap = false;
    }
    close();
    const st = tag && STAMP[tag];
    const head = st ? `<div class="ai-stamp ${st[2]}">${U().hanko(st[0], 'sm stamp-in')}<b>${st[1]}</b></div>` : '';
    const chips = sugg.length ? `<div class="ai-suggs">${sugg.map(x => { const [jp, vi] = x.split(/\s+[—–-]\s+/); const fill = vi ? U().baseText(jp) : x; return `<button class="ai-sugg" data-fill="${esc(fill)}"><span class="${vi ? 'jp' : ''}">${inline(jp)}</span>${vi ? `<small>${esc(vi)}</small>` : ''}</button>`; }).join('')}</div>` : '';
    return head + out + chips;
  }

  // ---------- cài đặt khoá & mô hình ----------
  function keyForm(compact) {
    return `<form class="ai-keyform" data-keyform>
      <label class="ai-lbl" for="ai-key">${G('key', 18)} Khoá API Anthropic</label>
      <div class="ai-keyrow"><input id="ai-key" class="input" type="password" autocomplete="off" spellcheck="false" placeholder="${A.key ? 'Đã lưu ' + esc(maskKey(A.key)) + ' — dán khoá mới để đổi' : 'sk-ant-…'}"><button type="button" class="ai-eye" data-eye title="Hiện/ẩn khoá" aria-label="Hiện hoặc ẩn khoá">${G('eye', 20)}</button></div>
      <label class="ai-lbl">${G('sparkle', 18)} Bộ não của Mochi</label>
      <div class="ai-models">${MODELS.map(m => `<label class="ai-model ${A.model === m.id ? 'on' : ''}"><input type="radio" name="ai-model" value="${m.id}" ${A.model === m.id ? 'checked' : ''}><span class="am-dot"></span><span class="grow"><b>${m.name}</b><small>${m.note}</small></span>${m.tag ? `<i class="am-tag">${m.tag}</i>` : ''}</label>`).join('')}</div>
      ${compact ? '' : `<div class="ai-privacy">${I('lock', 30)}<span>Khoá chỉ lưu trong trình duyệt này và chỉ gửi thẳng tới Anthropic khi bạn hỏi Mochi. Khoá không nằm trong file sao lưu. Đừng lưu khoá trên máy dùng chung nha.</span></div>`}
      <div class="ai-formmsg" data-formmsg></div>
      <div class="row gap wrap ai-formbtns">${A.key ? `<button type="button" class="btn btn-white" data-delkey>${G('trash', 18)} Xoá khoá</button>` : ''}<span class="grow"></span><button class="btn" type="submit">${G('check', 20)} Lưu và đánh thức Mochi</button></div>
    </form>`;
  }
  function bindKeyForm(root, onDone) {
    const f = root.querySelector('[data-keyform]'); if (!f) return;
    const inp = f.querySelector('#ai-key'), msg = f.querySelector('[data-formmsg]');
    f.querySelector('[data-eye]').onclick = () => { inp.type = inp.type === 'password' ? 'text' : 'password'; inp.focus(); };
    f.querySelectorAll('input[name="ai-model"]').forEach(r => r.onchange = () => { f.querySelectorAll('.ai-model').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); SJ.audio.sfx('tap'); });
    const del = f.querySelector('[data-delkey]');
    if (del) del.onclick = async () => { if (!(await U().confirm('Xoá khoá API khỏi trình duyệt này? Lịch sử trò chuyện vẫn được giữ.', 'Xoá khoá', 'Thôi'))) return; A.key = ''; save(); client = null; U().toast(`${I('lock', 26)} Đã xoá khoá API`); onDone && onDone('del'); };
    f.onsubmit = async e => {
      e.preventDefault();
      const k = inp.value.trim(), model = (f.querySelector('input[name="ai-model"]:checked') || {}).value || A.model;
      if (!k && !A.key) { msg.className = 'ai-formmsg bad'; msg.textContent = 'Dán khoá API vào ô phía trên trước nha.'; inp.focus(); return; }
      if (k && !/^sk-ant-/.test(k)) { msg.className = 'ai-formmsg bad'; msg.textContent = 'Khoá của Anthropic thường bắt đầu bằng "sk-ant-". Kiểm tra lại giúp Mochi nha.'; return; }
      const old = { key: A.key, model: A.model };
      if (k) A.key = k; A.model = model;
      const btn = f.querySelector('[type=submit]'); btn.disabled = true;
      msg.className = 'ai-formmsg wait'; msg.innerHTML = `<span class="ai-typing"><i></i><i></i><i></i></span> Đang đánh thức Mochi…`;
      try {
        await run({ system: 'Reply with exactly one word: はい', messages: [{ role: 'user', content: 'Chào Mochi!' }], effort: 'low', maxTokens: 4000 });
        save(); SJ.audio.sfx('win'); U().toast(`${I('sensei', 30)} Sensei Mochi đã thức dậy!`); onDone && onDone('ok');
      } catch (er) {
        Object.assign(A, old); client = null;
        msg.className = 'ai-formmsg bad'; msg.textContent = errText(er) || 'Đã huỷ.'; btn.disabled = false;
      }
    };
  }
  function settings(onDone) {
    const m = U().modal(`<div class="ai-set"><div class="ai-set-head">${U().mascot('happy', 74, 'bob', { acc: 'acc_grad' })}<div><h3>Cài đặt Sensei Mochi</h3><p class="muted">Đang dùng: <b>${hasKey() ? modelName() : 'chưa có khoá'}</b></p></div></div>${keyForm()}${howTo()}</div>`, { cls: 'ai-modal' });
    bindKeyForm(m.el, r => { m.close(); onDone && onDone(r); SJ.emit('ai'); });
  }
  const howTo = () => `<details class="ai-how"><summary>${G('question', 18)} Lấy khoá API ở đâu?</summary><ol>
      <li>Vào <b>console.anthropic.com</b> và đăng ký tài khoản (dùng email là được).</li>
      <li>Vào mục <b>Billing</b> nạp một ít tiền: Claude tính phí theo lượng chữ bạn hỏi và Mochi trả lời.</li>
      <li>Vào mục <b>API Keys</b>, bấm <b>Create Key</b>, đặt tên rồi sao chép khoá (bắt đầu bằng <code>sk-ant-</code>).</li>
      <li>Dán khoá vào ô phía trên rồi bấm <b>Lưu</b>. Xong!</li></ol>
      <a class="btn btn-white btn-sm" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">${G('arrow_r', 18)} Mở trang lấy khoá</a></details>`;

  // ---------- TRANG SENSEI MOCHI ----------
  const threadKey = (mode, sc) => mode === 'role' ? 'role:' + sc : mode;
  function page(root, arg) {
    const sArg = String(arg || ''), ci = sArg.indexOf(':');
    let mode = ci < 0 ? sArg : sArg.slice(0, ci), extra = ci < 0 ? '' : sArg.slice(ci + 1);
    if (!MODES[mode]) mode = 'chat';
    let scene = mode === 'role' && SCENES.some(s => s.id === extra) ? extra : null;
    let prefill = mode !== 'role' && extra ? extra : '';
    let busy = null, rec = null, alive = true, pendingDraw = 0;
    const offs = [];

    function frame() {
      return `<div class="page-mid sensei">
        <div class="ss-head">
          <div class="ss-mochi">${U().mascot('happy', 92, 'bob', { acc: 'acc_grad' })}<span class="ss-spark s1">${I('sparkle', 22)}</span><span class="ss-spark s2">${I('star_s', 18)}</span></div>
          <div class="grow"><h1>Sensei Mochi <span class="ss-badge">AI</span></h1><p>Gia sư AI siêu kiên nhẫn: hỏi gì cũng được, luyện nói nhập vai, sửa câu, giảng ngữ pháp và dịch.</p></div>
          <div class="ss-tools" data-tools></div>
        </div>
        <div class="ss-modes" role="tablist">${Object.keys(MODES).map(k => `<button role="tab" data-mode="${k}" class="${k === mode ? 'active' : ''}">${I(MODES[k].icon, 26)}<span>${MODES[k].name}</span></button>`).join('')}</div>
        <div class="ss-body" data-body></div>
      </div>`;
    }
    const toolsHTML = () => `${hasKey() ? `<button class="btn btn-white btn-sm" data-new title="Cuộc trò chuyện mới">${G('plus', 18)}<span>Mới</span></button>` : ''}<button class="btn btn-white btn-sm" data-set title="Cài đặt AI">${G('key', 18)}<span>${hasKey() ? esc(modelName().replace('Claude ', '')) : 'Cài đặt'}</span></button>`;
    // khung trang vẽ một lần; đổi chế độ chỉ thay phần thân → không nhấp nháy
    function setBody(html) {
      if (!root.querySelector('.sensei')) root.innerHTML = frame();
      root.querySelector('[data-tools]').innerHTML = toolsHTML();
      root.querySelectorAll('[data-mode]').forEach(b => { const on = b.dataset.mode === mode; b.classList.toggle('active', on); b.setAttribute('aria-selected', on); if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
      const b = root.querySelector('[data-body]');
      b.innerHTML = html; b.classList.remove('swap'); void b.offsetWidth; b.classList.add('swap');
    }

    // ----- chưa có khoá -----
    function drawSetup() {
      setBody(`<div class="ss-setup">
        <div class="card ss-wake">
          <div class="ssw-art"><div class="ssw-moon">${I('moon', 54)}</div>${U().mascot('sleep', 132)}<span class="ssw-z z1">z</span><span class="ssw-z z2">z</span><span class="ssw-z z3">Z</span></div>
          <h2>Mochi đang ngủ trưa…</h2>
          <p>Sensei Mochi chạy bằng <b>Claude</b>, trí tuệ nhân tạo của Anthropic. Dán khoá API của bạn vào đây để đánh thức Mochi nha!</p>
          <div class="ss-steps">${[['key', 'Lấy khoá', 'Tạo khoá ở trang console.anthropic.com'], ['lock', 'Dán vào đây', 'Khoá chỉ nằm trong trình duyệt của bạn'], ['sensei', 'Hỏi Mochi', 'Trò chuyện, sửa câu, luyện nói']].map((s, i) => `<div class="ss-step"><i class="ss-num">${i + 1}</i>${I(s[0], 40)}<b>${s[1]}</b><small>${s[2]}</small></div>`).join('')}</div>
          ${keyForm()}${howTo()}
        </div>
        <div class="card ss-demo"><div class="ssd-title">${G('eye', 18)} Xem trước Mochi trò chuyện</div>
          <div class="ai-log demo">
            <div class="ai-msg me"><div class="ai-bub">Chữ ね và れ khác nhau thế nào?</div></div>
            <div class="ai-msg mochi"><div class="ai-ava">${U().mascot('happy', 40)}</div><div class="ai-bub">${md('Hai chữ này giống nhau ở nét bên trái, khác ở **đuôi** nè:\n- **ね** (ne): đuôi cuộn tròn như **chú mèo cuộn đuôi**. ねこ là con mèo!\n- **れ** (re): đuôi hất ra ngoài như **người đang chạy**.\n> ねこ が います。 | neko ga imasu. | Có một con mèo.\n+ Còn わ thì sao?\n+ Cho mình bài tập phân biệt nhé')}</div></div>
          </div></div>
      </div>`);
      bindKeyForm(root, () => draw());
    }

    // ----- chọn tình huống nhập vai -----
    function drawScenes() {
      setBody(`<div class="ss-scenes-head"><b>Chọn một tình huống</b><span class="muted">Mochi đóng vai người Nhật, bạn nói chuyện như thật. Mochi gợi ý câu trả lời và sửa nhẹ khi bạn sai.</span></div>
        <div class="ss-scenes">${SCENES.map((s, i) => { const th = A.chats[threadKey('role', s.id)]; const n = th ? th.messages.filter(m => m.role === 'user' && !m.hidden).length : 0; return `<button class="ss-scene" data-scene="${s.id}" style="--sc:${s.col};--i:${i}"><span class="ssc-ico">${I(s.icon, 54)}</span><b>${s.name}</b><small>${s.desc}</small>${n ? `<i class="ssc-cont">Đang dở · ${n} lượt</i>` : ''}</button>`; }).join('')}</div>`);
    }

    // ----- khung trò chuyện -----
    function getThread() {
      const k = threadKey(mode, scene);
      let th = A.chats[k];
      if (!th) {
        const sc = SCENES.find(s => s.id === scene);
        th = A.chats[k] = { system: BASE() + '\n\n' + (mode === 'role' ? roleSys(sc) : MODES[mode].sys), messages: [], t: Date.now() };
      }
      return th;
    }
    function msgHTML(m) {
      if (m.hidden) return '';
      if (m.role === 'user') return `<div class="ai-msg me"><div class="ai-bub">${esc(m.content).replace(/\n/g, '<br>')}</div></div>`;
      return `<div class="ai-msg mochi"><div class="ai-ava">${U().mascot('happy', 40)}</div><div class="ai-bub">${md(textOf(m.content))}</div></div>`;
    }
    function drawChat() {
      const th = getThread();
      const M = MODES[mode], sc = SCENES.find(s => s.id === scene);
      const hello = mode === 'role' ? '' : `<div class="ai-msg mochi hello"><div class="ai-ava">${U().mascot('cheer', 40)}</div><div class="ai-bub">${md(M.hello + '\n' + M.sugg.map(x => '+ ' + x).join('\n'))}</div></div>`;
      const banner = sc ? `<div class="ss-banner" style="--sc:${sc.col}"><span class="ssb-ico">${I(sc.icon, 46)}</span><div class="grow"><b>${sc.name}</b><small>Bạn là ${({ 'a customer': 'khách', 'a tourist who is lost': 'khách du lịch bị lạc', themself: 'chính bạn', 'a new friend': 'bạn mới', 'a guest checking in': 'khách nhận phòng', 'a shopper': 'người mua', 'a traveller': 'hành khách', 'a student': 'học sinh' })[sc.you] || 'bạn'} · Mochi là người Nhật trong cảnh này</small></div><label class="ss-auto" title="Tự đọc câu của Mochi"><input type="checkbox" data-autoread ${A.autoRead ? 'checked' : ''}><i>${I('speaker', 22)}</i></label><button class="btn btn-white btn-sm" data-scenes>${G('arrow_l', 18)} Đổi cảnh</button></div>` : '';
      setBody(`${banner}<div class="card ai-chat ${mode}">
        <div class="ai-log" data-log>${hello}${th.messages.map(msgHTML).join('')}</div>
        ${th.messages.length >= MAX_MSG ? `<div class="ai-full">${I('sleep', 30)} Cuộc trò chuyện dài quá rồi, Mochi hơi mệt. <button class="btn btn-sm" data-new>${G('plus', 18)} Trò chuyện mới</button></div>` : ''}
        <form class="ai-compose" data-compose>
          <button type="button" class="ai-tool ${A.ime ? 'on' : ''}" data-ime title="Gõ romaji tự đổi thành chữ Nhật" aria-label="Bật tắt gõ tiếng Nhật"><span class="jp">あ</span></button>
          ${SR ? `<button type="button" class="ai-tool" data-mic title="Nói tiếng Nhật" aria-label="Nói tiếng Nhật">${G('mic', 20)}</button>` : ''}
          <textarea rows="1" data-input placeholder="${esc(A.ime ? 'Gõ romaji: arigatou → ありがとう' : M.ph)}" aria-label="Tin nhắn cho Mochi"></textarea>
          <button class="ai-send" type="submit" data-send aria-label="Gửi">${G('send', 22)}</button>
        </form>
      </div>
      <p class="ss-foot muted">${I('sensei', 22)} Mochi dùng ${esc(modelName())}. AI đôi khi cũng nhầm, gặp chỗ lạ thì hỏi lại Mochi nha.</p>`);
      const log = root.querySelector('[data-log]');
      log.scrollTop = log.scrollHeight;
      const inp = root.querySelector('[data-input]');
      if (prefill) { inp.value = prefill; prefill = ''; grow(inp); }
      if (window.matchMedia('(pointer:fine)').matches) setTimeout(() => inp.focus({ preventScroll: true }), 80);
      // cảnh mới: Mochi mở lời trước
      if (mode === 'role' && !th.messages.length) send('Bắt đầu tình huống nhé!', true);
    }
    const grow = t => { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px'; };

    function draw() {
      if (!alive) return;
      if (!hasKey()) return drawSetup();
      if (mode === 'role' && !scene) return drawScenes();
      drawChat();
    }

    function setBusy(on) {
      const b = root.querySelector('[data-send]');
      if (b) { b.classList.toggle('stop', on); b.innerHTML = on ? G('stop', 22) : G('send', 22); b.setAttribute('aria-label', on ? 'Dừng' : 'Gửi'); }
    }
    async function send(text, hidden) {
      if (busy) return;
      const th = getThread();
      if (th.messages.length >= MAX_MSG) return;
      text = String(text || '').trim(); if (!text) return;
      const log = root.querySelector('[data-log]');
      th.messages.push({ role: 'user', content: text, hidden: !!hidden }); th.t = Date.now(); save();
      if (mode !== 'role' && location.hash.indexOf(':') > 0) history.replaceState(null, '', '#/sensei/' + mode);
      if (!hidden) { log.insertAdjacentHTML('beforeend', msgHTML(th.messages[th.messages.length - 1])); SJ.audio.sfx('pop'); }
      const wrap = document.createElement('div');
      wrap.className = 'ai-msg mochi live';
      wrap.innerHTML = `<div class="ai-ava">${U().mascot('normal', 40, 'think')}</div><div class="ai-bub"><span class="ai-typing" title="Mochi đang nghĩ"><i></i><i></i><i></i></span><span class="ai-think">Mochi đang nghĩ…</span></div>`;
      log.appendChild(wrap);
      const bub = wrap.querySelector('.ai-bub');
      const near = () => log.scrollHeight - log.scrollTop - log.clientHeight < 140;
      log.scrollTop = log.scrollHeight;
      const ac = new AbortController(); busy = ac; setBusy(true);
      let latest = '';
      const paint = () => { pendingDraw = 0; const stick = near(); bub.innerHTML = md(latest, true) + '<span class="ai-caret"></span>'; if (stick) log.scrollTop = log.scrollHeight; };
      try {
        const { text: out, msg } = await run({
          system: th.system, signal: ac.signal, effort: 'low',
          messages: th.messages.map(m => ({ role: m.role, content: m.content })),
          onText: t => { latest = t; if (!pendingDraw) pendingDraw = requestAnimationFrame(paint); },
        });
        if (pendingDraw) cancelAnimationFrame(pendingDraw), pendingDraw = 0;
        th.messages.push({ role: 'assistant', content: echoContent(msg.content) }); th.t = Date.now(); save();
        wrap.classList.remove('live');
        wrap.querySelector('.ai-ava').innerHTML = U().mascot(/\[\[SAI\]\]/.test(out) ? 'sad' : /\[\[OK\]\]/.test(out) ? 'cheer' : 'happy', 40);
        bub.innerHTML = md(out);
        if (/\[\[OK\]\]/.test(out)) SJ.audio.sfx('ok');
        else SJ.audio.sfx('note', 3);
        if (mode === 'role' && A.autoRead) { const say = bub.querySelector('.ai-ex [data-say]'); if (say) SJ.audio.speak(say.dataset.say); }
        giveXP();
        if (near()) log.scrollTop = log.scrollHeight;
      } catch (e) {
        if (pendingDraw) cancelAnimationFrame(pendingDraw), pendingDraw = 0;
        const t = errText(e);
        if (!t && latest.trim()) { // người học bấm dừng: giữ phần đã viết
          th.messages.push({ role: 'assistant', content: [{ type: 'text', text: latest }] }); save();
          wrap.classList.remove('live'); bub.innerHTML = md(latest) + '<div class="ai-cut">Đã dừng</div>';
        } else {
          // bỏ câu hỏi chưa được trả lời để lượt sau gửi lại sạch sẽ
          const last = th.messages[th.messages.length - 1];
          if (last && last.role === 'user') th.messages.pop();
          save();
          if (!t) { wrap.remove(); }
          else {
            wrap.classList.remove('live'); wrap.classList.add('err');
            wrap.querySelector('.ai-ava').innerHTML = U().mascot('sad', 40);
            bub.innerHTML = `<p>${esc(t)}</p><div class="row gap-s wrap"><button class="btn btn-sm" data-retry="${esc(text)}" data-hid="${hidden ? 1 : ''}">${G('refresh', 18)} Thử lại</button>${/Khoá|khoá|mô hình|tiền/.test(t) ? `<button class="btn btn-sm btn-white" data-set>${G('key', 18)} Cài đặt AI</button>` : ''}</div>`;
            SJ.audio.sfx('bad');
          }
        }
      } finally {
        busy = null; setBusy(false);
        if (th.messages.length >= MAX_MSG && alive) draw();
      }
    }

    function micToggle(btn) {
      if (rec) { rec.stop(); return; }
      const inp = root.querySelector('[data-input]');
      rec = new SR(); rec.lang = 'ja-JP'; rec.interimResults = true; rec.maxAlternatives = 1;
      const base = inp.value;
      btn.classList.add('rec');
      rec.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; inp.value = (base ? base + ' ' : '') + t; grow(inp); };
      rec.onerror = e => { if (e.error === 'not-allowed') U().toast(`${I('mute', 26)} Bạn chưa cho phép dùng micro`); };
      rec.onend = () => { btn.classList.remove('rec'); rec = null; };
      try { rec.start(); SJ.audio.sfx('tap'); } catch (e) { rec = null; btn.classList.remove('rec'); }
    }

    root.addEventListener('click', e => {
      const t = e.target;
      const md_ = t.closest('[data-mode]');
      if (md_) { if (busy) busy.abort(); mode = md_.dataset.mode; scene = null; history.replaceState(null, '', '#/sensei/' + mode); SJ.audio.sfx('tap'); return draw(); }
      const sc = t.closest('[data-scene]');
      if (sc) { scene = sc.dataset.scene; history.replaceState(null, '', '#/sensei/role:' + scene); SJ.audio.sfx('open'); return draw(); }
      if (t.closest('[data-scenes]')) { if (busy) busy.abort(); scene = null; history.replaceState(null, '', '#/sensei/role'); return draw(); }
      if (t.closest('[data-set]')) return settings(() => draw());
      if (t.closest('[data-new]')) {
        if (busy) busy.abort();
        const k = threadKey(mode, scene);
        if (A.chats[k] && A.chats[k].messages.length) { delete A.chats[k]; save(); U().toast(`${I('sensei', 28)} Bắt đầu cuộc trò chuyện mới`); }
        return draw();
      }
      const f = t.closest('[data-fill]');
      if (f) { const inp = root.querySelector('[data-input]'); if (!inp || busy) return; if (mode === 'role' || f.closest('.hello')) { inp.value = f.dataset.fill; grow(inp); inp.focus(); } else send(f.dataset.fill); SJ.audio.sfx('tap'); return; }
      const r = t.closest('[data-retry]');
      if (r) { r.closest('.ai-msg').remove(); return send(r.dataset.retry, !!r.dataset.hid); }
      const ime = t.closest('[data-ime]');
      if (ime) { A.ime = !A.ime; save(); ime.classList.toggle('on', A.ime); const inp = root.querySelector('[data-input]'); inp.placeholder = A.ime ? 'Gõ romaji: arigatou → ありがとう' : MODES[mode].ph; inp.focus(); SJ.audio.sfx('tap'); return; }
      const mic = t.closest('[data-mic]');
      if (mic) return micToggle(mic);
      const snd = t.closest('[data-send]');
      if (snd && busy) { e.preventDefault(); busy.abort(); }
    });
    root.addEventListener('change', e => { if (e.target.matches('[data-autoread]')) { A.autoRead = e.target.checked; save(); } });
    root.addEventListener('submit', e => {
      if (!e.target.matches('[data-compose]')) return;
      e.preventDefault();
      if (busy) return;
      const inp = root.querySelector('[data-input]');
      let v = inp.value;
      if (A.ime) v = SJ.ime.toHira(v, true);
      if (!v.trim()) { inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); return; }
      inp.value = ''; grow(inp); send(v);
    });
    root.addEventListener('input', e => {
      if (!e.target.matches('[data-input]')) return;
      const t = e.target;
      if (A.ime && !e.isComposing) { const pos = t.selectionStart === t.value.length; const nv = SJ.ime.toHira(t.value, false); if (nv !== t.value) { t.value = nv; if (pos) t.selectionStart = t.selectionEnd = nv.length; } }
      grow(t);
    });
    root.addEventListener('keydown', e => {
      if (e.target.matches('[data-input]') && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); root.querySelector('[data-compose]').requestSubmit(); }
    });
    const onAi = () => draw();
    SJ.on('ai', onAi);
    offs.push(() => SJ.off('ai', onAi));
    draw();
    return { destroy() { alive = false; if (busy) busy.abort(); if (rec) try { rec.abort(); } catch (e) { } if (pendingDraw) cancelAnimationFrame(pendingDraw); offs.forEach(f => f()); } };
  }

  // ---------- Mochi giải thích câu sai trong bài học ----------
  function explain(ctx) {
    const m = U().modal(`<div class="ai-explain"><div class="ae-head">${U().mascot('normal', 70, 'bob', { acc: 'acc_grad' })}<div><h3>Mochi giải thích nè</h3><p class="muted">Vì sao đáp án đúng lại là vậy?</p></div></div><div class="ai-bub ae-out" data-out><span class="ai-typing"><i></i><i></i><i></i></span><span class="ai-think">Mochi đang nghĩ…</span></div></div>`, { cls: 'modal-sm ai-modal', onClose: () => ac.abort() });
    const out = m.el.querySelector('[data-out]');
    const ac = new AbortController();
    if (!hasKey()) {
      out.innerHTML = `<p>Mochi cần khoá API để giải thích bằng AI. Cài một lần là dùng được ở mọi bài học nha!</p><div class="row gap-s wrap"><a class="btn btn-sm" href="#/sensei">${I('sensei', 22)} Đánh thức Sensei Mochi</a></div>`;
      return;
    }
    const q = [`Question shown: ${ctx.ask || ''}`, ctx.prompt ? `Prompt: ${ctx.prompt}` : '', ctx.picked ? `Learner answered: ${ctx.picked}` : '', ctx.right ? `Correct answer: ${ctx.right}` : '', ctx.hint ? `Hint shown by the app: ${ctx.hint}` : ''].filter(Boolean).join('\n');
    let latest = '', raf = 0;
    run({
      system: BASE() + '\n\nMode: explain a quiz mistake. The learner just got this lesson question wrong. In 2 to 4 short lines explain why the correct answer is correct and how to tell it apart from what they chose (a memory trick helps), then give one example card. No follow-up suggestions.',
      messages: [{ role: 'user', content: q }], effort: 'low', signal: ac.signal,
      onText: t => { latest = t; if (!raf) raf = requestAnimationFrame(() => { raf = 0; out.innerHTML = md(latest, true) + '<span class="ai-caret"></span>'; }); },
    }).then(({ text }) => { cancelAnimationFrame(raf); out.innerHTML = md(text); giveXP(); })
      .catch(e => { cancelAnimationFrame(raf); const t = errText(e); if (t) out.innerHTML = `<p>${esc(t)}</p>`; });
  }

  // ---------- Mochi viết truyện mới ----------
  const STORY_ICONS = ['cat', 'dog', 'rabbit', 'bear', 'panda', 'fox', 'bird', 'fish', 'school', 'house', 'family', 'friends', 'rice', 'ramen', 'sushi', 'onigiri', 'cake', 'tea', 'coffee', 'apple', 'sun', 'moon', 'rain_s', 'snow', 'maple', 'sakura', 'summer', 'fuji', 'torii', 'train', 'plane', 'car', 'boat', 'shop', 'cart', 'park', 'ball', 'music', 'book', 'gift', 'party', 'camera', 'map', 'suitcase', 'umbrella', 'flower', 'tulip', 'lantern'].filter(n => SJ.hasIcon(n));
  const TOPICS = [['cat', 'Mèo Mochi'], ['school', 'Ở trường'], ['family', 'Gia đình'], ['maple', 'Mùa thu'], ['rice', 'Đồ ăn'], ['shop', 'Đi mua sắm'], ['suitcase', 'Du lịch Nhật Bản'], ['friends', 'Bạn bè'], ['party', 'Sinh nhật'], ['sakura', 'Lễ hội']];
  const LEVELS = [[1, 'Chỉ Hiragana', 'Vừa học xong bảng chữ mềm'], [2, '+ Katakana', 'Có thêm từ mượn nước ngoài'], [3, '+ Kanji dễ', 'Có Kanji kèm cách đọc nhỏ']];
  const STORY_SCHEMA = {
    type: 'object', additionalProperties: false, required: ['title', 'vi', 'desc', 'icon', 'lines', 'words', 'quiz'],
    properties: {
      title: { type: 'string' }, vi: { type: 'string' }, desc: { type: 'string' },
      icon: { type: 'string', enum: STORY_ICONS },
      lines: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['jp', 'r', 'vi'], properties: { jp: { type: 'string' }, r: { type: 'string' }, vi: { type: 'string' } } } },
      words: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['jp', 'r', 'vi'], properties: { jp: { type: 'string' }, r: { type: 'string' }, vi: { type: 'string' } } } },
      quiz: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['q', 'right', 'wrong'], properties: { q: { type: 'string' }, right: { type: 'string' }, wrong: { type: 'array', items: { type: 'string' } } } } },
    },
  };
  function toStory(o, level, topic) {
    if (!o || !Array.isArray(o.lines) || !o.lines.length) throw new Error('Truyện bị thiếu nội dung');
    const icon = SJ.hasIcon(o.icon) ? o.icon : 'book';
    return {
      id: 'ai-' + Date.now().toString(36), ai: true, level, topic, icon,
      title: String(o.title || 'おはなし'), vi: String(o.vi || 'Truyện của Mochi'), desc: String(o.desc || ''),
      lines: o.lines.filter(l => l && l.jp).map(l => ({ jp: String(l.jp), r: String(l.r || ''), vi: String(l.vi || '') })),
      words: (o.words || []).filter(w => w && w.jp).slice(0, 10).map(w => [String(w.jp), String(w.r || ''), String(w.vi || '')]),
      quiz: (o.quiz || []).filter(q => q && q.q && q.right).slice(0, 4).map(q => ({ q: String(q.q), o: [String(q.right)].concat((q.wrong || []).map(String).filter(x => x && x !== q.right)).slice(0, 3) })).filter(q => q.o.length >= 2),
    };
  }
  function mountStories() {
    SJ.STORIES = (SJ.STORIES || []).filter(s => !s.ai).concat(A.stories);
  }
  function storySection() {
    const list = A.stories.slice().reverse();
    return `<div class="ai-story-box">
        <div class="asb-art">${U().mascot('happy', 86, 'bob', { acc: 'acc_grad' })}<span class="asb-pen">${I('ai_story', 46)}</span></div>
        <div class="grow"><b>Mochi viết truyện riêng cho bạn</b><small>Chọn trình độ và chủ đề, Sensei Mochi (AI) sẽ viết một truyện mới tinh, kèm từ vựng và câu hỏi kiểm tra.</small></div>
        <button class="btn" data-ai-gen>${G('sparkle', 20)} Viết truyện mới</button>
      </div>
      ${list.length ? `<div class="section-label">${I('ai_story', 30)} Truyện Mochi đã viết cho bạn</div><div class="story-list">${list.map(s => `<div class="asc-wrap"><a class="card hov story-card ai" href="#/story/${s.id}"><span class="sc-ico">${I(s.icon, 44)}</span><div class="grow"><b class="jp">${U().ruby(s.title)}</b><small>${esc(s.vi)} · ${s.lines.length} câu · Cấp ${s.level}</small></div>${SJ.store.get().reads[s.id] ? `<span class="sc-done">${I('check', 26)}</span>` : ''}</a><button class="asc-del" data-ai-del="${s.id}" title="Xoá truyện" aria-label="Xoá truyện">${G('trash', 18)}</button></div>`).join('')}</div>` : ''}`;
  }
  function storyGen() {
    let level = Math.min(3, Math.max(1, (A.lastLevel || 1))), topic = TOPICS[0][1];
    const m = U().modal(`<div class="ai-gen" data-gen>
      <div class="ag-head">${U().mascot('happy', 72, 'bob', { acc: 'acc_grad' })}<div><h3>Mochi viết truyện mới</h3><p class="muted">Truyện ngắn có giọng đọc, từ vựng và câu hỏi, giống hệt truyện trong sách.</p></div></div>
      <div class="ai-lbl">Trình độ</div>
      <div class="ag-levels">${LEVELS.map(l => `<button class="ag-lv ${l[0] === level ? 'on' : ''}" data-lv="${l[0]}"><b>Cấp ${l[0]}</b><span>${l[1]}</span><small>${l[2]}</small></button>`).join('')}</div>
      <div class="ai-lbl">Chủ đề</div>
      <div class="ag-topics">${TOPICS.map((t, i) => `<button class="ag-tp ${i === 0 ? 'on' : ''}" data-tp="${esc(t[1])}">${I(t[0], 34)}<span>${t[1]}</span></button>`).join('')}</div>
      <input class="input ag-own" data-own maxlength="80" placeholder="Hoặc tự nghĩ chủ đề: ví dụ “Mochi đi tắm biển”">
      <div class="ai-formmsg" data-msg></div>
      <button class="btn btn-lg btn-block" data-go>${G('sparkle', 22)} Viết truyện cho mình!</button>
    </div>`, { cls: 'ai-modal', onClose: () => ac && ac.abort() });
    let ac = null;
    const el = m.el;
    el.addEventListener('click', e => {
      const lv = e.target.closest('[data-lv]'); if (lv) { level = +lv.dataset.lv; el.querySelectorAll('.ag-lv').forEach(b => b.classList.toggle('on', b === lv)); SJ.audio.sfx('tap'); }
      const tp = e.target.closest('[data-tp]'); if (tp) { topic = tp.dataset.tp; el.querySelector('[data-own]').value = ''; el.querySelectorAll('.ag-tp').forEach(b => b.classList.toggle('on', b === tp)); SJ.audio.sfx('tap'); }
      if (e.target.closest('[data-go]')) go();
    });
    el.querySelector('[data-own]').oninput = e => { if (e.target.value.trim()) el.querySelectorAll('.ag-tp').forEach(b => b.classList.remove('on')); };
    async function go() {
      if (!hasKey()) { el.querySelector('[data-msg]').className = 'ai-formmsg bad'; el.querySelector('[data-msg]').innerHTML = `Mochi cần khoá API để viết truyện. <a href="#/sensei">Cài đặt ở trang Sensei Mochi</a>`; return; }
      const own = el.querySelector('[data-own]').value.trim();
      const tp = own || topic;
      A.lastLevel = level; save();
      const tips = ['Mochi đang nghĩ cốt truyện…', 'Đang chọn từ thật dễ hiểu…', 'Đang thêm cách đọc cho từng câu…', 'Đang dịch sang tiếng Việt…', 'Đang soạn câu hỏi kiểm tra…', 'Sắp xong rồi nè…'];
      const g = el.querySelector('[data-gen]');
      g.innerHTML = `<div class="ag-writing"><div class="agw-art">${U().mascot('normal', 130, 'think', { acc: 'acc_grad' })}<span class="agw-paper">${I('ai_story', 64)}</span></div><h3>Mochi đang viết truyện “${esc(tp)}”</h3><p class="muted" data-tip>${tips[0]}</p>${U().bar(4, 'agw-bar')}<button class="btn btn-white btn-sm" data-cancel>Huỷ</button></div>`;
      let ti = 0; const tipT = setInterval(() => { const t = g.querySelector('[data-tip]'); if (t) t.textContent = tips[Math.min(++ti, tips.length - 1)]; }, 2600);
      g.querySelector('[data-cancel]').onclick = () => m.close();
      ac = new AbortController();
      const goal = level === 1 ? 1700 : 2300;
      const rule = level === 1 ? 'Write ONLY in hiragana: no katakana, no kanji.' : level === 2 ? 'Use hiragana plus katakana for loanwords; no kanji.' : 'Use hiragana and katakana plus a few very basic JLPT N5 kanji; write every kanji word with furigana markup {漢字|かな}.';
      try {
        const { text } = await run({
          system: BASE() + '\n\nTask: write one original short reading story for this learner as JSON.',
          messages: [{ role: 'user', content: `Write a new short story for level ${level}. Topic: ${tp}.
Rules:
- ${rule}
- 6 to 9 lines; one simple sentence per line; put a space between phrases like a children's picture book (e.g. "わたしは もちです。").
- "title" in Japanese following the same script rule; "vi" is the Vietnamese title; "desc" one Vietnamese sentence describing the story.
- Each line: "jp" (Japanese), "r" (romaji, lower case), "vi" (natural Vietnamese).
- "words": 5 to 8 key words from the story: jp, r, vi.
- "quiz": 3 questions in Vietnamese about the story content, each with "right" (the correct answer in Vietnamese) and "wrong" (2 plausible wrong answers).
- Warm, cute, everyday situations; Mochi the white cat may appear.
- Pick "icon" that best matches the story.` }],
          effort: 'medium', signal: ac.signal,
          format: { type: 'json_schema', schema: STORY_SCHEMA },
          onText: t => { const b = g.querySelector('.agw-bar i'); if (b) b.style.width = Math.min(96, 4 + t.length / goal * 92) + '%'; },
        });
        clearInterval(tipT);
        const st = toStory(JSON.parse(text), level, tp);
        A.stories.push(st); if (A.stories.length > 30) A.stories.shift();
        save(); mountStories(); giveXP();
        const b = g.querySelector('.agw-bar i'); if (b) b.style.width = '100%';
        SJ.audio.sfx('win'); U().confetti(60);
        setTimeout(() => { m.close(); location.hash = '#/story/' + st.id; U().toast(`${I('ai_story', 30)} Mochi viết xong truyện mới rồi nè!`); }, 500);
      } catch (e) {
        clearInterval(tipT);
        const t = e instanceof SyntaxError ? 'Mochi viết bị rối mất rồi. Thử lại lần nữa nha.' : errText(e);
        if (!t) return;
        g.innerHTML = `<div class="ag-writing">${U().mascot('sad', 110)}<h3>Ối, chưa viết được</h3><p class="muted">${esc(t)}</p><button class="btn" data-again>${G('refresh', 20)} Thử lại</button></div>`;
        g.querySelector('[data-again]').onclick = () => { m.close(); storyGen(); };
      }
    }
  }
  async function delStory(id) {
    const s = A.stories.find(x => x.id === id); if (!s) return;
    if (!(await U().confirm(`Xoá truyện “${U().baseText(s.title)}”?`, 'Xoá', 'Giữ lại'))) return;
    A.stories = A.stories.filter(x => x.id !== id); save(); mountStories();
    const box = document.querySelector('.ai-story-box');
    if (box && box.parentNode) { const wrap = document.createElement('div'); wrap.innerHTML = storySection(); const next = box.nextElementSibling; if (next && next.classList.contains('section-label') && next.nextElementSibling && next.nextElementSibling.querySelector('[data-ai-del]')) { next.nextElementSibling.remove(); next.remove(); } box.replaceWith(...wrap.childNodes); }
    U().toast(`${I('trash', 26)} Đã xoá truyện`);
  }
  document.addEventListener('click', e => {
    if (e.target.closest('[data-ai-gen]')) { e.preventDefault(); storyGen(); }
    const d = e.target.closest('[data-ai-del]'); if (d) { e.preventDefault(); e.stopPropagation(); delStory(d.dataset.aiDel); }
    if (e.target.closest('[data-ai-settings]')) { e.preventDefault(); settings(); }
  });

  mountStories();
  SJ.ai = { page, explain, storyGen, storySection, settings, hasKey, md, modelName, MODELS, SCENES };
})(window.SJ);

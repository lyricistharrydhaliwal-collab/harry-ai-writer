// widget.js — Harry Dhaliwal Shamashpuria — Site Concierge / AI Assistant
// Hosted externally on Vercel so the embed code pasted into Webador stays
// tiny (avoids Webador's Custom HTML box truncating large inline code).
// Update this file any time to change the widget — Webador never needs to
// be touched again unless the tiny loader snippet itself changes.

(function(){
  if(window.__harryConciergeLoaded) return;
  window.__harryConciergeLoaded = true;

  var STYLE_CSS = `
  #hcRoot, #hcRoot *{box-sizing:border-box;}
  #hcRoot{
    font-family:'Space Grotesk',sans-serif;
    position:fixed;left:24px;bottom:28px;z-index:99998;
  }

  /* ---- Launcher bubble ---- */
  #hcBubble{
    width:60px;height:60px;border-radius:50%;
    background:#E07800;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 20px rgba(224,120,0,0.45);
    cursor:pointer;border:none;position:relative;
    transition:transform 0.2s, box-shadow 0.2s;
  }
  #hcBubble:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(224,120,0,0.6);}
  #hcBubble svg{width:26px;height:26px;}
  #hcBubble .hcInitial{
    font-family:'Playfair Display',serif;font-weight:900;
    color:#fff;font-size:24px;line-height:1;
  }
  #hcPing{
    position:absolute;top:-3px;right:-3px;
    width:14px;height:14px;border-radius:50%;
    background:#25D366;border:2px solid #fff;
    animation:hcPulse 1.8s infinite;
  }
  @keyframes hcPulse{
    0%{box-shadow:0 0 0 0 rgba(37,211,102,0.55);}
    70%{box-shadow:0 0 0 8px rgba(37,211,102,0);}
    100%{box-shadow:0 0 0 0 rgba(37,211,102,0);}
  }

  /* ---- Teaser bubble ---- */
  #hcTeaser{
    position:absolute;bottom:74px;left:0;
    background:#fff;border:1.5px solid rgba(0,0,0,0.08);
    border-radius:16px 16px 16px 4px;
    padding:0.85rem 1.1rem;max-width:230px;
    box-shadow:0 10px 30px rgba(0,0,0,0.14);
    font-size:0.9rem;color:#0D0D0D;line-height:1.5;
    display:none;animation:hcFadeUp 0.35s ease;
  }
  #hcTeaser button{
    position:absolute;top:4px;right:6px;border:none;background:none;
    color:#999;font-size:13px;cursor:pointer;line-height:1;
  }
  @keyframes hcFadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}

  /* ---- Panel ---- */
  #hcPanel{
    display:none;position:absolute;bottom:76px;left:0;
    width:360px;max-width:calc(100vw - 32px);
    height:520px;max-height:70vh;
    background:#FFFFFF;border-radius:20px;
    box-shadow:0 20px 60px rgba(0,0,0,0.25);
    overflow:hidden;flex-direction:column;
    border:1px solid rgba(0,0,0,0.06);
  }
  #hcPanel.hcOpen{display:flex;animation:hcFadeUp 0.25s ease;}

  #hcHead{
    background:linear-gradient(135deg,#E07800,#C86A00);
    padding:1rem 1.1rem;display:flex;align-items:center;gap:0.75rem;
    flex-shrink:0;
  }
  #hcAvatar{
    width:38px;height:38px;border-radius:50%;
    background:rgba(255,255,255,0.2);
    display:flex;align-items:center;justify-content:center;
    font-family:'Playfair Display',serif;font-weight:900;color:#fff;
    font-size:17px;flex-shrink:0;border:1.5px solid rgba(255,255,255,0.5);
  }
  #hcHeadText{flex:1;min-width:0;}
  #hcHeadTitle{color:#fff;font-weight:700;font-size:0.95rem;}
  #hcHeadSub{color:rgba(255,255,255,0.85);font-size:0.72rem;display:flex;align-items:center;gap:5px;margin-top:1px;}
  #hcHeadSub .hcDot{width:6px;height:6px;border-radius:50%;background:#4ADE80;display:inline-block;}
  #hcCloseBtn{
    background:rgba(255,255,255,0.18);border:none;color:#fff;
    width:28px;height:28px;border-radius:50%;cursor:pointer;
    font-size:15px;line-height:1;flex-shrink:0;
  }
  #hcCloseBtn:hover{background:rgba(255,255,255,0.3);}

  #hcMsgs{
    flex:1;overflow-y:auto;padding:1.1rem;
    display:flex;flex-direction:column;gap:0.7rem;
    background:#F7F3EE;
  }
  .hcMsg{max-width:82%;padding:0.65rem 0.9rem;border-radius:14px;
    font-size:0.87rem;line-height:1.7;word-wrap:break-word;}
  .hcMsg a{color:inherit;text-decoration:underline;font-weight:700;}
  .hcBot{
    background:#fff;color:#0D0D0D;border:1px solid rgba(0,0,0,0.06);
    align-self:flex-start;border-bottom-left-radius:4px;
  }
  .hcUser{
    background:#E07800;color:#fff;
    align-self:flex-end;border-bottom-right-radius:4px;
  }
  .hcTyping{display:flex;gap:4px;padding:0.75rem 0.9rem;}
  .hcTyping span{width:6px;height:6px;border-radius:50%;background:#C9C2B6;animation:hcBounce 1.2s infinite;}
  .hcTyping span:nth-child(2){animation-delay:0.15s;}
  .hcTyping span:nth-child(3){animation-delay:0.3s;}
  @keyframes hcBounce{0%,60%,100%{transform:translateY(0);opacity:0.5;}30%{transform:translateY(-4px);opacity:1;}}

  #hcChips, #hcChipsMore{
    display:flex;gap:0.5rem;padding:0 1.1rem 0.6rem;flex-wrap:wrap;
    background:#F7F3EE;flex-shrink:0;
  }
  #hcChipsMore{padding-top:0;}
  .hcChip{
    background:#fff;border:1.5px solid rgba(224,120,0,0.35);color:#E07800;
    font-size:0.76rem;font-weight:700;padding:0.4rem 0.75rem;
    border-radius:100px;cursor:pointer;font-family:'Space Grotesk',sans-serif;
    transition:all 0.15s;white-space:nowrap;
  }
  .hcChip:hover{background:rgba(224,120,0,0.1);}
  .hcChipShuffle{
    background:#F7F3EE;border:1.5px dashed rgba(0,0,0,0.2);color:#3A3A3A;
  }

  #hcInputRow{
    display:flex;gap:0.6rem;padding:0.85rem;border-top:1px solid rgba(0,0,0,0.07);
    background:#fff;flex-shrink:0;
  }
  #hcInput{
    flex:1;border:1.5px solid #E0D8CF;border-radius:100px;
    padding:0.65rem 1rem;font-size:0.87rem;outline:none;
    font-family:'Space Grotesk',sans-serif;color:#0D0D0D;min-width:0;
  }
  #hcInput:focus{border-color:#E07800;}
  #hcSend{
    background:#E07800;border:none;border-radius:50%;
    width:38px;height:38px;flex-shrink:0;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:background 0.15s;
  }
  #hcSend:hover{background:#C86A00;}
  #hcSend:disabled{background:#E8CBAA;cursor:default;}
  #hcSend svg{width:16px;height:16px;}

  @media(max-width:480px){
    #hcRoot{left:16px;bottom:20px;}
    #hcPanel{width:calc(100vw - 32px);height:65vh;bottom:74px;}
  }
`;
  var WIDGET_HTML = `<div id="hcRoot">
  <div id="hcTeaser">
    <button id="hcTeaserClose">✕</button>
    <span id="hcTeaserText">Sat Sri Akal! 👋 &#2581;&#2635;&#2568; &#2616;&#2613;&#2622;&#2610; &#2617;&#2632; Harry &#2598;&#2631; &#2581;&#2672;&#2606; &#2604;&#2622;&#2608;&#2631;?</span>
  </div>

  <div id="hcPanel">
    <div id="hcHead">
      <div id="hcAvatar">&#2617;</div>
      <div id="hcHeadText">
        <div id="hcHeadTitle">Harry's AI Assistant</div>
        <div id="hcHeadSub"><span class="hcDot"></span>&#2566;&#2606; &#2596;&#2636;&#2608; '&#2596;&#2631; &#2596;&#2625;&#2608;&#2672;&#2596; &#2588;&#2613;&#2622;&#2604;</div>
      </div>
      <button id="hcCloseBtn">✕</button>
    </div>
    <div id="hcMsgs"></div>
    <div id="hcChips">
      <button class="hcChip" data-question="Services te pricing dasso">🎵 Services</button>
      <button class="hcChip" data-question="Likhari AI writer kithe hai?">✍️ Free AI Writer</button>
      <button class="hcChip" data-question="Shayri padhni hai">📖 Shayri Padho</button>
      <button class="hcChip" id="hcMoreToggle">➕ More</button>
    </div>
    <div id="hcChipsMore" style="display:none;"></div>
    <div id="hcInputRow">
      <input id="hcInput" type="text" placeholder="Apna sawal likho..." maxlength="500" />
      <button id="hcSend">
        <svg viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
      </button>
    </div>
  </div>

  <button id="hcBubble">
    <span id="hcPing"></span>
    <span class="hcInitial">&#2617;</span>
  </button>
</div>`;

  var styleEl = document.createElement('style');
  styleEl.textContent = STYLE_CSS;
  document.head.appendChild(styleEl);

  var container = document.createElement('div');
  container.innerHTML = WIDGET_HTML;
  document.body.appendChild(container);

if(window.__harryConciergeLoaded) return;
  window.__harryConciergeLoaded = true;

  var API_URL = `https://project-mcevs.vercel.app/api/concierge`;
  var STORE_KEY = `harryConciergeChat`;
  var OPEN_KEY = `harryConciergeOpen`;

  // Evergreen question pool — the backend answers "what`s new" questions by
  // reading Harry`s live pages itself, so no data file needs to be kept here
  var QUESTION_POOL = [
    {emoji:`🎧`, label:`Latest Music`, question:`Harry da latest music kithe sun sakde han?`},
    {emoji:`🤝`, label:`Collab Karo`, question:`Harry nal collab karna chaunde ho, kiven kariye?`},
    {emoji:`📰`, label:`New Blog`, question:`Naveen blog kehda aaya hai?`},
    {emoji:`📖`, label:`New Shayri`, question:`Naveen shayri kehdi aayi hai?`},
    {emoji:`🎬`, label:`New Video`, question:`Naveen video kehdi aayi hai?`},
    {emoji:`💬`, label:`Contact Harry`, question:`Harry naal gal karni hai`},
    {emoji:`🛍️`, label:`Shopping/Send Money`, question:`Punjab paise bhejan ya shopping affiliate links dasso`}
  ];
  var CHIPS_SHOWN = 4;

  var msgsEl = document.getElementById(`hcMsgs`);
  var panel = document.getElementById(`hcPanel`);
  var teaser = document.getElementById(`hcTeaser`);
  var input = document.getElementById(`hcInput`);
  var sendBtn = document.getElementById(`hcSend`);

  var GREETING = `Sat Sri Akal! 🙏 Main Harry da AI Assistant haan. Services, shayri, blogs, ya Likhari AI writer bare puchh sakde ho — ya niche ditte buttons vrto!`;

  function getHistory(){
    try{ return JSON.parse(sessionStorage.getItem(STORE_KEY) || `[]`); }
    catch(e){ return []; }
  }
  function saveHistory(h){
    try{ sessionStorage.setItem(STORE_KEY, JSON.stringify(h.slice(-20))); }catch(e){}
  }

  function linkify(text){
    var escaped = text.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);
    // **bold** -> <strong>
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, `<strong>$1</strong>`);
    // urls -> links
    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, function(url){
      var clean = url.replace(/[.,)]+$/, ``);
      return `<a href="`+clean+`" target="_blank" rel="noopener">`+clean+`</a>`;
    });
    // line breaks
    escaped = escaped.replace(/\n/g, `<br>`);
    return escaped;
  }

  function addBubble(role, text){
    var div = document.createElement(`div`);
    div.className = `hcMsg ` + (role === `user` ? `hcUser` : `hcBot`);
    div.innerHTML = linkify(text);
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  function renderAll(){
    msgsEl.innerHTML = ``;
    var h = getHistory();
    if(h.length === 0){
      addBubble(`assistant`, GREETING);
    } else {
      h.forEach(function(m){ addBubble(m.role, m.content); });
    }
  }

  function showTyping(){
    var div = document.createElement(`div`);
    div.className = `hcMsg hcBot hcTyping`;
    div.id = `hcTypingIndicator`;
    div.innerHTML = `<span></span><span></span><span></span>`;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  function hideTyping(){
    var el = document.getElementById(`hcTypingIndicator`);
    if(el) el.remove();
  }

  function hcToggle(force){
    var willOpen = typeof force === `boolean` ? force : !panel.classList.contains(`hcOpen`);
    panel.classList.toggle(`hcOpen`, willOpen);
    teaser.style.display = `none`;
    if(willOpen){
      try{ sessionStorage.setItem(OPEN_KEY, `1`); }catch(e){}
      renderAll();
      setTimeout(function(){ input.focus(); }, 200);
    } else {
      try{ sessionStorage.removeItem(OPEN_KEY); }catch(e){}
    }
  }
  window.hcToggle = hcToggle;

  function hcQuick(text){
    input.value = text;
    hcSend();
  }

  function shuffle(arr){
    var a = arr.slice();
    for(var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function renderMoreChips(){
    var container = document.getElementById(`hcChipsMore`);
    var picks = shuffle(QUESTION_POOL).slice(0, CHIPS_SHOWN);
    var html = picks.map(function(q){
      return `<button class="hcChip" data-question="`+q.question.replace(/"/g,`&quot;`)+`">`+q.emoji+` `+q.label+`</button>`;
    }).join(``);
    html += `<button class="hcChip hcChipShuffle" data-action="shuffle">🔀 Shuffle</button>`;
    container.innerHTML = html;
  }

  function hcToggleMore(){
    var more = document.getElementById(`hcChipsMore`);
    var toggle = document.getElementById(`hcMoreToggle`);
    var isOpen = more.style.display === `flex`;
    if(isOpen){
      more.style.display = `none`;
      toggle.textContent = `➕ More`;
    } else {
      renderMoreChips();
      more.style.display = `flex`;
      toggle.textContent = `➖ Less`;
    }
  }

  function hcSend(){
    var text = input.value.trim();
    if(!text) return;
    input.value = ``;
    input.disabled = true;
    sendBtn.disabled = true;

    var h = getHistory();
    if(h.length === 0){ h.push({role:`assistant`, content: GREETING}); }
    h.push({role:`user`, content:text});
    saveHistory(h);
    addBubble(`user`, text);
    showTyping();

    fetch(API_URL, {
      method:`POST`,
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ messages: h })
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      hideTyping();
      var reply = data && data.reply ? data.reply : `Sorry, thodi der baad try karo, ya WhatsApp te sidha message karo: https://api.whatsapp.com/send?phone=12049628325`;
      var h2 = getHistory();
      h2.push({role:`assistant`, content:reply});
      saveHistory(h2);
      addBubble(`assistant`, reply);
    })
    .catch(function(){
      hideTyping();
      addBubble(`assistant`, `Connection &#2613;&#2623;&#2673;&#2586; &#2598;&#2623;&#2673;&#2581;&#2596; &#2566; &#2608;&#2617;&#2624; &#2617;&#2632;। &#2616;&#2623;&#2673;&#2599;&#2622; WhatsApp &#2596;&#2631; &#2610;&#2623;&#2582;&#2635;: https://api.whatsapp.com/send?phone=12049628325`);
    })
    .finally(function(){
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    });
  }

  // ---- Event bindings (no inline onclick attributes — some site builders
  // strip those; addEventListener is reliable everywhere) ----
  document.getElementById(`hcBubble`).addEventListener(`click`, function(){ hcToggle(); });
  document.getElementById(`hcCloseBtn`).addEventListener(`click`, function(){ hcToggle(false); });
  document.getElementById(`hcTeaserClose`).addEventListener(`click`, function(){ teaser.style.display = `none`; });
  document.getElementById(`hcMoreToggle`).addEventListener(`click`, hcToggleMore);
  sendBtn.addEventListener(`click`, hcSend);

  input.addEventListener(`keydown`, function(e){
    if(e.key === `Enter`) hcSend();
  });

  // Event delegation for the fixed row of quick-reply chips
  document.getElementById(`hcChips`).addEventListener(`click`, function(e){
    var btn = e.target.closest(`[data-question]`);
    if(btn) hcQuick(btn.getAttribute(`data-question`));
  });

  // Event delegation for the dynamic "More" row (chips + shuffle button)
  document.getElementById(`hcChipsMore`).addEventListener(`click`, function(e){
    var btn = e.target.closest(`button`);
    if(!btn) return;
    if(btn.dataset.action === `shuffle`){ renderMoreChips(); return; }
    if(btn.dataset.question) hcQuick(btn.getAttribute(`data-question`));
  });

  // Reopen automatically if it was open when the visitor navigated pages
  try{
    if(sessionStorage.getItem(OPEN_KEY) === `1`){
      hcToggle(true);
    }
  }catch(e){}

  // First-time teaser bubble (once per browser session)
  try{
    if(!sessionStorage.getItem(`harryConciergeTeaserShown`) && !panel.classList.contains(`hcOpen`)){
      setTimeout(function(){
        if(!panel.classList.contains(`hcOpen`)){
          teaser.style.display = `block`;
          sessionStorage.setItem(`harryConciergeTeaserShown`, `1`);
        }
      }, 7000);
    }
  }catch(e){}
})();

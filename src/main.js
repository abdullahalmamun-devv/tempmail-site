// ===== Config =====
const API = '/api/v1';

// ===== State =====
const S = {
  email: '', domain: 'catchmail.io', msgs: [], selId: null,
  customDomains: [], timer: null, countdown: null, readIds: new Set(),
};

// ===== Helpers =====
const $ = s => document.querySelector(s);
const rand = (n=10) => Array.from({length:n}, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.random()*36|0]).join('');
const esc = s => { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; };

function fmtDate(d) {
  const dt=new Date(d), now=new Date(), df=now-dt;
  if(df<60000) return 'Just now';
  if(df<3600000) return `${df/60000|0}m ago`;
  if(df<86400000) return `${df/3600000|0}h ago`;
  return dt.toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
}
function fmtSize(b) {
  if(b<1024) return b+' B';
  if(b<1048576) return (b/1024).toFixed(1)+' KB';
  return (b/1048576).toFixed(1)+' MB';
}

function toast(msg, ok=true) {
  const el=document.createElement('div');
  el.className=`toast ${ok?'ok':'err'}`;
  el.textContent=msg;
  $('#toasts').appendChild(el);
  setTimeout(()=>el.remove(), 3000);
}

// ===== Storage =====
function load() {
  try {
    const s=JSON.parse(localStorage.getItem('tm')||'{}');
    S.email=s.email||''; S.domain=s.domain||'catchmail.io'; S.customDomains=s.customDomains||[];
    S.readIds=new Set(s.readIds||[]);
  } catch(e){}
}
function save() {
  localStorage.setItem('tm', JSON.stringify({email:S.email, domain:S.domain, customDomains:S.customDomains, readIds:[...S.readIds]}));
}
function markAsRead(id) {
  if(S.readIds.has(id)) return;
  S.readIds.add(id); save();
  const el=document.querySelector(`.msg[data-id="${id}"]`);
  if(el) el.classList.remove('unread');
}

// ===== Domains =====
function renderDomains() {
  const all=['catchmail.io','dropifygraphics.xyz','immirev.com','ssportslive.xyz','urbanchic.online',...S.customDomains];
  
  const container = $('#domain-items');
  container.innerHTML = '';
  
  all.forEach(d => {
    const div = document.createElement('div');
    div.textContent = d;
    div.addEventListener('click', () => {
      S.domain = d;
      $('#domain-selected').textContent = d;
      $('#domain-items').classList.add('hide');
      save();
    });
    container.appendChild(div);
  });
  
  $('#domain-selected').textContent = S.domain;
}

// ===== Tabs =====
function switchTab(t) {
  const isGen = t==='gen';
  $('#tab-gen').classList.toggle('active', isGen);
  $('#tab-acc').classList.toggle('active', !isGen);
  $('#panel-gen').classList.toggle('active', isGen);
  $('#panel-acc').classList.toggle('active', !isGen);
}

// ===== Email Actions =====
function activate(email) {
  S.email=email; S.msgs=[]; S.selId=null;
  $('#bar-addr').textContent=email;
  $('#bar').classList.remove('hide');
  $('#inbox').classList.remove('hide');
  showList();
  save();
  startPoll();
  fetchMsgs();
}

function generate() {
  const u = $('#username').value.trim().toLowerCase().replace(/[^a-z0-9._-]/g,'') || rand(10);
  activate(`${u}@${S.domain}`);
  toast('Email created!');
}

function access() {
  const e = $('#access-email').value.trim().toLowerCase();
  if(!e||!e.includes('@')||!e.includes('.')) { toast('Enter a valid email','err'); return; }
  activate(e);
  toast(`Opened: ${e}`);
}

// ===== API =====
async function fetchMsgs() {
  if(!S.email) return;
  try {
    const r=await fetch(`${API}/mailbox?address=${encodeURIComponent(S.email)}`);
    if(!r.ok) { if(r.status===429) return; throw new Error(r.status); }
    const d=await r.json();
    const oldIds=new Set(S.msgs.map(m=>m.id));
    const msgs=d.messages||[];
    const fresh=msgs.filter(m=>!oldIds.has(m.id));
    if(fresh.length) toast(`${fresh.length} new email${fresh.length>1?'s':''}!`);
    S.msgs=msgs;
    const unread=msgs.filter(m=>!S.readIds.has(m.id)).length;
    $('#count').textContent=unread||msgs.length;
    $('#count').title=`${msgs.length} total, ${unread} unread`;
    if(!S.selId) renderList(fresh.map(m=>m.id));
  } catch(e) { console.error(e); }
}

async function fetchDetail(id) {
  try {
    const r=await fetch(`${API}/message/${id}?mailbox=${encodeURIComponent(S.email)}`);
    if(!r.ok) throw new Error(r.status);
    return await r.json();
  } catch(e) { toast('Failed to load','err'); return null; }
}

async function delMsg(id) {
  try {
    const r=await fetch(`${API}/message/${id}?mailbox=${encodeURIComponent(S.email)}`,{method:'DELETE'});
    if(r.ok||r.status===204) {
      S.msgs=S.msgs.filter(m=>m.id!==id);
      S.selId=null;
      $('#count').textContent=S.msgs.length;
      showList();
      renderList();
      toast('Deleted');
    }
  } catch(e) { toast('Delete failed','err'); }
}

// ===== Polling =====
function startPoll() {
  stopPoll();
  let sec=5;
  function tick() {
    sec--;
    const btn=$('#btn-refresh');
    if(btn && !btn.classList.contains('spinning')) btn.title=`Auto refresh in ${sec}s`;
    if(sec<=0) { sec=5; fetchMsgs(); }
  }
  S.timer=setInterval(tick,1000);
}
function stopPoll() { if(S.timer){clearInterval(S.timer);S.timer=null;} }

// ===== View Toggle (single card) =====
function showList() {
  $('#view-list').classList.remove('hide');
  $('#view-detail').classList.add('hide');
}

function showDetail() {
  $('#view-list').classList.add('hide');
  $('#view-detail').classList.remove('hide');
}

// ===== Render Messages =====
function renderList(newIds=[]) {
  const el=$('#view-list');
  // Sort newest first
  const sorted=[...S.msgs].sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(!sorted.length) {
    el.innerHTML=`<div class="empty"><div class="empty-stamp">📭</div><p class="empty-t">No mail yet</p><p class="empty-s">Emails will appear here automatically</p></div>`;
    return;
  }
  el.innerHTML=sorted.map(m=>{
    const isUnread=!S.readIds.has(m.id);
    return `
    <div class="msg ${newIds.includes(m.id)?'new':''} ${isUnread?'unread':''}" data-id="${m.id}">
      <div class="msg-from">${isUnread?'<span class="unread-dot"></span>':''} ${esc(m.from||'Unknown')}</div>
      <div class="msg-subj">${esc(m.subject||'(No subject)')}</div>
      <div class="msg-info"><span>${fmtDate(m.date)}</span><span>${m.size?fmtSize(m.size):''}</span></div>
    </div>`;
  }).join('');
  el.querySelectorAll('.msg').forEach(m=>m.addEventListener('click',()=>openMsg(m.dataset.id)));
}

// ===== Open Message =====
async function openMsg(id) {
  S.selId=id;
  markAsRead(id);
  const dc=$('#detail-content');
  dc.innerHTML=`
    <div class="skel" style="height:22px;width:65%;margin-bottom:14px"></div>
    <div class="skel" style="height:14px;width:40%;margin-bottom:6px"></div>
    <div class="skel" style="height:14px;width:35%;margin-bottom:18px"></div>
    <div class="skel" style="height:14px;width:100%;margin-bottom:8px"></div>
    <div class="skel" style="height:14px;width:80%"></div>`;
  showDetail();

  const msg=await fetchDetail(id);
  if(!msg) return;

  let body='';
  if(msg.body?.html) body=`<iframe id="mail-frame" sandbox="allow-same-origin" title="Email"></iframe>`;
  else if(msg.body?.text) body=`<pre style="white-space:pre-wrap;font-family:inherit;color:var(--text)">${esc(msg.body.text)}</pre>`;
  else body=`<p style="color:var(--text-3)">No content</p>`;

  let att='';
  if(msg.attachments?.length) {
    att=`<div class="d-attach"><h4>📎 Attachments (${msg.attachments.length})</h4>${msg.attachments.map(a=>
      `<a href="${API}${a.download_url}" target="_blank" class="d-att" rel="noopener">📄 ${esc(a.filename)} (${fmtSize(a.size)})</a>`).join('')}</div>`;
  }

  dc.innerHTML=`
    <div class="d-subject">${esc(msg.subject||'(No subject)')}</div>
    <div class="d-meta">
      <div class="d-row"><span class="d-lbl">From</span><span class="d-val">${esc(msg.from||'Unknown')}</span></div>
      <div class="d-row"><span class="d-lbl">To</span><span class="d-val">${esc(Array.isArray(msg.to)?msg.to.join(', '):(msg.to||S.email))}</span></div>
      <div class="d-row"><span class="d-lbl">Date</span><span class="d-val">${msg.date?fmtDate(msg.date):'—'}</span></div>
    </div>
    <div class="d-body">${body}</div>${att}`;

  if(msg.body?.html) {
    const f=$('#mail-frame');
    if(f){f.src='about:blank';f.addEventListener('load',()=>{try{const d=f.contentDocument;d.open();d.write(`<html><head><style>body{font-family:'Inter',sans-serif;margin:14px;color:#2C2416;line-height:1.6;font-size:14px}img{max-width:100%;height:auto}a{color:#8B4513}</style></head><body>${msg.body.html}</body></html>`);d.close();setTimeout(()=>{f.style.height=(d.body.scrollHeight+24)+'px'},200)}catch(e){}});}
  }
}

// ===== Clipboard =====
async function copy() {
  try { await navigator.clipboard.writeText(S.email); } catch {
    const t=document.createElement('textarea');t.value=S.email;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();
  }
  $('#btn-copy').classList.add('copied');
  toast('Copied!');
  setTimeout(()=>$('#btn-copy').classList.remove('copied'),1500);
}

// ===== Manual Refresh =====
async function refresh() {
  $('#btn-refresh').classList.add('spinning');
  await fetchMsgs();
  setTimeout(()=>$('#btn-refresh').classList.remove('spinning'),600);
}

// ===== Custom Domain =====
function addDomain(d) {
  d=d.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/+$/,'');
  if(!d||!d.includes('.')) { toast('Enter valid domain',false); return false; }
  const all=['catchmail.io','dropifygraphics.xyz','immirev.com','ssportslive.xyz','urbanchic.online',...S.customDomains];
  if(all.includes(d)) { toast('Already exists',false); return false; }
  S.customDomains.push(d); renderDomains(); save();
  toast(`"${d}" added!`);
  return true;
}

// ===== Events =====
$('#tab-gen').addEventListener('click',()=>switchTab('gen'));
$('#tab-acc').addEventListener('click',()=>switchTab('acc'));
$('#btn-gen').addEventListener('click',generate);
$('#username').addEventListener('keydown',e=>{if(e.key==='Enter')generate()});
$('#btn-acc').addEventListener('click',access);
$('#access-email').addEventListener('keydown',e=>{if(e.key==='Enter')access()});
$('#domain-selected').addEventListener('click', e => {
  e.stopPropagation();
  $('#domain-items').classList.toggle('hide');
});
document.addEventListener('click', () => $('#domain-items').classList.add('hide'));
$('#btn-copy').addEventListener('click',copy);
$('#btn-refresh').addEventListener('click',refresh);
$('#btn-back').addEventListener('click',()=>{S.selId=null;showList();renderList()});
$('#btn-del').addEventListener('click',()=>{if(S.selId)delMsg(S.selId)});
$('#btn-domain').addEventListener('click',()=>{$('#modal').classList.remove('hide');$('#modal-domain').value='';$('#modal-domain').focus()});
$('#modal-x').addEventListener('click',()=>$('#modal').classList.add('hide'));
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))$('#modal').classList.add('hide')});
$('#modal-save').addEventListener('click',()=>{if(addDomain($('#modal-domain').value))$('#modal').classList.add('hide')});
$('#modal-domain').addEventListener('keydown',e=>{if(e.key==='Enter')$('#modal-save').click()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#modal').classList.contains('hide'))$('#modal').classList.add('hide');else if(!$('#view-detail').classList.contains('hide')){S.selId=null;showList();renderList()}}});

// ===== Init =====
load();
renderDomains();
if(S.email) {
  $('#bar-addr').textContent=S.email;
  $('#bar').classList.remove('hide');
  $('#inbox').classList.remove('hide');
  startPoll();
  fetchMsgs();
}

// 1) LANDING photos: the 6 polaroids floating around the edges of every screen
const PHOTOS = ['1.jpg','2.jpeg','3.jpg','4.jpeg','5.jpg','6.jpeg'];
// 2) LETTER photos: the 6 polaroids inside the final letter (different from the landing ones)
const LETTER_PHOTOS = ['7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpeg'];
// Missing pictures show a pink heart instead.
// 3) QUOTES shown at the bottom of each picture (same order as the photo lists above). Edit them freely.
const QUOTES = ['Your smile makes the world brighter','Some people are just special','Stay as lovely as you are','Happiness looks beautiful on you','Good friends are rare treasures','Shine on, Riya'];
const LETTER_QUOTES = ['A friend like you is a gift','Keep smiling, always','Every moment with you matters','You are one in a million','May all your dreams come true','Always stay happy'];
 
const $ = id => document.getElementById(id);
const rnd = (a,b) => a + Math.random()*(b-a);
function go(from, to){ $(from).classList.remove('active'); $(to).classList.add('active'); }
function pol(i, r, list, quotes){
  list = list || PHOTOS; quotes = quotes || QUOTES;
  return '<div class="pol" style="--r:'+r+'deg"><div class="ph">'+(list.length ? '<img src="'+list[i % list.length]+'" alt="Riya" onerror="this.parentNode.innerHTML=\'&#9829;\'">' : '&#9829;')+'</div><p class="q">'+quotes[i % quotes.length]+'</p></div>';
}
function confetti(n){
  const colors = ['#e0527f','#ffb8d0','#fff','#ff9fc0','#ffd166'];
  for(let i=0;i<n;i++){
    const c = document.createElement('div');
    c.className = 'conf';
    c.style.cssText = 'left:'+rnd(0,100)+'vw;width:9px;height:14px;background:'+colors[i%5]+';animation-duration:'+rnd(2.5,5)+'s;animation-delay:'+rnd(0,.8)+'s';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 6500);
  }
}
for(let i=0;i<16;i++){
  const h = document.createElement('span');
  h.className = 'heart'; h.textContent = '\u2665';
  h.style.cssText = 'left:'+rnd(0,100)+'%;font-size:'+rnd(14,34)+'px;animation-duration:'+rnd(9,18)+'s;animation-delay:-'+rnd(0,15)+'s';
  $('bg').appendChild(h);
}
$('gl').innerHTML = [-4,3,-3,4,-5,3].map((r,i) => pol(i,r)).join('');
$('g1').innerHTML = pol(0,-5,LETTER_PHOTOS,LETTER_QUOTES)+pol(1,3,LETTER_PHOTOS,LETTER_QUOTES)+pol(2,-3,LETTER_PHOTOS,LETTER_QUOTES);
$('g2').innerHTML = pol(3,4,LETTER_PHOTOS,LETTER_QUOTES)+pol(4,-4,LETTER_PHOTOS,LETTER_QUOTES)+pol(5,5,LETTER_PHOTOS,LETTER_QUOTES);
// bouncing title letters
$('wish').innerHTML = [...'Happy Birthday, Riya!'].map((c,i) => c===' ' ? ' ' : '<span style="animation-delay:'+(i*.07)+'s">'+c+'</span>').join('');
// sparkle hearts wherever she taps
document.addEventListener('pointerdown', e => {
  for(let i=0;i<5;i++){
    const s = document.createElement('span');
    s.className = 'spark'; s.textContent = i%2 ? '\u2665' : '\u2726';
    s.style.cssText = 'left:'+e.clientX+'px;top:'+e.clientY+'px;--x:'+rnd(-50,50)+'px;font-size:'+rnd(14,26)+'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
});
confetti(40);
// photos fly out of the landing gallery and keep floating to random spots (always inside the screen)
function floatPhotos(){
  document.querySelectorAll('.gal-land .pol').forEach(p => {
    const r = p.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'pol fl';
    f.innerHTML = p.innerHTML;
    f.style.width = r.width + 'px';
    f.style.transitionDuration = '1.2s';
    f.style.transform = 'translate('+r.left+'px,'+r.top+'px) rotate('+p.style.getPropertyValue('--r')+')';
    $('bg').appendChild(f);
    p.style.visibility = 'hidden';
    const w = Math.min(104, Math.max(74, innerWidth*0.19));
    const move = () => {
      const x = rnd(4, Math.max(5, innerWidth - w - 4));
      const y = rnd(4, Math.max(5, innerHeight - w*1.45 - 4));
      const d = rnd(4,7);
      f.style.width = w + 'px';
      f.style.transitionDuration = d+'s';
      f.style.transform = 'translate('+x+'px,'+y+'px) rotate('+rnd(-12,12)+'deg)';
      setTimeout(move, d*1000);
    };
    setTimeout(move, 60 + Math.random()*500);
  });
}
$('b1').onclick = () => { floatPhotos(); go('s1','s2'); makeBalloons(); };
 
// balloons
function makeBalloons(){
  const cols = ['#ff8fb5','#ffc2d6','#e0527f','#ffa6c9','#f7d6e0'];
  let left = 5;
  cols.forEach((c,i) => {
    const b = document.createElement('button');
    b.className = 'bal'; b.setAttribute('aria-label','Pop balloon');
    b.style.cssText = 'background:'+c+';left:'+(i*18+2)+'%;top:'+rnd(5,45)+'%;animation-delay:-'+rnd(0,3)+'s';
    b.onclick = () => {
      b.classList.add('gone'); b.disabled = true; left--;
      confetti(14); popSound();
      $('balText').textContent = left ? left+' more to pop!' : 'Yay!';
      if(!left) setTimeout(() => go('s2','s3'), 900);
    };
    $('sky').appendChild(b);
  });
}
 
// cake
const svg = $('cakeSvg').innerHTML;
$('hl').innerHTML = svg; $('hr').innerHTML = svg;
$('hl').classList.add('pop'); $('hr').classList.add('pop');
let out = 0;
document.querySelectorAll('.cd').forEach((d,i) => d.onclick = () => {
  if(d.disabled) return;
  d.disabled = true; out++; blowSound();
  document.querySelectorAll('.half').forEach(h => h.querySelectorAll('.flame')[i].classList.add('out'));
  if(out === 3){
    $('cakeText').textContent = 'Make a wish, Riya... now cut the cake!';
    $('b2').hidden = false; confetti(30);
  }
});
$('b2').onclick = () => {
  $('b2').hidden = true; swishSound();
  $('cake').classList.add('cutting');
  setTimeout(() => { $('cake').classList.add('cut'); cutDoneSound(); $('cakeText').textContent = 'Happy Birthday, Riya!'; confetti(80); }, 800);
  setTimeout(() => go('s3','s4'), 3200);
};
 
// envelope
$('env').onclick = () => {
  $('env').classList.add('open'); openSound();
  setTimeout(() => { $('msg').classList.add('show'); confetti(40); }, 1500);
};
 
// ---------- soft background music ----------
// Option A: put your own song at music/song.mp3 and it plays on loop.
// Option B: if that file is missing, a soft music-box tune is generated automatically.
const MUSIC_FILE = 'music/song.mp3';
let player = null, synth = null, musicOn = true, started = false;
function useSynth(){
  if(player || synth) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return;
  const ctx = new AC(); ctx.resume();
  const master = ctx.createGain(); master.gain.value = musicOn ? 0.5 : 0;
  const dl = ctx.createDelay(); dl.delayTime.value = .38;
  const fb = ctx.createGain(); fb.gain.value = .35;
  master.connect(ctx.destination); master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(ctx.destination);
  const note = (f, t, d, v) => {
    [[f, v], [f*2, v*.25]].forEach(([fr, vol]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = fr;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + .02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .05);
    });
  };
  const chords = [[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
  const mel = [[659.25,0,783.99,0,1046.5,0,783.99,0],[659.25,0,880,0,1046.5,0,880,0],[880,0,1046.5,0,880,0,698.46,0],[587.33,0,783.99,0,987.77,0,783.99,0]];
  const arp = [0,1,2,1,2,1,2,1];
  let step = 0, next = ctx.currentTime + .1;
  setInterval(() => {
    while(next < ctx.currentTime + .6){
      const bar = Math.floor(step/8) % 4, i = step % 8, ch = chords[bar];
      if(i === 0) note(ch[0]/2, next, 2.4, .18);
      note(ch[arp[i]]*2, next, 1.6, .07);
      if(mel[bar][i]) note(mel[bar][i], next, 1.8, .12);
      next += .45; step++;
    }
  }, 200);
  synth = {ctx, master};
}
function startMusic(){
  if(started) return; started = true;
  const a = new Audio(MUSIC_FILE); a.loop = true; a.volume = .45;
  a.addEventListener('error', useSynth);
  a.play().then(() => { player = a; }).catch(useSynth);
}
function setMusic(on){
  musicOn = on;
  $('musicBtn').classList.toggle('off', !on);
  $('mIcon').innerHTML = on ? '&#128266;' : '&#128263;';
  if(player) player.muted = !on;
  if(synth) synth.master.gain.setTargetAtTime(on ? .5 : 0, synth.ctx.currentTime, .1);
}
document.addEventListener('pointerdown', e => { if(!e.target.closest('#musicBtn')) startMusic(); });
$('musicBtn').onclick = () => { if(!started){ startMusic(); } else setMusic(!musicOn); };
 
// ---------- balloon pop sound (made by the browser, not affected by the mute button) ----------
let sfx = null;
function popSound(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return;
  sfx = sfx || new AC(); sfx.resume();
  const t = sfx.currentTime, len = Math.floor(sfx.sampleRate * .18);
  const buf = sfx.createBuffer(1, len, sfx.sampleRate), d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 3);
  const n = sfx.createBufferSource(); n.buffer = buf;
  const hp = sfx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
  const g = sfx.createGain(); g.gain.value = .7;
  n.connect(hp); hp.connect(g); g.connect(sfx.destination); n.start(t);
  const o = sfx.createOscillator(), og = sfx.createGain();
  o.frequency.setValueAtTime(700, t); o.frequency.exponentialRampToValueAtTime(90, t + .1);
  og.gain.setValueAtTime(.4, t); og.gain.exponentialRampToValueAtTime(.001, t + .12);
  o.connect(og); og.connect(sfx.destination); o.start(t); o.stop(t + .15);
}
 
// ---------- more sound effects: candles, cake cutting, envelope (not affected by the mute button) ----------
function sfxCtx(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return null;
  sfx = sfx || new AC(); sfx.resume();
  return sfx;
}
function noiseBurst(c, t, dur, type, f0, f1, vol, q){
  const len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
  const n = c.createBufferSource(); n.buffer = buf;
  const f = c.createBiquadFilter(); f.type = type; f.Q.value = q || 1;
  f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur*.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(t);
}
function chime(c, t, freq, vol){
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(0.0001, t + .9);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 1);
}
function blowSound(){ const c = sfxCtx(); if(!c) return; noiseBurst(c, c.currentTime, .5, 'bandpass', 900, 350, .6, .7); }
function swishSound(){ const c = sfxCtx(); if(!c) return; noiseBurst(c, c.currentTime, .4, 'bandpass', 3500, 900, .5, 1.2); }
function cutDoneSound(){
  const c = sfxCtx(); if(!c) return; const t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(60, t + .2);
  g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.001, t + .25);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .3);
  [1046.5, 1318.5, 1568, 2093].forEach((f, i) => chime(c, t + .1 + i*.1, f, .12));
}
function openSound(){
  const c = sfxCtx(); if(!c) return; const t = c.currentTime;
  noiseBurst(c, t, .35, 'bandpass', 2500, 5000, .35, .8);
  noiseBurst(c, t + .18, .3, 'bandpass', 3000, 6000, .3, .8);
  [1318.5, 1568, 2093, 2637].forEach((f, i) => chime(c, t + .9 + i*.12, f, .1));
}
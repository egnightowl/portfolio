// 오해의 오해 (yes, understand.) — a conversation you answer, but that never quite answers you back.
// Spoken words appear full screen over a background; texts arrive on a phone laid over that scene.
// The whole script lives in content/artworks/yesunderstand.yml; this file only plays it.
import './style.css';
import script from '../../../content/artworks/yesunderstand.yml';

type Option = string | { text: string; go?: string };
type PoolPick = { pool: string | string[]; count?: number };
type Background = { image?: string; video?: string; youtube?: string; color?: string; dim?: number };
type Line = string | { pause?: boolean };
type Step =
  | { title: { small?: string; big?: string; en?: string } }
  | { speak: Line[]; background?: Background }
  | { chat: Line[] }
  | { say: Line[] } // older name for chat
  | { reply: Option[] | PoolPick };
interface Story { label: string; steps: Step[] }
interface Script {
  title: string;
  contact: string;
  start_button: string;
  opening: Step[];
  reply_pools?: Record<string, string[]>;
  choices: { text: string; story: string }[];
  stories: Record<string, Story>;
  ending: { text: string; credits: string[]; form?: string };
}

const S = script as Script;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Background media sit next to the list in content/artworks/ (e.g. "yesunderstand/ct-brain.jpg").
const media = import.meta.glob('../../../content/artworks/*/**/*.{png,jpg,jpeg,webp,gif,mp4,webm}', {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>;
const mediaUrl = (name: string) => media[`../../../content/artworks/${name}`] ?? '';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};
const clock = () => new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: false });

// ---------- layout ----------
const app = document.getElementById('app')!;
const stage = el('main', 'stage');
const bgLayer = el('div', 'bg');
const titleCard = el('div', 'title-card');
const speech = el('div', 'speech');
speech.setAttribute('aria-live', 'polite');
const back = el('a', 'back', '← 포트폴리오');
back.href = `${import.meta.env.BASE_URL}`;
stage.append(bgLayer, titleCard, speech);

// lock screen (start)
const lock = el('section', 'lock');
const lockTime = el('div', 'lock-time', clock());
const lockDate = el('div', 'lock-date', new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));
const note = el('button', 'note');
note.type = 'button';
note.append(el('span', 'note-app', '메시지'), el('span', 'note-time', '지금'),
  el('b', 'note-from', S.contact), el('span', 'note-text', firstChatLine()));
lock.append(lockDate, lockTime, note, el('div', 'lock-hint', S.start_button));

// phone (texts and replies)
const phone = el('section', 'phone');
phone.setAttribute('aria-label', '메시지');
const header = el('header', 'chat-head');
header.append(el('div', 'avatar', S.contact.slice(0, 1)), el('div', 'chat-name', S.contact));
const log = el('div', 'log');
log.setAttribute('role', 'log');
log.setAttribute('aria-live', 'polite');
const options = el('div', 'options');
const composer = el('div', 'composer');
const field = el('div', 'field');
const fieldText = el('span', 'field-text');
field.append(fieldText, el('i', 'caret'));
const send = el('button', 'send', '↑');
send.type = 'button';
send.disabled = true;
send.setAttribute('aria-label', '보내기');
composer.append(field, send);
phone.append(header, log, options, composer);

app.append(stage, phone, lock, back);

function firstChatLine() {
  for (const s of S.opening) {
    const lines = 'chat' in s ? s.chat : 'say' in s ? s.say : null;
    const t = lines?.find((x): x is string => typeof x === 'string');
    if (t) return t;
  }
  return '';
}

// ---------- timing (tap anywhere to skip a wait) ----------
let skip: (() => void) | null = null;
const skipNow = () => skip?.();
stage.addEventListener('click', skipNow);
log.addEventListener('click', skipNow);
const wait = (ms: number) => new Promise<void>((res) => {
  const t = setTimeout(done, reduceMotion ? Math.min(ms, 150) : ms);
  function done() { clearTimeout(t); skip = null; res(); }
  skip = done;
});

// ---------- background ----------
function setBackground(b?: Background) {
  const key = JSON.stringify(b ?? {});
  if (bgLayer.dataset.key === key) return;
  bgLayer.dataset.key = key;
  const layer = el('div', 'bg-item');
  layer.style.background = b?.color ?? '#000';
  if (b?.image) {
    const img = el('img');
    img.src = mediaUrl(b.image);
    img.alt = '';
    layer.append(img);
  } else if (b?.video) {
    const v = el('video');
    Object.assign(v, { src: mediaUrl(b.video), autoplay: true, muted: true, loop: true, playsInline: true });
    layer.append(v);
  } else if (b?.youtube) {
    const f = el('iframe', 'yt');
    const id = encodeURIComponent(b.youtube);
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&modestbranding=1&rel=0&cc_load_policy=0&iv_load_policy=3&disablekb=1&fs=0`;
    f.allow = 'autoplay; encrypted-media';
    f.tabIndex = -1;
    f.title = '배경 영상';
    layer.append(f);
  }
  const dim = el('div', 'dim');
  dim.style.opacity = String(b?.dim ?? (b?.youtube ? 0.45 : 0));
  layer.append(dim);
  bgLayer.append(layer);
  requestAnimationFrame(() => layer.classList.add('on'));
  const old = [...bgLayer.children].slice(0, -1);
  setTimeout(() => old.forEach((o) => o.remove()), 1200);
}

// ---------- phone ----------
const showPhone = (on: boolean) => {
  phone.classList.toggle('up', on);
  stage.classList.toggle('behind', on);
};
const scrollDown = () => log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });

function bubble(text: string, side: 'them' | 'me') {
  const b = el('div', `bubble ${side}`, text);
  log.append(b);
  scrollDown();
}

let readMark: HTMLElement | null = null;
function markRead() {
  readMark?.remove();
  const mine = log.querySelectorAll('.bubble.me');
  const last = mine[mine.length - 1];
  if (!last) return;
  readMark = el('div', 'read', '읽음');
  last.after(readMark);
}

async function texts(lines: Line[]) {
  showPhone(true);
  await wait(600);
  markRead();
  for (const line of lines) {
    if (typeof line !== 'string' || line === 'pause') { await wait(1600); continue; }
    const dots = el('div', 'bubble them typing');
    dots.append(el('i'), el('i'), el('i'));
    log.append(dots);
    scrollDown();
    await wait(Math.min(2400, 600 + line.length * 45));
    dots.remove();
    bubble(line, 'them');
    await wait(400);
  }
}

function viewerReplies(opts: Option[]): Promise<Option> {
  showPhone(true);
  return new Promise((resolve) => {
    options.replaceChildren();
    options.classList.add('open');
    for (const o of opts) {
      const b = el('button', 'option', typeof o === 'string' ? o : o.text);
      b.type = 'button';
      b.addEventListener('click', () => pick(o));
      options.append(b);
    }
    scrollDown();
    async function pick(o: Option) {
      const text = typeof o === 'string' ? o : o.text;
      options.classList.remove('open');
      options.replaceChildren();
      fieldText.textContent = '';
      for (const ch of reduceMotion ? [text] : text) {
        fieldText.textContent += ch;
        await new Promise((r) => setTimeout(r, 35));
      }
      send.disabled = false;
      send.focus();
      await new Promise<void>((r) => send.addEventListener('click', () => r(), { once: true }));
      send.disabled = true;
      fieldText.textContent = '';
      bubble(text, 'me');
      resolve(o);
    }
  });
}

// ---------- spoken words & title cards ----------
async function speak(lines: Line[], background?: Background) {
  showPhone(false);
  setBackground(background);
  speech.replaceChildren();
  speech.classList.add('on');
  await wait(900);
  markRead();
  for (const line of lines) {
    if (typeof line !== 'string' || line === 'pause') {
      speech.append(el('div', 'gap'));
      await wait(1400);
      continue;
    }
    const p = el('p', 'line', line);
    speech.append(p);
    p.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    await wait(Math.min(4200, 1100 + line.length * 70));
  }
  await wait(900);
}

async function title(t: { small?: string; big?: string; en?: string }) {
  showPhone(false);
  setBackground(undefined);
  speech.classList.remove('on');
  speech.replaceChildren();
  titleCard.replaceChildren(
    el('div', 'tc-small', t.small ?? ''), el('div', 'tc-big', t.big ?? ''), el('div', 'tc-en', t.en ?? ''), el('hr'));
  titleCard.classList.add('on');
  await wait(3600);
  titleCard.classList.remove('on');
  await wait(700);
}

// ---------- reply pools ----------
// { pool: 공감, count: 3 } -> 3 random lines from that pool ("전체" = every pool), avoiding lines already used this play.
const used = new Set<string>();
function resolveReply(r: Option[] | PoolPick): Option[] {
  if (Array.isArray(r)) return r;
  const pools = S.reply_pools ?? {};
  const names = r.pool === '전체' ? Object.keys(pools) : ([] as string[]).concat(r.pool);
  const all = [...new Set(names.flatMap((n) => pools[n] ?? []))];
  const fresh = all.filter((t) => !used.has(t));
  const bag = fresh.length >= (r.count ?? 3) ? fresh : all;
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  const picked = bag.slice(0, r.count ?? 3);
  picked.forEach((t) => used.add(t));
  return picked.length ? picked : ['…'];
}

// ---------- the play ----------
async function runSteps(steps: Step[]): Promise<string | null> {
  for (const step of steps) {
    if ('title' in step) await title(step.title);
    else if ('speak' in step) await speak(step.speak, step.background);
    else if ('chat' in step) await texts(step.chat);
    else if ('say' in step) await texts(step.say);
    else {
      const o = await viewerReplies(resolveReply(step.reply));
      // An option may branch to another story ({ text, go }); otherwise the friend just carries on.
      if (typeof o !== 'string' && o.go) return o.go;
    }
  }
  return null;
}

async function play() {
  log.replaceChildren(el('div', 'stamp', `오늘 ${clock()}`));
  readMark = null;
  used.clear();
  speech.replaceChildren();
  setBackground(undefined);
  await runSteps(S.opening);
  const first = await viewerReplies(S.choices.map((c) => ({ text: c.text, go: c.story })));
  let next: string | null = typeof first === 'string' ? null : first.go ?? null;
  const seen: string[] = [];
  while (next && S.stories[next] && seen.length < 20) {
    seen.push(next);
    next = await runSteps(S.stories[next].steps);
  }
  await wait(1500);
  ending(seen.map((id) => S.stories[id].label));
}

function ending(labels: string[]) {
  showPhone(true);
  const card = el('div', 'ending');
  card.append(el('p', 'ending-text', S.ending.text));
  if (labels.length) card.append(el('p', 'ending-story', labels.join(' → ')));
  for (const c of S.ending.credits) card.append(el('p', 'credit', c));
  const again = el('button', 'again', '다른 대답 해보기');
  again.type = 'button';
  again.addEventListener('click', () => play());
  card.append(again);
  if (S.ending.form) {
    const a = el('a', 'form-link', '감상 남기기');
    a.href = S.ending.form;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    card.append(a);
  }
  log.append(card);
  scrollDown();
}

note.addEventListener('click', () => {
  lock.classList.add('gone');
  setTimeout(() => lock.remove(), 600);
  play();
});
setInterval(() => { lockTime.textContent = clock(); }, 30_000);
document.title = S.title;

// 오해의 오해 (yes, understand.) — a chat you answer, but that never quite answers you back.
// The whole script lives in content/artworks/yesunderstand.yml; this file only plays it.
import './style.css';
import script from '../../../content/artworks/yesunderstand.yml';

type Option = string | { text: string; go?: string };
type PoolPick = { pool: string | string[]; count?: number };
type Step = { say: (string | { pause?: boolean })[] } | { reply: Option[] | PoolPick };
interface Story { label: string; steps: Step[] }
interface Script {
  title: string;
  year: number;
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

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};
const clock = () => new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: false });

// ---------- layout ----------
const app = document.getElementById('app')!;
const back = el('a', 'back', '← 포트폴리오');
back.href = `${import.meta.env.BASE_URL}`;
const phone = el('div', 'phone');
app.append(back, phone);

// lock screen
const lock = el('section', 'lock');
const lockTime = el('div', 'lock-time', clock());
const lockDate = el('div', 'lock-date', new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));
const note = el('button', 'note');
note.type = 'button';
note.append(el('span', 'note-app', '메시지'), el('span', 'note-time', '지금'),
  el('b', 'note-from', S.contact), el('span', 'note-text', firstLine()));
const lockHint = el('div', 'lock-hint', S.start_button);
lock.append(lockTime, lockDate, note, lockHint);

// chat screen
const chat = el('section', 'chat');
chat.hidden = true;
const header = el('header', 'chat-head');
const avatar = el('div', 'avatar', S.contact.slice(0, 1));
header.append(avatar, el('div', 'chat-name', S.contact));
const log = el('div', 'log');
log.setAttribute('role', 'log');
log.setAttribute('aria-live', 'polite');
const composer = el('div', 'composer');
const field = el('div', 'field');
const fieldText = el('span', 'field-text');
const caret = el('i', 'caret');
field.append(fieldText, caret);
const send = el('button', 'send', '↑');
send.type = 'button';
send.disabled = true;
send.setAttribute('aria-label', '보내기');
composer.append(field, send);
const options = el('div', 'options');
chat.append(header, log, options, composer);

phone.append(lock, chat);

function firstLine() {
  const s = S.opening.find((x): x is Extract<Step, { say: unknown }> => 'say' in x);
  const t = s?.say.find((x): x is string => typeof x === 'string');
  return t ?? '';
}

// ---------- timing (tap anywhere in the chat to skip a wait) ----------
let skip: (() => void) | null = null;
log.addEventListener('click', () => skip?.());
const wait = (ms: number) => new Promise<void>((res) => {
  const t = setTimeout(done, reduceMotion ? Math.min(ms, 150) : ms);
  function done() { clearTimeout(t); skip = null; res(); }
  skip = done;
});

const scrollDown = () => log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });

function bubble(text: string, side: 'them' | 'me') {
  const b = el('div', `bubble ${side}`, text);
  log.append(b);
  scrollDown();
  return b;
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

async function friendSays(lines: Extract<Step, { say: unknown }>['say']) {
  await wait(700);
  markRead();
  for (const line of lines) {
    if (typeof line !== 'string') { await wait(1600); continue; }
    if (line === 'pause') { await wait(1600); continue; }
    const dots = el('div', 'bubble them typing');
    dots.append(el('i'), el('i'), el('i'));
    log.append(dots);
    scrollDown();
    await wait(Math.min(2400, 500 + line.length * 45));
    dots.remove();
    bubble(line, 'them');
    await wait(350);
  }
}

// Shows reply options; resolves with the one the viewer sends.
function viewerReplies(opts: Option[]): Promise<Option> {
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
      await typeInto(text);
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

async function typeInto(text: string) {
  fieldText.textContent = '';
  if (reduceMotion) { fieldText.textContent = text; return; }
  for (const ch of text) {
    fieldText.textContent += ch;
    await new Promise((r) => setTimeout(r, 35));
  }
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
    if ('say' in step) await friendSays(step.say);
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
  await runSteps(S.opening);
  const first = await viewerReplies(S.choices.map((c) => ({ text: c.text, go: c.story })));
  let next: string | null = typeof first === 'string' ? null : first.go ?? null;
  const seen: string[] = [];
  while (next && S.stories[next] && seen.length < 20) {
    seen.push(next);
    next = await runSteps(S.stories[next].steps);
  }
  await wait(1200);
  ending(seen.map((id) => S.stories[id].label));
}

function ending(labels: string[]) {
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
  lock.hidden = true;
  chat.hidden = false;
  play();
});
setInterval(() => { lockTime.textContent = clock(); }, 30_000);
document.title = S.title;

import { useState, useEffect } from 'react';
import '../styles/global.css';
import type { Category, ViewState, Lang } from './types/content';
import { SITE, ABOUT, CAREER, CONTACT, WORK, fmt } from './content';

const CATEGORIES: Category[] = ['about', 'career', 'portfolio', 'contact'];
const PORTFOLIO = WORK.types;

function App() {
  const [view, setView] = useState<ViewState>({ cat: null, type: null, course: null, slide: 0 });
  const [aboutLang, setAboutLang] = useState<Lang>('ko');
  const [mailMsg, setMailMsg] = useState<string>('');

  const isEngaged = view.cat !== null;
  const pad = (n: number) => String(n).padStart(2, '0');
  const menu = SITE.menu;

  const openCategory = (cat: Category) => {
    setView({ cat, type: null, course: null, slide: 0 });
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView({ cat: null, type: null, course: null, slide: 0 });
    window.scrollTo({ top: 0 });
  };

  useEffect(() => { document.title = SITE.title; }, []);

  // Keyboard Shortcuts Control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEngaged) return;
      if (view.cat === 'portfolio' && view.course !== null) {
        const totalImgs = PORTFOLIO[view.type!].courses[view.course].imgs.length;
        if (e.key === 'ArrowRight') setView(p => ({ ...p, slide: (p.slide + 1) % totalImgs }));
        if (e.key === 'ArrowLeft') setView(p => ({ ...p, slide: (p.slide - 1 + totalImgs) % totalImgs }));
      }
      if (e.key === 'Escape') goHome();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEngaged, view]);

  // Security Mechanism: Anti-leak Deterrents
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('.stage-frame')) e.preventDefault();
    };
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const copyEmail = (email: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
    } else {
      const t = document.createElement("textarea");
      t.value = email; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.focus(); t.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      t.remove();
    }
    setMailMsg("주소를 복사했어요 — 메일 앱이 안 열리면 붙여넣어 사용하세요.");
    setTimeout(() => setMailMsg(''), 2800);
  };

  return (
    <div className={isEngaged ? 'engaged' : ''}>
      <div id="ticks"><i className="tl"></i><i className="tr"></i><i className="bl"></i><i className="br"></i></div>

      <header id="topbar">
        <button id="brandMini" aria-label="홈으로" onClick={goHome} dangerouslySetInnerHTML={{ __html: fmt(SITE.headline).replace('<br/>', ' ') }} />
        {/* Dynamic Tab Navigation */}
        <nav id="tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={view.cat === c ? 'active' : ''} onClick={() => openCategory(c)}>{menu[c].en}</button>
          ))}
        </nav>
      </header>


      {/* Hero Home Screen */}
      <section id="hero" style={{ display: isEngaged ? 'none' : 'flex' }}>
        <div className="hero-inner">
          <div className="eyebrow">PORTFOLIO &nbsp;·&nbsp; <b className = "eyebrown">{SITE.name_ko} {SITE.name_en}</b></div>
          <h1 id="brand">
            <span dangerouslySetInnerHTML={{ __html: fmt(SITE.headline) }} />
            <span className="sub">{SITE.headline_en}</span>
          </h1>
          <nav id="ovals" aria-label="메인 메뉴">
            {CATEGORIES.map((c, i) => (
              <button key={c} className="oval" onClick={() => openCategory(c)}>
                <span className="num">{pad(i + 1)}</span>
                <span className="ko">{menu[c].ko}</span>
                <span className="en">{menu[c].en}</span>
              </button>
            ))}
          </nav>
          <div className="sig">{SITE.keywords.map(k => <span key={k}>{k}</span>)}</div>
        </div>
        <div className="foot"><b>{SITE.name_ko}</b> &nbsp;·&nbsp; {SITE.name_en}<div className="cr">{SITE.copyright}</div></div>
      </section>


      {/* Main Dynamic Workspace Container */}
      {isEngaged && (
        <main id="detail" tabIndex={-1}>
          {view.cat === 'about' && (
            <div>
              <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">{menu.about.en}</span></div>
              <div className="lang-toggle">
                <button className={aboutLang === 'ko' ? 'active' : ''} onClick={() => setAboutLang('ko')}>국문</button>
                <button className={aboutLang === 'en' ? 'active' : ''} onClick={() => setAboutLang('en')}>English</button>
              </div>
              <div className="about-tag" dangerouslySetInnerHTML={{ __html: fmt(ABOUT[aboutLang].tag) }}></div>
              {ABOUT[aboutLang].sections.map((s, idx) => (
                <div className="about-sec" key={idx}>
                  <h3>{s.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: fmt(s.text) }} />
                </div>
              ))}
            </div>
          )}

          {view.cat === 'career' && (
            <div>
              <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">{menu.career.en}</span></div>
              <h1 className="page-h">경력 <span className="em">상세기술서</span></h1>
              <p className="career-now" dangerouslySetInnerHTML={{ __html: fmt(CAREER.intro) }}></p>
              <div className="tl">
                {CAREER.timeline.map((t, idx) => (
                  <div className={`tl-item ${t.highlight ? 'hl' : ''}`} key={idx}>
                    <div className="tl-when">{t.when}</div><div className="tl-role">{t.role}</div>
                    <div className="tl-org">{t.org}</div><div className="tl-desc">{t.desc}</div>
                  </div>
                ))}
              </div>
              <div className="blk-h">주요 프로젝트 · K-MOOC (PL)</div>
              {CAREER.projects.map((p, idx) => (
                <div className="proj" key={idx}><div className="pn">{p.name}</div><div className="pm">{p.meta}</div></div>
              ))}
              <div className="blk-h">역량 · 도구 · 어학</div>
              <div className="skill-groups">
                {CAREER.skills.map((s, idx) => (
                  <div className="skill" key={idx}>
                    <h4>{s.group}</h4>
                    {s.chips.map((c, cIdx) => <span className={`chip ${c.accent ? 'y' : ''}`} key={cIdx}>{c.text}</span>)}
                  </div>
                ))}
              </div>
              {CAREER.graduation && (
                <>
                  <div className="blk-h">졸업작품</div>
                  <div className="proj"><div className="pn">{CAREER.graduation.title}</div><div className="pm">{CAREER.graduation.meta}</div></div>
                  {CAREER.graduation.video && (
                    <a className="vimeo-btn" href={CAREER.graduation.video} target="_blank" rel="noopener noreferrer">▶ Vimeo에서 영상 보기</a>
                  )}
                </>
              )}
            </div>
          )}

          {view.cat === 'portfolio' && (
            <div>
              {view.type === null && (
                <div>
                  <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">{menu.portfolio.ko}</span></div>
                  <h1 className="page-h">포트폴리오 <span className="em">유형별</span></h1>
                  <p className="page-sub">{WORK.intro}</p>
                  <div className="grid type-grid">
                    {PORTFOLIO.map((t, i) => {
                      const total = t.courses.reduce((a, c) => a + c.imgs.length, 0);
                      return (
                        <button className="card" key={i} onClick={() => setView(prev => ({ ...prev, type: i, course: null, slide: 0 }))}>
                          <div className="cnt">{total}</div>
                          <div className="thumb" style={{ backgroundImage: `url('${t.courses[0]?.imgs[0] || ""}')` }}></div>
                          <div className="meta">
                            <span className="idx">TYPE {pad(i + 1)}</span><div className="t">{t.name}</div><div className="ten">{t.en}</div>
                            <div className="d">{t.summary ? `${t.summary} · ` : ''}{t.courses.length}개 과정</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {view.type !== null && view.course === null && (
                <div>
                  <div className="crumb">
                    <button onClick={goHome}>HOME</button><span className="sep">/</span>
                    <button onClick={() => setView(prev => ({ ...prev, type: null }))}>{menu.portfolio.ko}</button><span className="sep">/</span>
                    <span className="cur">{PORTFOLIO[view.type].name}</span>
                  </div>
                  <h1 className="page-h">{PORTFOLIO[view.type].name} <span className="em">과정별</span></h1>
                    <p className="page-sub">
                      {PORTFOLIO[view.type].description}
                    </p>


                  <div className="grid course-grid">
                    {PORTFOLIO[view.type].courses.map((c, i) => (
                      <button className="card" key={i} onClick={() => setView(prev => ({ ...prev, course: i, slide: 0 }))}>
                        <div className="cnt">{c.imgs.length}</div>
                        <div className="thumb" style={{ backgroundImage: `url('${c.imgs[0]}')` }}></div>
                        <div className="meta"><span className="idx">{pad(i + 1)}</span><div className="t">{c.title}</div><div className="d">{c.imgs.length} 페이지</div></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {view.type !== null && view.course !== null && (() => {
                const t = PORTFOLIO[view.type]; const c = t.courses[view.course]; const n = c.imgs.length;
                return (
                  <div>
                    <div className="crumb">
                      <button onClick={goHome}>HOME</button><span className="sep">/</span>
                      <button onClick={() => setView(prev => ({ ...prev, type: null, course: null }))}>{menu.portfolio.ko}</button><span className="sep">/</span>
                      <button onClick={() => setView(prev => ({ ...prev, course: null }))}>{t.name}</button><span className="sep">/</span>
                      <span className="cur">{c.title}</span>
                    </div>
                    <div className="stage">
                      <div className="stage-frame">
                        <img src={c.imgs[view.slide]} alt="" />
                        <div className="wm"></div>
                        {n > 1 && (
                          <>
                            <button className="nav-btn prev" onClick={() => setView(p => ({ ...p, slide: (p.slide - 1 + n) % n }))}>‹</button>
                            <button className="nav-btn next" onClick={() => setView(p => ({ ...p, slide: (p.slide + 1) % n }))}>›</button>
                          </>
                        )}
                      </div>
                      <div className="stage-bar"><div className="lab">{c.title}</div><div className="tc">{pad(view.slide + 1)} / {pad(n)}</div></div>
                      <div className="dots">
                        {c.imgs.map((_, i) => <button key={i} className={i === view.slide ? 'on' : ''} onClick={() => setView(p => ({ ...p, slide: i }))}></button>)}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {view.cat === 'contact' && (
            <div>
              <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">{menu.contact.en}</span></div>
              <h1 className="page-h">연락처 <span className="em">·</span> Contact</h1>
              <p className="page-sub">{CONTACT.intro}</p>
              <div className="contact-wrap">
                {CONTACT.rows.map((r, idx) => (
                  <div className="contact-row" key={idx}>
                    <div className="k">{r.label}</div>

                    <div className="v">
                      {r.email ? (
                        <>
                          <button className="mail-btn" onClick={() => copyEmail(r.value)}>
                             ✉ {r.value}
                          </button>
                          {mailMsg && <div className="mailmsg">{mailMsg}</div>}
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: fmt(r.value) }} />
                      )}
                      {r.link && (
                        <>
                          <br />
                          <a className="video-btn" href={r.link} target="_blank" rel="noopener noreferrer">
                            {r.link_text || '▶ 바로가기'}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <footer className="page-cr">{SITE.copyright}</footer>
        </main>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import type { Category, ViewState, Lang } from './types/portfolio';
import { ABOUT, CAREER, CONTACT_DATA, PORTFOLIO, TYPE_DESC, CATEN } from './data/portfolioData';

function App() {
  const [view, setView] = useState<ViewState>({ cat: null, type: null, course: null, slide: 0 });
  const [aboutLang, setAboutLang] = useState<Lang>('ko');
  const [mailMsg, setMailMsg] = useState<string>('');

  const isEngaged = view.cat !== null;
  const pad = (n: number) => String(n).padStart(2, '0');

  const openCategory = (cat: Category) => {
    setView({ cat, type: null, course: null, slide: 0 });
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView({ cat: null, type: null, course: null, slide: 0 });
    window.scrollTo({ top: 0 });
  };

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

  const copyEmail = () => {
    const email = "koh.yujin.01@gmail.com";
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
    } else {
      const t = document.createElement("textarea");
      t.value = email; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.focus(); t.select();
      try { document.execCommand("copy"); } catch (_) {}
      t.remove();
    }
    setMailMsg("주소를 복사했어요 — 메일 앱이 안 열리면 붙여넣어 사용하세요.");
    setTimeout(() => setMailMsg(''), 2800);
  };

  return (
    <div className={isEngaged ? 'engaged' : ''}>
      <div id="ticks"><i className="tl"></i><i className="tr"></i><i className="bl"></i><i className="br"></i></div>

      <button id="brandMini" aria-label="홈으로" onClick={goHome}>
        제작 전 과정을 이해하고 설계하는 <span className="em">교육 콘텐츠 디자이너</span>
      </button>

      {/* Hero Home Screen */}
      <section id="hero" style={{ display: isEngaged ? 'none' : 'flex' }}>
        <div className="hero-inner">
          <div className="eyebrow">PORTFOLIO &nbsp;·&nbsp; <b className = "eyebrown">고유진 YUJIN KOH</b></div>
          <h1 id="brand">
            제작 전 과정을 이해하고 설계하는<br />
            <span className="em">교육 콘텐츠 디자이너</span>
            <span className="sub">INSTRUCTIONAL CONTENT &amp; STORYBOARD DESIGNER</span>
          </h1>
          <nav id="ovals" aria-label="메인 메뉴">
            {(['about', 'career', 'portfolio', 'contact'] as Category[]).map((c, i) => (
              <button key={c} className="oval" onClick={() => openCategory(c)}>
                <span className="num">{pad(i + 1)}</span>
                <span className="ko">{c === 'portfolio' ? '포트폴리오' : c === 'career' ? '경력 상세기술서' : c === 'about' ? '자기소개서' : '연락처'}</span>
                <span className="en">{CATEN[c]}</span>
              </button>
            ))}
          </nav>
          <div className="sig"><span>스토리보드</span><span>콘텐츠 기획</span><span>교수설계</span><span>교육공학</span></div>
        </div>
        <div className="foot"><b>고유진</b> &nbsp;·&nbsp; YUJIN KOH<div className="cr">© 2026 YUJIN KOH · All rights reserved.</div></div>
      </section>

      {/* Dynamic Tab Navigation */}
      <nav id="tabs">
        {(['about', 'career', 'portfolio', 'contact'] as Category[]).map(c => (
          <button key={c} className={view.cat === c ? 'active' : ''} onClick={() => openCategory(c)}>{CATEN[c]}</button>
        ))}
      </nav>

      {/* Main Dynamic Workspace Container */}
      {isEngaged && (
        <main id="detail" tabIndex={-1}>
          {view.cat === 'about' && (
            <div>
              <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">{CATEN.about}</span></div>
              <div className="lang-toggle">
                <button className={aboutLang === 'ko' ? 'active' : ''} onClick={() => setAboutLang('ko')}>국문</button>
                <button className={aboutLang === 'en' ? 'active' : ''} onClick={() => setAboutLang('en')}>English</button>
              </div>
              <div className="about-tag" dangerouslySetInnerHTML={{ __html: ABOUT[aboutLang].tag }}></div>
              {ABOUT[aboutLang].secs.map((s, idx) => (
                <div className="about-sec" key={idx}>
                  <h3>{s.h}</h3>
                  <p dangerouslySetInnerHTML={{ __html: s.p }} />
                </div>
              ))}
            </div>
          )}

          {view.cat === 'career' && (
            <div>
              <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">{CATEN.career}</span></div>
              <h1 className="page-h">경력 <span className="em">상세기술서</span></h1>
              <p className="career-now" dangerouslySetInnerHTML={{ __html: CAREER.now }}></p>
              <div className="tl">
                {CAREER.timeline.map((t, idx) => (
                  <div className={`tl-item ${t.hl ? 'hl' : ''}`} key={idx}>
                    <div className="tl-when">{t.when}</div><div className="tl-role">{t.role}</div>
                    <div className="tl-org">{t.org}</div><div className="tl-desc">{t.desc}</div>
                  </div>
                ))}
              </div>
              <div className="blk-h">주요 프로젝트 · K-MOOC (PL)</div>
              {CAREER.projects.map((p, idx) => (
                <div className="proj" key={idx}><div className="pn">{p.n}</div><div className="pm">{p.m}</div></div>
              ))}
              <div className="blk-h">역량 · 도구 · 어학</div>
              <div className="skill-groups">
                {CAREER.skills.map((s, idx) => (
                  <div className="skill" key={idx}>
                    <h4>{s.h}</h4>
                    {s.chips.map((c, cIdx) => <span className={`chip ${c[1] ? 'y' : ''}`} key={cIdx}>{c[0]}</span>)}
                  </div>
                ))}
              </div>
              <div className="blk-h">졸업작품</div>
              <div className="proj"><div className="pn">세 여자 이야기 (Three Women's Story)</div><div className="pm">서양화 · 2019</div></div>
              <a className="vimeo-btn" href="https://vimeo.com/431734496" target="_blank" rel="noopener noreferrer">▶ Vimeo에서 영상 보기</a>
            </div>
          )}

          {view.cat === 'portfolio' && (
            <div>
              {view.type === null && (
                <div>
                  <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">포트폴리오</span></div>
                  <h1 className="page-h">포트폴리오 <span className="em">유형별</span></h1>
                  <p className="page-sub">교육 매체 유형별로 정리한 스토리보드 설계 작업입니다. 유형을 선택하면 과정별 목록을 볼 수 있습니다.</p>
                  <div className="grid type-grid">
                    {PORTFOLIO.map((t, i) => {
                      const total = t.courses.reduce((a, c) => a + c.count, 0);
                      return (
                        <button className="card" key={i} onClick={() => setView(prev => ({ ...prev, type: i, course: null, slide: 0 }))}>
                          <div className="cnt">{total}</div>
                          <div className="thumb" style={{ backgroundImage: `url('${t.courses[0]?.imgs[0] || ""}')` }}></div>
                          <div className="meta">
                            <span className="idx">TYPE {pad(i + 1)}</span><div className="t">{t.kr}</div><div className="ten">{t.en}</div>
                            <div className="d">{TYPE_DESC[t.kr] || ""} · {t.courses.length}개 과정</div>
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
                    <button onClick={() => setView(prev => ({ ...prev, type: null }))}>포트폴리오</button><span className="sep">/</span>
                    <span className="cur">{PORTFOLIO[view.type].kr}</span>
                  </div>
                  <h1 className="page-h">{PORTFOLIO[view.type].kr} <span className="em">과정별</span></h1>
                    <p className="page-sub">
                      {PORTFOLIO[view.type].description}
                    </p>
                

                  <div className="grid course-grid">
                    {PORTFOLIO[view.type].courses.map((c, i) => (
                      <button className="card" key={i} onClick={() => setView(prev => ({ ...prev, course: i, slide: 0 }))}>
                        <div className="cnt">{c.count}</div>
                        <div className="thumb" style={{ backgroundImage: `url('${c.imgs[0]}')` }}></div>
                        <div className="meta"><span className="idx">{pad(i + 1)}</span><div className="t">{c.label}</div><div className="d">{c.count} 페이지</div></div>
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
                      <button onClick={() => setView(prev => ({ ...prev, type: null, course: null }))}>포트폴리오</button><span className="sep">/</span>
                      <button onClick={() => setView(prev => ({ ...prev, course: null }))}>{t.kr}</button><span className="sep">/</span>
                      <span className="cur">{c.label}</span>
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
                      <div className="stage-bar"><div className="lab">{c.label}</div><div className="tc">{pad(view.slide + 1)} / {pad(n)}</div></div>
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
              <div className="crumb"><button onClick={goHome}>HOME</button><span className="sep">/</span><span className="cur">{CATEN.contact}</span></div>
              <h1 className="page-h">연락처 <span className="em">·</span> Contact</h1>
              <p className="page-sub">교육 콘텐츠 기획·설계 관련 제안이나 협업 문의를 환영합니다.</p>
              <div className="contact-wrap">
                {CONTACT_DATA.map((r, idx) => (
                  <div className="contact-row" key={idx}>
                    <div className="k">{r.k}</div>

                    <div className={`v ${r.big ? "big" : ""}`}>
                      {r.k === "EMAIL" ? (
                        <>
                          <button className="mail-btn" onClick={copyEmail}>
                             {r.v}
                          </button>
                          {mailMsg && <div className="mailmsg">{mailMsg}</div>}
                        </>
                      ) : r.k === "졸업작품" ? (
                        <>
                          <span>{r.v}</span>
                          <br />
                          <a
                            className="video-btn"
                            href="https://vimeo.com/431734496"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ▶ 영상 보기
                          </a>
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: r.v }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <footer className="page-cr">© 2026 고유진 · YUJIN KOH — All rights reserved.</footer>
        </main>
      )}
    </div>
  );
}

export default App;
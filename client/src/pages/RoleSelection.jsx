import { useState } from "react";

const T = {
  navy:     "#07112B",
  navyCard: "#0D1E3F",
  navyHov:  "#0F2244",
  cream:    "#F4EFE6",
  blue:     "#3B7DD8",
  blueLt:   "#6FA3EC",
  bluePale: "rgba(59,125,216,0.09)",
  divider:  "rgba(244,239,230,0.07)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; }

body {
  font-family: 'Outfit', sans-serif;
  background: ${T.navy};
  color: ${T.cream};
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: ${T.navy}; }
::-webkit-scrollbar-thumb { background: rgba(59,125,216,.5); border-radius: 2px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes shimmer {
  from { background-position: -600px 0; }
  to   { background-position:  600px 0; }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-18px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes lineGrow {
  from { transform: scaleX(0); transform-origin: left; }
  to   { transform: scaleX(1); transform-origin: left; }
}
@keyframes barPulse {
  0%, 100% { opacity: .15; }
  50%       { opacity: .28; }
}
@keyframes dotDrift {
  0%   { background-position: 0 0; }
  100% { background-position: 44px 44px; }
}
@keyframes glowPulse {
  0%, 100% { opacity: .5;  transform: translate(-50%, -50%) scale(1); }
  50%       { opacity: .75; transform: translate(-50%, -50%) scale(1.06); }
}
@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}

/* ── NAV ── */
.rs-nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 400;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 4rem;
  background: rgba(7,17,43,0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid ${T.divider};
  animation: fadeIn .55s ease both;
}

.rs-nav-logo {
  display: flex; align-items: center; gap: 11px;
  cursor: pointer; text-decoration: none;
}
.rs-nav-mark {
  width: 34px; height: 34px;
  border: 1px solid rgba(59,125,216,.38);
  display: flex; align-items: center; justify-content: center;
  position: relative; flex-shrink: 0;
}
.rs-nav-mark::after {
  content: ''; position: absolute; inset: 3px;
  border: 1px solid rgba(59,125,216,.1);
}
.rs-nav-mark span {
  font-family: 'DM Serif Display', serif;
  font-size: 18px; color: ${T.blue};
  position: relative; z-index: 1;
}
.rs-nav-name {
  font-family: 'DM Serif Display', serif;
  font-size: 19px; color: ${T.cream}; letter-spacing: .1px;
  white-space: nowrap;
}
.rs-nav-name em { font-style: normal; color: ${T.blue}; }

.rs-nav-links {
  display: flex; align-items: center; gap: 2.25rem;
}
.rs-nav-link {
  font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase;
  font-weight: 400; color: rgba(244,239,230,.38);
  text-decoration: none; transition: color .2s;
  position: relative; background: none; border: none; cursor: pointer;
  font-family: 'Outfit', sans-serif; padding: 0;
}
.rs-nav-link::after {
  content: ''; position: absolute;
  bottom: -4px; left: 0; width: 0; height: 1px;
  background: ${T.blue}; transition: width .28s ease;
}
.rs-nav-link:hover { color: ${T.cream}; }
.rs-nav-link:hover::after { width: 100%; }

/* ── PAGE ── */
.rs-page {
  min-height: 100vh;
  width: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 9rem 2rem 5rem;
  position: relative; overflow: hidden;
}

.rs-dots {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(59,125,216,.1) 1px, transparent 1px);
  background-size: 44px 44px;
  animation: dotDrift 22s linear infinite;
  pointer-events: none; z-index: 0;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 68%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 68%);
}

.rs-glow {
  position: absolute; top: 50%; left: 50%;
  width: 700px; height: 700px; border-radius: 50%;
  background: radial-gradient(circle, rgba(59,125,216,.075) 0%, transparent 62%);
  animation: glowPulse 7s ease-in-out infinite;
  pointer-events: none; z-index: 0;
}

.rs-bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(to bottom,
    transparent 0%, ${T.blue} 35%, rgba(59,125,216,.18) 70%, transparent 100%);
  animation: barPulse 4s ease-in-out infinite;
  pointer-events: none; z-index: 1;
}

.rs-inner {
  position: relative; z-index: 2;
  width: 100%; max-width: 860px;
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
}

/* eyebrow */
.rs-eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
  font-weight: 400; color: ${T.blue};
  margin-bottom: 1.75rem;
  animation: fadeIn .8s ease .12s both;
}
.rs-eyebrow-line {
  width: 20px; height: 1px; background: ${T.blue}; opacity: .45;
  animation: lineGrow .8s cubic-bezier(.22,1,.36,1) .35s both;
}

/* heading */
.rs-heading {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(38px, 5.5vw, 68px);
  font-weight: 400; line-height: 1.07;
  letter-spacing: -.8px; color: ${T.cream};
  margin-bottom: 1rem;
  animation: fadeUp .9s cubic-bezier(.22,1,.36,1) .22s both;
}
.rs-heading em { font-style: italic; color: ${T.blue}; }

.rs-sub {
  font-size: 14px; font-weight: 300; line-height: 1.88;
  color: rgba(244,239,230,.35);
  max-width: 340px; margin-bottom: 3.5rem;
  animation: fadeUp .9s cubic-bezier(.22,1,.36,1) .32s both;
}

/* ── CARDS ── */
.rs-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}

.rs-card {
  background: ${T.navyCard};
  padding: 3.5rem 2.75rem;
  cursor: pointer;
  position: relative; overflow: hidden;
  text-align: left;
  border: 1px solid ${T.divider};
  outline: none;
  transition: background .32s, border-color .32s, transform .32s cubic-bezier(.22,1,.36,1);
  display: block; width: 100%;
}
.rs-card:nth-child(1) { animation: slideInLeft  .85s cubic-bezier(.22,1,.36,1) .44s both; }
.rs-card:nth-child(2) { animation: slideInRight .85s cubic-bezier(.22,1,.36,1) .52s both; }
.rs-card:focus-visible { outline: 2px solid ${T.blue}; outline-offset: 2px; }

.rs-card::before {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 0; height: 2px;
  background: ${T.blue};
  transition: width .4s cubic-bezier(.22,1,.36,1);
}
.rs-card:hover {
  background: ${T.navyHov};
  border-color: rgba(59,125,216,.28);
  transform: translateY(-4px);
}
.rs-card:hover::before { width: 100%; }

.rs-card-wash {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(59,125,216,.06) 0%, transparent 52%);
  opacity: 0; transition: opacity .4s; pointer-events: none;
}
.rs-card:hover .rs-card-wash { opacity: 1; }

.rs-card-corner {
  position: absolute; bottom: 0; right: 0;
  width: 52px; height: 52px;
  border-left: 1px solid rgba(59,125,216,.07);
  border-top:  1px solid rgba(59,125,216,.07);
  transition: border-color .35s, width .35s, height .35s;
  pointer-events: none;
}
.rs-card:hover .rs-card-corner {
  width: 72px; height: 72px;
  border-color: rgba(59,125,216,.2);
}

.rs-card-icon {
  width: 50px; height: 50px;
  border: 1px solid rgba(59,125,216,.16);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; margin-bottom: 2rem;
  position: relative; z-index: 1;
  transition: border-color .32s, background .32s;
}
.rs-card:hover .rs-card-icon {
  border-color: rgba(59,125,216,.5);
  background: ${T.bluePale};
  animation: iconFloat 2.4s ease-in-out infinite;
}

.rs-card-title {
  font-family: 'DM Serif Display', serif;
  font-size: 28px; font-weight: 400; color: ${T.cream};
  margin-bottom: .7rem; line-height: 1.12;
  position: relative; z-index: 1;
  transition: color .22s;
}
.rs-card:hover .rs-card-title { color: #fff; }

.rs-card-body {
  font-size: 13.5px; font-weight: 300; line-height: 1.88;
  color: rgba(244,239,230,.34);
  margin-bottom: 2.25rem;
  position: relative; z-index: 1;
  transition: color .22s;
}
.rs-card:hover .rs-card-body { color: rgba(244,239,230,.5); }

.rs-card-cta {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
  font-weight: 500; color: ${T.blue};
  position: relative; z-index: 1;
  transition: gap .3s cubic-bezier(.22,1,.36,1);
}
.rs-card:hover .rs-card-cta { gap: 17px; }

.rs-card-arrow {
  width: 26px; height: 26px;
  border: 1px solid rgba(59,125,216,.28);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; line-height: 1;
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              border-color .28s, background .28s;
}
.rs-card:hover .rs-card-arrow {
  transform: translateX(4px);
  border-color: ${T.blue};
  background: rgba(59,125,216,.1);
}

/* ── SIGN IN STRIP ── */
.rs-signin {
  margin-top: 2.5rem;
  display: flex; align-items: center; gap: 14px;
  width: 100%;
  animation: fadeIn .9s ease .68s both;
}
.rs-signin-line {
  flex: 1; height: 1px;
  background: linear-gradient(to right, transparent, ${T.divider}, transparent);
}
.rs-signin-text {
  font-size: 13px; font-weight: 300;
  color: rgba(244,239,230,.24); white-space: nowrap;
}
.rs-signin-btn {
  background: none; border: none; cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 13px; font-weight: 500;
  color: ${T.blue}; padding: 0;
  position: relative; transition: color .2s;
}
.rs-signin-btn::after {
  content: ''; position: absolute;
  bottom: -1px; left: 0; width: 0; height: 1px;
  background: ${T.blue}; transition: width .26s ease;
}
.rs-signin-btn:hover { color: ${T.blueLt}; }
.rs-signin-btn:hover::after { width: 100%; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .rs-nav { padding: 1rem 1.5rem; }
  .rs-nav-links { display: none; }
  .rs-page { padding: 7rem 1.25rem 4rem; }
  .rs-cards { grid-template-columns: 1fr; gap: 14px; }
  .rs-card { padding: 2.5rem 1.75rem; }
  .rs-heading { font-size: clamp(32px, 8vw, 48px); }
  .rs-card-title { font-size: 24px; }
  .rs-sub { max-width: 100%; }
}
@media (max-width: 420px) {
  .rs-nav { padding: .9rem 1.25rem; }
  .rs-nav-name { font-size: 16px; }
  .rs-card { padding: 2rem 1.35rem; }
  .rs-card-title { font-size: 21px; }
  .rs-card-icon { width: 44px; height: 44px; font-size: 17px; }
  .rs-heading { font-size: 30px; }
}
`;

const roles = [
  {
    key:   "actor",
    icon:  "🎭",
    title: "I'm an Actor",
    body:  "Build your profile once. Upload photos, a bilingual intro video, and your credits — then let the right productions find you. Always free.",
    cta:   "Join as actor",
  },
  {
    key:   "producer",
    icon:  "🎬",
    title: "I'm a Producer",
    body:  "Submit a casting brief and receive a hand-curated shortlist of matched actors within 24 hours. No algorithm — real human curation.",
    cta:   "Join as producer",
  },
];

export default function RoleSelection({ onSelectRole, onSignIn, onHome }) {
  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="rs-nav">
        <div className="rs-nav-logo" onClick={onHome}>
          <div className="rs-nav-mark"><span>C</span></div>
          <span className="rs-nav-name">Casting<em>.Home</em></span>
        </div>

        <div className="rs-nav-links">
          <button className="rs-nav-link" onClick={onHome}>Home</button>
        </div>
      </nav>

      {/* PAGE */}
      <div className="rs-page">
        <div className="rs-bar"  aria-hidden="true" />
        <div className="rs-dots" aria-hidden="true" />
        <div className="rs-glow" aria-hidden="true" />

        <div className="rs-inner">

          <div className="rs-eyebrow">
            <span className="rs-eyebrow-line" />
            Step 1 of 2
            <span className="rs-eyebrow-line" />
          </div>

          <h1 className="rs-heading">
            Who are <em>you?</em>
          </h1>

          <p className="rs-sub">
            Choose your role to get started.
            You can always update it later from your settings.
          </p>

          <div className="rs-cards">
            {roles.map((r) => (
              <button
                key={r.key}
                className="rs-card"
                onClick={() => onSelectRole(r.key)}
              >
                <div className="rs-card-wash"   aria-hidden="true" />
                <div className="rs-card-corner" aria-hidden="true" />
                <div className="rs-card-icon">{r.icon}</div>
                <div className="rs-card-title">{r.title}</div>
                <p   className="rs-card-body">{r.body}</p>
                <div className="rs-card-cta">
                  {r.cta}
                  <span className="rs-card-arrow">→</span>
                </div>
              </button>
            ))}
          </div>

          <div className="rs-signin">
            <span className="rs-signin-line" />
            <span className="rs-signin-text">Already have an account?</span>
            <button className="rs-signin-btn" onClick={() => onSignIn && onSignIn()}>
              Sign in
            </button>
            <span className="rs-signin-line" />
          </div>

        </div>
      </div>
    </>
  );
}
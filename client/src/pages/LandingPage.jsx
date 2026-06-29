import { useEffect, useRef, useState } from "react";

const T = {
  navy:     "#07112B",
  navyMid:  "#0A1630",
  navyCard: "#0D1E3F",
  navyLite: "#112347",
  navyDeep: "#040C1E",
  cream:    "#F4EFE6",
  creamSub: "#C8C0B4",
  blue:     "#3B7DD8",
  blueLt:   "#6FA3EC",
  bluePale: "rgba(59,125,216,0.09)",
  divider:  "rgba(244,239,230,0.08)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500&display=swap');

*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }

body {
  font-family:'Outfit',sans-serif;
  background:${T.navy};
  color:${T.cream};
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}

::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-track { background:${T.navy}; }
::-webkit-scrollbar-thumb { background:${T.blue}; border-radius:2px; }

#glow {
  pointer-events:none;
  position:fixed;
  z-index:0;
  width:600px; height:600px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(59,125,216,0.05) 0%, transparent 65%);
  transform:translate(-50%,-50%);
  transition:left .25s ease, top .25s ease;
}

@keyframes fadeUp {
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; }
  to   { opacity:1; }
}
@keyframes shimmer {
  from { background-position:-500px 0; }
  to   { background-position: 500px 0; }
}
@keyframes lineGrow {
  from { transform:scaleX(0); transform-origin:left; }
  to   { transform:scaleX(1); transform-origin:left; }
}
@keyframes bgDrift {
  0%,100% { transform:translateY(-50%) rotate(0deg); }
  50%     { transform:translateY(-50%) rotate(3deg) scale(1.03); }
}
@keyframes barPulse {
  0%,100% { opacity:.15; }
  50%     { opacity:.30; }
}

.reveal {
  opacity:0;
  transform:translateY(32px);
  transition:opacity .75s cubic-bezier(.22,1,.36,1),
             transform .75s cubic-bezier(.22,1,.36,1);
}
.reveal.visible { opacity:1; transform:translateY(0); }
.d1 { transition-delay:.08s; }
.d2 { transition-delay:.16s; }
.d3 { transition-delay:.24s; }
.d4 { transition-delay:.32s; }

/* ════════════════════════════
   NAV
════════════════════════════ */
.nav {
  position:fixed; top:0; left:0; right:0;
  z-index:400;
  display:flex; justify-content:space-between; align-items:center;
  padding:1.1rem 5rem;
  transition:background .4s, border-color .4s, backdrop-filter .4s;
  border-bottom:1px solid transparent;
}
.nav.on {
  background:rgba(6,15,36,0.94);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-bottom-color:${T.divider};
}

.nav-logo {
  display:flex; align-items:center; gap:11px;
  cursor:pointer; text-decoration:none; flex-shrink:0;
}
.nav-mark {
  display:flex; align-items:center; justify-content:center;
  width:34px; height:34px; flex-shrink:0;
}
.nav-mark img {
  width:34px; height:34px;
  object-fit:contain; display:block;
}
.nav-mark-fallback {
  width:34px; height:34px;
  border:1px solid rgba(59,125,216,.4);
  display:flex; align-items:center; justify-content:center;
}
.nav-mark-fallback span {
  font-family:'DM Serif Display',serif;
  font-size:18px; color:${T.blue}; line-height:1;
}
.nav-name {
  font-family:'DM Serif Display',serif;
  font-size:19px; color:${T.cream}; letter-spacing:.1px;
  white-space:nowrap;
}
.nav-name em { font-style:normal; color:${T.blue}; }

.nav-links { display:flex; gap:2rem; align-items:center; }
.nav-link {
  font-size:11px; letter-spacing:1.6px; text-transform:uppercase;
  font-weight:400; color:rgba(244,239,230,.38);
  text-decoration:none; transition:color .2s; position:relative;
}
.nav-link::after {
  content:''; position:absolute;
  bottom:-4px; left:0; width:0; height:1px;
  background:${T.blue}; transition:width .28s ease;
}
.nav-link:hover { color:${T.cream}; }
.nav-link:hover::after { width:100%; }

.nav-cta {
  padding:8px 20px;
  border:1px solid rgba(59,125,216,.45);
  background:transparent;
  font-family:'Outfit',sans-serif;
  font-size:11px; letter-spacing:1.6px; text-transform:uppercase;
  font-weight:500; color:${T.blue}; cursor:pointer;
  position:relative; overflow:hidden;
  transition:color .28s, border-color .28s;
  white-space:nowrap;
}
.nav-cta::before {
  content:''; position:absolute; inset:0;
  background:${T.blue};
  transform:translateY(102%);
  transition:transform .32s cubic-bezier(.22,1,.36,1);
}
.nav-cta:hover { color:#fff; border-color:${T.blue}; }
.nav-cta:hover::before { transform:translateY(0); }
.nav-cta span { position:relative; z-index:1; }

.nav-burger {
  display:none;
  flex-direction:column; gap:5px;
  background:none; border:none; cursor:pointer;
  padding:4px;
}
.nav-burger span {
  display:block; width:22px; height:1.5px;
  background:rgba(244,239,230,.6);
  transition:background .2s;
}
.nav-burger:hover span { background:${T.cream}; }

.nav-drawer {
  display:none;
  position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(6,15,36,0.98);
  z-index:500;
  flex-direction:column;
  align-items:center; justify-content:center;
  gap:2.5rem;
}
.nav-drawer.open { display:flex; }
.nav-drawer a, .nav-drawer button.drawer-link {
  font-family:'DM Serif Display',serif;
  font-size:28px; color:rgba(244,239,230,.55);
  text-decoration:none; background:none; border:none;
  cursor:pointer; letter-spacing:.3px;
  transition:color .2s;
}
.nav-drawer a:hover, .nav-drawer button.drawer-link:hover { color:${T.cream}; }
.nav-drawer .drawer-cta {
  margin-top:.5rem;
  padding:14px 40px;
  background:${T.blue}; border:none;
  font-family:'Outfit',sans-serif;
  font-size:12px; letter-spacing:2px; text-transform:uppercase;
  font-weight:500; color:#fff; cursor:pointer;
}
.drawer-close {
  position:absolute; top:1.5rem; right:1.5rem;
  background:none; border:none; cursor:pointer;
  color:rgba(244,239,230,.4); font-size:24px;
  transition:color .2s; line-height:1;
}
.drawer-close:hover { color:${T.cream}; }

/* ════════════════════════════
   HERO  — full-bleed two-column
════════════════════════════ */
.hero {
  position:relative;
  min-height:100vh;
  display:grid;
  grid-template-columns:1fr auto;   /* text left, stats right */
  align-items:center;
  gap:4rem;
  padding:9rem 5rem 5rem;
  overflow:hidden;
  background:${T.navy};
}

.hero::before {
  content:''; position:absolute; inset:0;
  background-image:radial-gradient(circle, rgba(59,125,216,.12) 1px, transparent 1px);
  background-size:44px 44px;
  pointer-events:none; z-index:0;
  mask-image:radial-gradient(ellipse 70% 80% at 30% 50%, black 0%, transparent 70%);
  -webkit-mask-image:radial-gradient(ellipse 70% 80% at 30% 50%, black 0%, transparent 70%);
}

.hero-glow {
  position:absolute; top:-140px; left:-60px;
  width:800px; height:800px; border-radius:50%;
  background:radial-gradient(circle, rgba(59,125,216,.08) 0%, transparent 60%);
  pointer-events:none; z-index:0;
}

.hero-bg {
  position:absolute; right:-2vw; top:50%;
  font-family:'DM Serif Display',serif;
  font-size:clamp(180px,28vw,420px);
  font-weight:400; color:transparent;
  -webkit-text-stroke:1px rgba(59,125,216,.04);
  user-select:none; pointer-events:none;
  animation:bgDrift 24s ease-in-out infinite;
  z-index:0; line-height:1; letter-spacing:-10px;
}

/* thin accent on very left edge */
.hero-bar {
  position:absolute; left:0; top:0; bottom:0; width:2px;
  background:linear-gradient(to bottom,
    transparent 0%, ${T.blue} 35%, rgba(59,125,216,.2) 70%, transparent 100%);
  animation:barPulse 4s ease-in-out infinite;
  pointer-events:none;
}

.hero-body {
  position:relative; z-index:2;
  max-width:620px;
}

.hero-over {
  display:inline-flex; align-items:center; gap:12px;
  font-size:10px; letter-spacing:3px; text-transform:uppercase;
  font-weight:400; color:${T.blue};
  margin-bottom:2rem;
  animation:fadeIn 1s ease .12s both;
}
.hero-over-line { width:24px; height:1px; background:${T.blue}; opacity:.5; }

.hero-h1 {
  font-family:'DM Serif Display',serif;
  font-size:clamp(52px,6.5vw,92px);
  font-weight:400;
  line-height:1.03;
  letter-spacing:-1.5px;
  color:${T.cream};
  margin-bottom:1.75rem;
  animation:fadeUp 1.1s cubic-bezier(.22,1,.36,1) .24s both;
}
.hero-h1 em { font-style:italic; color:${T.blue}; }
.hero-h1 .uw { display:inline-block; position:relative; }
.hero-h1 .uw::after {
  content:''; position:absolute;
  bottom:4px; left:0; right:0; height:2px;
  background:${T.blue}; opacity:.3;
  animation:lineGrow 1s cubic-bezier(.22,1,.36,1) 1.1s both;
}

.hero-sub {
  font-size:15px; font-weight:300; line-height:1.9;
  color:rgba(244,239,230,.42); max-width:360px;
  margin-bottom:2.75rem;
  animation:fadeUp 1.1s cubic-bezier(.22,1,.36,1) .38s both;
}

.hero-btn-wrap {
  animation:fadeUp 1.1s cubic-bezier(.22,1,.36,1) .52s both;
}

/* stats column — right side of grid */
.hero-stats {
  position:relative; z-index:2;
  display:flex; flex-direction:column; gap:2.8rem;
  animation:fadeIn 1.4s ease .9s both;
  flex-shrink:0;
}
.h-stat {
  text-align:right; padding-right:1.25rem;
  border-right:1px solid rgba(59,125,216,.22);
}
.h-stat-n {
  font-family:'DM Serif Display',serif;
  font-size:44px; font-weight:400; color:${T.creamSub};
  line-height:1; display:block;
}
.h-stat-l {
  font-size:10px; letter-spacing:2px; text-transform:uppercase;
  font-weight:400; color:rgba(244,239,230,.2); margin-top:5px;
}

/* ── BUTTONS ── */
.btn-solid {
  position:relative; overflow:hidden;
  padding:15px 44px;
  background:${T.blue}; border:none;
  font-family:'Outfit',sans-serif;
  font-size:11px; letter-spacing:2px; text-transform:uppercase;
  font-weight:500; color:#fff; cursor:pointer;
  transition:transform .26s, box-shadow .26s;
  display:inline-block;
}
.btn-solid::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  background-size:500px 100%; opacity:0; transition:opacity .26s;
}
.btn-solid:hover { transform:translateY(-2px); box-shadow:0 14px 44px rgba(59,125,216,.3); }
.btn-solid:hover::after { opacity:1; animation:shimmer .7s linear; }

/* ════════════════════════════
   SECTIONS — shared
════════════════════════════ */
.sect { padding:7rem 5rem; }
.sect-inner { max-width:1100px; margin:0 auto; }

.eyebrow {
  display:inline-flex; align-items:center; gap:10px;
  font-size:10px; letter-spacing:3px; text-transform:uppercase;
  font-weight:500; color:${T.blue}; margin-bottom:1.1rem;
}
.eyebrow::before {
  content:''; width:18px; height:1px;
  background:${T.blue}; opacity:.55;
}

.sect-h2 {
  font-family:'DM Serif Display',serif;
  font-size:clamp(32px,4vw,56px);
  font-weight:400; line-height:1.1; letter-spacing:-.5px;
  color:${T.cream}; margin-bottom:1.1rem;
}
.sect-h2 em { font-style:italic; color:${T.blue}; }

.sect-p {
  font-size:14px; font-weight:300; line-height:1.9;
  color:rgba(244,239,230,.35); 
}

/* ════════════════════════════
   WHO IT'S FOR
════════════════════════════ */
.info-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:1px;
  margin-top:3.5rem;
  background:${T.divider};
  border:1px solid ${T.divider};
}
.info-panel {
  background:${T.navyCard};
  padding:3.25rem 3rem;
  position:relative; overflow:hidden;
  text-align:left;  /* fix: was inheriting center from parent */
}
.info-panel::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
  background:linear-gradient(to right, ${T.blue}, transparent 55%);
  opacity:.25;
}
.info-icon {
  width:46px; height:46px;
  border:1px solid rgba(59,125,216,.18);
  display:flex; align-items:center; justify-content:center;
  font-size:18px; margin-bottom:2rem;
}
.info-title {
  font-family:'DM Serif Display',serif;
  font-size:30px; font-weight:400; color:${T.cream};
  margin-bottom:.9rem; line-height:1.15;
}
.info-body {
  font-size:13.5px; font-weight:300; line-height:1.9;
  color:rgba(244,239,230,.38);
  margin-bottom:2rem; max-width:320px;
}
.info-feats { display:flex; flex-direction:column; gap:.6rem; }
.info-feat {
  display:flex; align-items:baseline; gap:12px;
  font-size:13px; font-weight:300;
  color:rgba(244,239,230,.32);
}
.info-feat-dash { color:${T.blue}; opacity:.55; flex-shrink:0; font-size:11px; }

/* ════════════════════════════
   HOW IT WORKS
════════════════════════════ */
.how-bg {
  background:${T.navyMid};
  border-top:1px solid ${T.divider};
  border-bottom:1px solid ${T.divider};
}
.how-layout {
  display:grid;
  grid-template-columns:1fr 1.7fr;
  gap:6rem; align-items:start;
}
.how-pin { position:sticky; top:7rem; }

.how-steps { display:flex; flex-direction:column; }
.how-step {
  display:grid; grid-template-columns:52px 1fr;
  gap:1.5rem; padding:2.5rem 0;
  border-bottom:1px solid ${T.divider};
  align-items:start;
  transition:padding-left .28s;
  cursor:default;
}
.how-step:last-child { border-bottom:none; }
.how-step:hover { padding-left:6px; }

.how-n {
  font-family:'DM Serif Display',serif;
  font-size:28px; font-weight:400;
  color:rgba(59,125,216,.16); line-height:1.1;
  transition:color .28s; padding-top:3px;
}
.how-step:hover .how-n { color:${T.blue}; }

.how-title {
  font-family:'DM Serif Display',serif;
  font-size:23px; font-weight:400; color:${T.cream};
  margin-bottom:.55rem; line-height:1.2;
}
.how-body {
  font-size:13.5px; font-weight:300; line-height:1.88;
  color:rgba(244,239,230,.34);
}

/* ════════════════════════════
   TRUST STRIP
════════════════════════════ */
.trust-sect {
  padding:5rem;
  border-top:1px solid ${T.divider};
}
.trust-inner {
  max-width:1100px; margin:0 auto;
  display:grid; grid-template-columns:repeat(3,1fr);
  gap:0;
  border:1px solid ${T.divider};
}
.trust-cell {
  padding:2.5rem 2.25rem;
  border-right:1px solid ${T.divider};
  transition:background .3s;
  position:relative; overflow:hidden;
}
.trust-cell:last-child { border-right:none; }
.trust-cell:hover { background:${T.navyLite}; }
.trust-cell::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(to right, ${T.blue}, transparent);
  opacity:0; transition:opacity .3s;
}
.trust-cell:hover::before { opacity:.5; }
.trust-num {
  font-family:'DM Serif Display',serif;
  font-size:52px; font-weight:400; color:${T.blueLt};
  line-height:1; margin-bottom:.5rem;
}
.trust-label {
  font-size:12px; font-weight:400; letter-spacing:.8px;
  color:rgba(244,239,230,.36);
}
.trust-sub {
  font-size:12px; font-weight:300; line-height:1.65;
  color:rgba(244,239,230,.2); margin-top:.4rem;
}

/* ════════════════════════════
   FINAL CTA
════════════════════════════ */
.cta-wrap {
  background:${T.navyMid};
  border-top:1px solid ${T.divider};
  padding:9rem 5rem;
  position:relative; overflow:hidden; text-align:center;
}
.cta-radial {
  position:absolute; inset:0;
  background:radial-gradient(ellipse 55% 55% at 50% 50%, rgba(59,125,216,.07) 0%, transparent 70%);
  pointer-events:none;
}
.cta-ghost {
  position:absolute; left:50%; top:50%;
  transform:translate(-50%,-50%);
  font-family:'DM Serif Display',serif;
  font-size:clamp(60px,10vw,140px);
  font-weight:400; color:transparent;
  -webkit-text-stroke:1px rgba(59,125,216,.03);
  white-space:nowrap; user-select:none; pointer-events:none;
  letter-spacing:-4px;
  width:100%; text-align:center;
}
.cta-h2 {
  font-family:'DM Serif Display',serif;
  font-size:clamp(36px,5vw,68px);
  font-weight:400; letter-spacing:-.8px; line-height:1.1;
  color:${T.cream}; margin-bottom:1.1rem; position:relative;
}
.cta-h2 em { font-style:italic; color:${T.blue}; }
.cta-p {
  font-size:14px; font-weight:300;
  color:rgba(244,239,230,.33);
  margin-bottom:2.75rem; position:relative;
  max-width:360px; margin-left:auto; margin-right:auto;
  line-height:1.88;
}
.cta-note {
  font-size:12px; font-weight:300;
  color:rgba(244,239,230,.18);
  margin-top:1.1rem; position:relative;
}

/* ════════════════════════════
   FOOTER
════════════════════════════ */
.footer {
  background:${T.navyDeep};
  border-top:1px solid ${T.divider};
  padding:2.75rem 5rem;
}
.foot-inner {
  max-width:1100px; margin:0 auto;
  display:flex; justify-content:space-between;
  align-items:center; flex-wrap:wrap; gap:1.25rem;
}
.foot-logo {
  font-family:'DM Serif Display',serif;
  font-size:18px; color:rgba(244,239,230,.45);
}
.foot-logo em { font-style:normal; color:${T.blue}; }
.foot-links { display:flex; gap:1.75rem; flex-wrap:wrap; }
.foot-links a {
  font-size:10px; letter-spacing:1.8px; text-transform:uppercase;
  font-weight:400; color:rgba(244,239,230,.18);
  text-decoration:none; transition:color .2s;
}
.foot-links a:hover { color:${T.blue}; }
.foot-copy { font-size:11px; color:rgba(244,239,230,.12); }

/* ════════════════════════════
   RESPONSIVE
════════════════════════════ */
@media (max-width:1024px) {
  .nav { padding:1.1rem 3rem; }
  .hero { padding:8rem 3rem 5rem; gap:3rem; }
  .sect { padding:5.5rem 3rem; }
  .trust-sect { padding:4rem 3rem; }
  .cta-wrap { padding:7rem 3rem; }
  .footer { padding:2.5rem 3rem; }
  .how-layout { gap:3.5rem; }
}

@media (max-width:768px) {
  .nav-links { display:none; }
  .nav-burger { display:flex; }
  .nav { padding:1rem 1.5rem; }

  /* hero stacks to single column */
  .hero {
    grid-template-columns:1fr;
    padding:6.5rem 1.5rem 4rem;
    min-height:100svh;
  }
  .hero-body { max-width:100%; }
  .hero-bg { display:none; }
  .hero-stats { display:none; }
  .hero-h1 {
    font-size:clamp(40px,9vw,60px);
    letter-spacing:-1px;
    line-height:1.06;
  }
  .hero-sub { font-size:14px; max-width:100%; }

  .sect { padding:4.5rem 1.5rem; }
  .sect-h2 { font-size:clamp(26px,6vw,36px); }

  .info-grid { grid-template-columns:1fr; }
  .info-panel { padding:2.5rem 2rem; }
  .info-body { max-width:100%; }

  .how-layout { grid-template-columns:1fr; gap:2.5rem; }
  .how-pin { position:static; }
  .how-step { grid-template-columns:40px 1fr; gap:1.1rem; padding:1.75rem 0; }
  .how-n { font-size:22px; }
  .how-title { font-size:19px; }

  .trust-inner { grid-template-columns:1fr; }
  .trust-cell {
    border-right:none;
    border-bottom:1px solid ${T.divider};
  }
  .trust-cell:last-child { border-bottom:none; }
  .trust-sect { padding:3.5rem 1.5rem; }

  .cta-wrap { padding:5.5rem 1.5rem; }
  .cta-ghost { display:none; }

  .footer { padding:2rem 1.5rem; }
  .foot-inner { flex-direction:column; align-items:flex-start; gap:1.5rem; }
  .foot-copy { order:3; }
}

@media (max-width:400px) {
  .hero-h1 { font-size:36px; }
  .nav-name { font-size:16px; }
  .btn-solid { padding:13px 28px; font-size:10px; }
  .info-panel { padding:2rem 1.25rem; }
  .foot-links { gap:1rem; }
}
`;

export default function CastingHome() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const glowRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const fn = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + "px";
        glowRef.current.style.top  = e.clientY + "px";
      }
    };
    if (window.matchMedia("(pointer:fine)").matches) {
      window.addEventListener("mousemove", fn, { passive: true });
      return () => window.removeEventListener("mousemove", fn);
    }
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const suf = el.dataset.suffix || "";
        const dur = 1300;
        const t0  = performance.now();
        const run = (now) => {
          const p    = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(ease * end) + suf;
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, menuOpen ? 200 : 0);
  };

  const goToJoin = () => {
    setMenuOpen(false);
    window.location.href = "/join";
  };

  const steps = [
    {
      n: "I",
      title: "Build your profile",
      body: "Actors submit name, age, height, three-angle photos, a bilingual two-minute intro video, and a social handle. Producers describe project type, role, and the kind of person they're looking for.",
    },
    {
      n: "II",
      title: "We receive everything",
      body: "Every submission lands in our database and inbox simultaneously. Producer payment is confirmed before curation begins — nothing is rushed.",
    },
    {
      n: "III",
      title: "Hand-curated by our team",
      body: "We read each brief against every actor in our database — film type, age range, gender, experience, character feel — and build a considered shortlist. No algorithm.",
    },
    {
      n: "IV",
      title: "Delivered within 24 hours",
      body: "Producers receive a polished catalogue of matched profiles by email. From there, every creative decision belongs to you.",
    },
  ];

  const trust = [
    { n: 500, s: "+", label: "Registered Actors", sub: "Growing every week"     },
    { n: 120, s: "+", label: "Casting Calls",     sub: "Film, TV & advertising" },
    { n: 80,  s: "+", label: "Productions",       sub: "Delivered on time"      },
  ];

  const panels = [
    {
      icon: "🎭",
      title: "For Actors",
      body: "Build your profile once. Upload three-angle photos and a bilingual two-minute intro — and let the right productions find you. Always free to register.",
      feats: [
        "3-angle professional photos",
        "Bilingual intro video",
        "Experience & credits",
        "Free — no expiry",
      ],
    },
    {
      icon: "🎬",
      title: "For Producers",
      body: "Tell us what you need — film type, age group, gender, character feel. We read your brief and deliver a hand-curated shortlist within 24 hours.",
      feats: [
        "Submit a casting brief",
        "Specify role type & feel",
        "Hand-picked actor profiles",
        "Email delivery in 24 hrs",
      ],
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div id="glow" ref={glowRef} />

      {/* ── MOBILE DRAWER ── */}
      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        <button className="drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        <a href="#who" onClick={() => scrollTo("who")}>Who it's for</a>
        <a href="#how" onClick={() => scrollTo("how")}>How it works</a>
        <button className="drawer-cta" onClick={goToJoin}>Join now</button>
      </div>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " on" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("hero")}>
          <div className="nav-mark">
            {imgError ? (
              <div className="nav-mark-fallback"><span>C</span></div>
            ) : (
              <img  
                src="/Logo.png"
                alt="Casting.Home"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <span className="nav-name">Casting<em>.Home</em></span>
        </div>

        <div className="nav-links">
          <a className="nav-link" href="#who" onClick={(e) => { e.preventDefault(); scrollTo("who"); }}>
            Who it's for
          </a>
          <a className="nav-link" href="#how" onClick={(e) => { e.preventDefault(); scrollTo("how"); }}>
            How it works
          </a>
          <button className="nav-cta" onClick={goToJoin}>
            <span>Join now</span>
          </button>
        </div>

        <button className="nav-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-bar" />
        <div className="hero-glow" />
        <div className="hero-bg" aria-hidden="true">CH</div>

        {/* left column */}
        <div className="hero-body">
          <div className="hero-over">
            <span className="hero-over-line" />
            Nepal's casting platform · Est. 2026
            <span className="hero-over-line" />
          </div>

          <h1 className="hero-h1">
            Where <em>talent</em><br />
            meets the <span className="uw">lens</span>
          </h1>

          <p className="hero-sub">
            Connecting actors and producers across Nepal —
            curated by hand, never by algorithm.
          </p>

          <div className="hero-btn-wrap">
            <button className="btn-solid" onClick={goToJoin}>
              Join now
            </button>
          </div>
        </div>

        {/* right column — stats */}
        <div className="hero-stats">
          {[
            { n: 500, s: "+", l: "Registered Actors" },
            { n: 120, s: "+", l: "Casting Calls"     },
            { n: 80,  s: "+", l: "Productions"       },
          ].map((s) => (
            <div className="h-stat" key={s.l}>
              <span className="h-stat-n" data-count={s.n} data-suffix={s.s}>
                {s.n}{s.s}
              </span>
              <div className="h-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="sect" id="who">
        <div className="sect-inner">
          <div className="reveal">
            <div className="eyebrow">Who it's for</div>
            <h2 className="sect-h2">
              Built for both sides<br />of the <em>camera</em>
            </h2>
            <p className="sect-p">
              Whether you're in front of the lens or behind it, <br />
              Casting.Home is shaped around the way you actually work.
            </p>
          </div>

          <div className="info-grid">
            {panels.map((p, i) => (
              <div className={`info-panel reveal d${i + 1}`} key={p.title}>
                <div className="info-icon">{p.icon}</div>
                <div className="info-title">{p.title}</div>
                <p className="info-body">{p.body}</p>
                <div className="info-feats">
                  {p.feats.map((f) => (
                    <div className="info-feat" key={f}>
                      <span className="info-feat-dash">—</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="sect how-bg" id="how">
        <div className="sect-inner">
          <div className="how-layout">
            <div className="how-pin reveal">
              <div className="eyebrow">The process</div>
              <h2 className="sect-h2">How it <em>works</em></h2>
              <p className="sect-p">
                No algorithm, no automated matching. Just careful human
                reading of every brief — the way great casting has
                always worked.
              </p>
            </div>

            <div className="how-steps">
              {steps.map((s, i) => (
                <div className={`how-step reveal d${i + 1}`} key={s.n}>
                  <div className="how-n">{s.n}</div>
                  <div>
                    <div className="how-title">{s.title}</div>
                    <p className="how-body">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="trust-sect">
        <div className="trust-inner">
          {trust.map((t) => (
            <div className="trust-cell reveal" key={t.label}>
              <div className="trust-num" data-count={t.n} data-suffix={t.s}>
                {t.n}{t.s}
              </div>
              <div className="trust-label">{t.label}</div>
              <div className="trust-sub">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="cta-wrap">
        <div className="cta-radial" />
        <div className="cta-ghost" aria-hidden="true">Casting.Home</div>

        <h2 className="cta-h2 reveal">
          Ready to get<br /><em>started?</em>
        </h2>
        <p className="cta-p reveal d1">
          Nepal's growing community of actors and producers.
          Human curation. 24-hour delivery.
        </p>
        <div className="reveal d2">
          <button className="btn-solid" onClick={goToJoin}>
            Join now
          </button>
        </div>
        <p className="cta-note reveal d3">
          Takes less than 5 minutes. Actors join free.
        </p>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="foot-inner">
          <div className="foot-logo">Casting<em>.Home</em></div>
          <div className="foot-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <div className="foot-copy">© 2026 Casting.Home · Kathmandu, Nepal</div>
        </div>
      </footer>
    </>
  );
}
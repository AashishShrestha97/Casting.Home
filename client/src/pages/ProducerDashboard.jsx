import { useState, useEffect, useMemo } from "react";
import { getSession, clearSession } from "../lib/api";

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
  blueDim:  "rgba(59,125,216,0.16)",
  divider:  "rgba(244,239,230,0.08)",
  faint:    "rgba(244,239,230,0.05)",
  green:    "#4a9b6f",
  greenPale:"rgba(74,155,111,0.12)",
  red:      "#c9615f",
  redPale:  "rgba(201,97,95,0.1)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500&display=swap');

*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html,body { height:100%; }

body {
  font-family:'Outfit',sans-serif;
  background:${T.navy};
  color:${T.cream};
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}

::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-track { background:${T.navy}; }
::-webkit-scrollbar-thumb { background:rgba(59,125,216,.4); border-radius:2px; }

@keyframes fadeUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
@keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
@keyframes shimmer { from{background-position:-500px 0;} to{background-position:500px 0;} }
@keyframes dotPulse { 0%,100%{opacity:.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.25);} }
@keyframes toastIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
@keyframes spin { to{transform:rotate(360deg);} }

/* ════════════ LAYOUT ════════════ */
.pd-layout { display:grid; grid-template-columns:220px 1fr; min-height:100vh; }

/* ════════════ SIDEBAR ════════════ */
.pd-sidebar {
  background:${T.navyCard}; border-right:1px solid ${T.divider};
  display:flex; flex-direction:column;
  position:sticky; top:0; height:100vh; overflow-y:auto; z-index:100;
  animation:fadeIn .5s ease both;
}
.pd-logo {
  padding:1.6rem 1.5rem 1.4rem; border-bottom:1px solid ${T.divider};
  display:flex; align-items:center; gap:11px; cursor:pointer; flex-shrink:0;
}
.pd-logo-mark {
  width:32px; height:32px; border:1px solid rgba(59,125,216,.38);
  display:flex; align-items:center; justify-content:center; flex-shrink:0; position:relative;
}
.pd-logo-mark::after { content:''; position:absolute; inset:3px; border:1px solid rgba(59,125,216,.1); }
.pd-logo-mark span { font-family:'DM Serif Display',serif; font-size:16px; color:${T.blue}; position:relative; z-index:1; }
.pd-logo-name { font-family:'DM Serif Display',serif; font-size:17px; color:${T.cream}; letter-spacing:.1px; }
.pd-logo-name em { font-style:normal; color:${T.blue}; }

.pd-prod-card { padding:1.4rem 1.5rem; border-bottom:1px solid ${T.divider}; flex-shrink:0; }
.pd-avatar {
  width:48px; height:48px; border-radius:50%; border:1px solid ${T.blueDim}; background:${T.bluePale};
  display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:.75rem;
}
.pd-prod-name {
  font-family:'DM Serif Display',serif; font-size:15px; font-weight:400; color:${T.cream};
  margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.pd-prod-role { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:${T.blue}; opacity:.7; }

.pd-stats { padding:1.1rem 1.5rem; border-bottom:1px solid ${T.divider}; flex-shrink:0; display:flex; gap:1rem; }
.pd-stat { flex:1; }
.pd-stat-num { font-family:'DM Serif Display',serif; font-size:20px; color:${T.blueLt}; line-height:1; margin-bottom:4px; }
.pd-stat-lbl { font-size:9.5px; letter-spacing:1px; text-transform:uppercase; color:rgba(244,239,230,.28); }

.pd-nav { flex:1; padding:.75rem 0; overflow-y:auto; }
.pd-nav-section { padding:.5rem 1.5rem .3rem; font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(244,239,230,.18); margin-top:.4rem; }
.pd-nav-item {
  display:flex; align-items:center; gap:10px; padding:9px 1.5rem;
  font-size:13px; font-weight:400; color:rgba(244,239,230,.4);
  cursor:pointer; transition:color .2s,background .2s; border-left:2px solid transparent; position:relative;
}
.pd-nav-item:hover { color:rgba(244,239,230,.7); background:${T.faint}; }
.pd-nav-item.on { color:${T.blueLt}; background:${T.bluePale}; border-left-color:${T.blue}; }
.pd-nav-icon { font-size:14px; width:16px; text-align:center; flex-shrink:0; }
.pd-nav-badge { margin-left:auto; background:${T.blue}; color:#fff; font-size:10px; font-weight:500; padding:1px 7px; letter-spacing:.3px; }

.pd-sidebar-foot { padding:1.1rem 1.5rem; border-top:1px solid ${T.divider}; flex-shrink:0; }
.pd-signout {
  display:flex; align-items:center; gap:8px; font-size:12px; font-weight:300; color:rgba(244,239,230,.25);
  background:none; border:none; cursor:pointer; font-family:'Outfit',sans-serif; transition:color .2s; padding:0; letter-spacing:.3px;
}
.pd-signout:hover { color:rgba(200,80,80,.8); }

/* ════════════ MOBILE MENU ════════════ */
.pd-mobile-toggle {
  display:none; align-items:center; justify-content:center; padding:0; background:none;
  border:none; color:${T.cream}; cursor:pointer; font-size:22px; width:44px; height:44px;
  flex-shrink:0; transition:color .2s; border-radius:4px;
}
.pd-mobile-toggle:hover { color:${T.blueLt}; background:rgba(59,125,216,.1); }
.pd-mobile-toggle:active { transform:scale(0.95); }
.pd-mobile-overlay {
  display:none; position:fixed; top:0; left:0; right:0; bottom:0; 
  background:rgba(0,0,0,.5); z-index:140; backdrop-filter:blur(2px);
}
.pd-mobile-overlay.open { display:block; }

/* ════════════ MAIN ════════════ */
.pd-main { display:flex; flex-direction:column; min-height:100vh; overflow-x:hidden; }
.pd-topbar {
  padding:1.1rem 2.5rem; border-bottom:1px solid ${T.divider};
  display:flex; justify-content:flex-start; align-items:center;
  background:${T.navy}; position:sticky; top:0; z-index:50; animation:fadeIn .5s ease both; gap:1rem;
}
.pd-topbar-title { font-family:'DM Serif Display',serif; font-size:22px; font-weight:400; color:${T.cream}; white-space:nowrap; flex:1; }
.pd-topbar-title em { font-style:italic; color:${T.blue}; }
.pd-topbar-actions { display:flex; align-items:center; gap:.85rem; flex-shrink:0; margin-left:auto; }

.btn-ghost-sm {
  display:flex; align-items:center; gap:7px; padding:8px 18px; border:1px solid ${T.divider}; background:transparent;
  font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:1.6px; text-transform:uppercase;
  font-weight:400; color:rgba(244,239,230,.45); cursor:pointer; transition:border-color .22s,color .22s;
}
.btn-ghost-sm:hover { border-color:rgba(59,125,216,.4); color:${T.cream}; }

.btn-solid-sm {
  position:relative; overflow:hidden; padding:8px 20px; background:${T.blue}; border:none;
  font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:1.6px; text-transform:uppercase;
  font-weight:500; color:#fff; cursor:pointer; transition:transform .24s,box-shadow .24s;
}
.btn-solid-sm::after {
  content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);
  background-size:500px 100%; opacity:0; transition:opacity .24s;
}
.btn-solid-sm:hover { transform:translateY(-1px); box-shadow:0 10px 30px rgba(59,125,216,.28); }
.btn-solid-sm:hover::after { opacity:1; animation:shimmer .7s linear; }
.btn-solid-sm:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }

.btn-danger-sm {
  padding:8px 20px; background:transparent; border:1px solid rgba(201,97,95,.4);
  font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:1.6px; text-transform:uppercase;
  font-weight:500; color:${T.red}; cursor:pointer; transition:background .22s,border-color .22s;
}
.btn-danger-sm:hover { background:${T.redPale}; border-color:${T.red}; }

/* ════════════ CONTENT ════════════ */
.pd-content { padding:2.25rem 2.5rem; flex:1; animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .08s both; }

.pd-alert {
  display:flex; align-items:flex-start; gap:12px; padding:1rem 1.4rem;
  border:1px solid rgba(59,125,216,.2); background:${T.bluePale}; margin-bottom:2rem;
  font-size:13px; font-weight:300; color:rgba(244,239,230,.5); line-height:1.6;
}
.pd-alert-icon { font-size:14px; flex-shrink:0; margin-top:1px; }
.pd-alert strong { color:${T.blueLt}; font-weight:500; }

/* ════════════ SECTION CARD ════════════ */
.pd-section { background:${T.navyCard}; border:1px solid ${T.divider}; margin-bottom:1.25rem; overflow:hidden; transition:border-color .28s; }
.pd-section:hover { border-color:rgba(59,125,216,.18); }
.pd-section-head {
  display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.6rem;
  border-bottom:1px solid transparent; cursor:pointer; user-select:none; transition:background .22s;
}
.pd-section-head:hover { background:${T.faint}; }
.pd-section-head.open { border-bottom-color:${T.divider}; }
.pd-section-left { display:flex; align-items:center; gap:12px; }
.pd-section-icon-box {
  width:36px; height:36px; border:1px solid ${T.divider};
  display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0;
  transition:border-color .25s,background .25s;
}
.pd-section-head:hover .pd-section-icon-box, .pd-section-head.open .pd-section-icon-box {
  border-color:rgba(59,125,216,.3); background:${T.bluePale};
}
.pd-section-title { font-family:'DM Serif Display',serif; font-size:16px; font-weight:400; color:${T.cream}; margin-bottom:2px; }
.pd-section-sub { font-size:11px; font-weight:300; color:rgba(244,239,230,.28); }
.pd-section-right { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.pd-status-dot { width:6px; height:6px; border-radius:50%; }
.pd-status-dot.done { background:#4a9b6f; }
.pd-status-dot.partial { background:${T.blue}; animation:dotPulse 2.5s ease-in-out infinite; }
.pd-status-dot.empty { background:rgba(244,239,230,.12); }
.pd-status-text { font-size:10px; letter-spacing:.5px; color:rgba(244,239,230,.25); }
.pd-chevron { font-size:10px; color:rgba(244,239,230,.2); transition:transform .28s cubic-bezier(.22,1,.36,1); }
.pd-chevron.open { transform:rotate(180deg); }
.pd-section-body { padding:1.6rem; }

/* ════════════ FORM ELEMENTS ════════════ */
.pd-field { margin-bottom:1.1rem; }
.pd-field:last-child { margin-bottom:0; }
.pd-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.1rem; }
.pd-grid-2:last-child { margin-bottom:0; }
.pd-label { display:block; font-size:10px; letter-spacing:2px; text-transform:uppercase; font-weight:500; color:rgba(244,239,230,.3); margin-bottom:6px; }
.pd-optional { text-transform:none; letter-spacing:0; font-weight:300; color:rgba(244,239,230,.2); }
.pd-input {
  width:100%; padding:10px 12px; background:${T.navyMid}; border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:300; color:${T.cream}; outline:none;
  transition:border-color .22s,background .22s; -webkit-font-smoothing:antialiased;
}
.pd-input::placeholder { color:rgba(244,239,230,.18); }
.pd-input:focus { border-color:rgba(59,125,216,.5); background:${T.navyLite}; }
.pd-input:disabled { color:rgba(244,239,230,.35); cursor:not-allowed; }
.pd-textarea {
  width:100%; padding:10px 12px; background:${T.navyMid}; border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:300; color:${T.cream}; outline:none;
  resize:vertical; min-height:100px; line-height:1.7; transition:border-color .22s,background .22s;
}
.pd-textarea::placeholder { color:rgba(244,239,230,.18); }
.pd-textarea:focus { border-color:rgba(59,125,216,.5); background:${T.navyLite}; }
.pd-hint { font-size:11px; font-weight:300; color:rgba(244,239,230,.22); margin-top:.5rem; line-height:1.6; }
.pd-error { font-size:11px; font-weight:400; color:${T.red}; margin-top:.5rem; }

/* ════════════ CHIP SELECTORS ════════════ */
.pd-chips { display:flex; flex-wrap:wrap; gap:.5rem; }
.pd-chip {
  padding:8px 15px; border:1px solid ${T.divider}; background:transparent;
  font-family:'Outfit',sans-serif; font-size:12px; font-weight:400; color:rgba(244,239,230,.45);
  cursor:pointer; transition:all .2s; white-space:nowrap;
}
.pd-chip:hover { border-color:rgba(59,125,216,.4); color:${T.cream}; }
.pd-chip.on { border-color:${T.blue}; color:${T.blueLt}; background:${T.bluePale}; }

/* ════════════ CALL FORM ════════════ */
.pd-callform { animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both; }
.pd-callform-actions { display:flex; justify-content:flex-end; gap:.75rem; margin-top:1.5rem; padding-top:1.4rem; border-top:1px solid ${T.divider}; }

/* ════════════ CASTING CALLS ════════════ */
.pd-cc-toolbar { display:flex; gap:.85rem; margin-bottom:1.5rem; flex-wrap:wrap; }
.pd-cc-search { flex:1; min-width:200px; }
.pd-cc-filters { display:flex; gap:.5rem; flex-wrap:wrap; }
.pd-cc-filter-btn {
  padding:8px 16px; border:1px solid ${T.divider}; background:transparent;
  font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:1px; text-transform:uppercase;
  color:rgba(244,239,230,.4); cursor:pointer; transition:all .2s; white-space:nowrap;
}
.pd-cc-filter-btn:hover { border-color:rgba(59,125,216,.35); color:${T.cream}; }
.pd-cc-filter-btn.on { border-color:${T.blue}; color:${T.blueLt}; background:${T.bluePale}; }

.pd-cc-grid { display:flex; flex-direction:column; gap:1rem; }
.pd-cc-card { background:${T.navyCard}; border:1px solid ${T.divider}; padding:1.5rem 1.75rem; transition:border-color .25s; }
.pd-cc-card:hover { border-color:rgba(59,125,216,.22); }
.pd-cc-card.closed { opacity:.55; }
.pd-cc-top { display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; margin-bottom:.75rem; }
.pd-cc-title-wrap { flex:1; }
.pd-cc-title { font-family:'DM Serif Display',serif; font-size:17px; font-weight:400; color:${T.cream}; margin-bottom:3px; }
.pd-cc-role { font-size:12px; font-weight:300; color:${T.blueLt}; }
.pd-cc-badges { display:flex; gap:.5rem; flex-shrink:0; align-items:center; }
.pd-cc-type { font-size:10px; letter-spacing:1px; text-transform:uppercase; color:rgba(244,239,230,.4); border:1px solid ${T.divider}; padding:4px 10px; white-space:nowrap; }
.pd-cc-statusbadge { font-size:10px; letter-spacing:1px; text-transform:uppercase; padding:4px 10px; font-weight:500; white-space:nowrap; }
.pd-cc-statusbadge.open { color:${T.green}; border:1px solid rgba(74,155,111,.35); background:${T.greenPale}; }
.pd-cc-statusbadge.closed { color:rgba(244,239,230,.4); border:1px solid ${T.divider}; }
.pd-cc-meta { display:flex; gap:1.25rem; flex-wrap:wrap; font-size:12px; color:rgba(244,239,230,.35); margin-bottom:.85rem; }
.pd-cc-meta span { display:flex; align-items:center; gap:5px; }
.pd-cc-desc { font-size:13px; font-weight:300; line-height:1.7; color:rgba(244,239,230,.5); margin-bottom:1rem; }
.pd-cc-tags { display:flex; gap:.4rem; flex-wrap:wrap; margin-bottom:1.1rem; }
.pd-cc-tag { font-size:10px; letter-spacing:.5px; padding:3px 9px; background:${T.faint}; border:1px solid ${T.divider}; color:rgba(244,239,230,.4); }
.pd-cc-foot { display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; padding-top:1rem; border-top:1px solid ${T.divider}; }
.pd-cc-subs { font-size:11.5px; color:rgba(244,239,230,.3); }
.pd-cc-subs strong { color:rgba(244,239,230,.55); font-weight:500; }
.pd-cc-actions { display:flex; gap:.5rem; }
.pd-cc-iconbtn {
  padding:6px 14px; border:1px solid ${T.divider}; background:transparent;
  font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:.5px;
  color:rgba(244,239,230,.45); cursor:pointer; transition:all .2s;
}
.pd-cc-iconbtn:hover { border-color:rgba(59,125,216,.4); color:${T.cream}; }
.pd-cc-iconbtn.danger:hover { border-color:rgba(201,97,95,.5); color:${T.red}; background:${T.redPale}; }
.pd-cc-empty { text-align:center; padding:3.5rem 1rem; color:rgba(244,239,230,.28); font-size:13px; }
.pd-cc-empty-cta { margin-top:1.2rem; }

/* ════════════ SUBMISSIONS ════════════ */
.pd-sub-card { background:${T.navyCard}; border:1px solid ${T.divider}; padding:1.3rem 1.6rem; margin-bottom:1rem; }
.pd-sub-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:.6rem; gap:1rem; }
.pd-sub-title { font-family:'DM Serif Display',serif; font-size:15px; font-weight:400; color:${T.cream}; }
.pd-sub-count { font-size:11px; letter-spacing:1px; text-transform:uppercase; color:rgba(244,239,230,.3); }
.pd-sub-empty { font-size:12.5px; font-weight:300; color:rgba(244,239,230,.32); line-height:1.6; }

/* ════════════ MODAL ════════════ */
.pd-modal-bg {
  position:fixed; inset:0; z-index:200; background:rgba(4,10,20,.88);
  backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  display:flex; align-items:center; justify-content:center; padding:2rem; animation:fadeIn .28s ease both;
}
.pd-modal { background:${T.navyCard}; border:1px solid ${T.divider}; width:100%; max-width:440px; max-height:85vh; overflow-y:auto; animation:fadeUp .35s cubic-bezier(.22,1,.36,1) both; }
.pd-modal-head { padding:1.3rem 1.6rem; border-bottom:1px solid ${T.divider}; display:flex; justify-content:space-between; align-items:center; }
.pd-modal-title { font-family:'DM Serif Display',serif; font-size:18px; font-weight:400; color:${T.cream}; }
.pd-modal-close { background:none; border:none; color:rgba(244,239,230,.25); font-size:18px; cursor:pointer; transition:color .2s; padding:0; line-height:1; }
.pd-modal-close:hover { color:${T.cream}; }
.pd-modal-body { padding:1.75rem; font-size:13px; font-weight:300; color:rgba(244,239,230,.55); line-height:1.7; }
.pd-modal-actions { display:flex; justify-content:flex-end; gap:.75rem; margin-top:1.5rem; }

/* ════════════ TOAST ════════════ */
.pd-toast {
  position:fixed; bottom:2rem; right:2rem; z-index:300; display:flex; align-items:center; gap:9px;
  padding:11px 18px; background:${T.navyCard}; border:1px solid rgba(74,155,111,.35);
  font-size:12px; font-weight:300; color:rgba(150,210,170,.9); letter-spacing:.3px;
  animation:toastIn .35s cubic-bezier(.22,1,.36,1) both; box-shadow:0 8px 32px rgba(0,0,0,.4);
}
.pd-toast.err { border-color:rgba(201,97,95,.4); color:rgba(230,160,158,.95); }

/* ════════════ MESSAGES ════════════ */
.pd-msg-layout { display:grid; grid-template-columns:280px 1fr; background:${T.navyCard}; border:1px solid ${T.divider}; height:calc(100vh - 180px); min-height:420px; }
.pd-msg-list { border-right:1px solid ${T.divider}; overflow-y:auto; }
.pd-msg-item { display:flex; gap:.75rem; padding:1rem 1.25rem; border-bottom:1px solid ${T.divider}; cursor:pointer; transition:background .2s; position:relative; }
.pd-msg-item:hover { background:${T.faint}; }
.pd-msg-item.on { background:${T.bluePale}; }
.pd-msg-avatar { width:38px; height:38px; border-radius:50%; flex-shrink:0; border:1px solid ${T.blueDim}; background:${T.bluePale}; display:flex; align-items:center; justify-content:center; font-size:16px; }
.pd-msg-info { flex:1; min-width:0; }
.pd-msg-name { font-size:13px; font-weight:500; color:${T.cream}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px; }
.pd-msg-role { font-size:10.5px; color:rgba(244,239,230,.32); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px; }
.pd-msg-preview { font-size:11.5px; color:rgba(244,239,230,.42); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pd-msg-dot { width:8px; height:8px; border-radius:50%; background:${T.blue}; position:absolute; top:1.15rem; right:1rem; }
.pd-thread { display:flex; flex-direction:column; height:100%; }
.pd-thread-head { padding:1.1rem 1.5rem; border-bottom:1px solid ${T.divider}; display:flex; align-items:center; gap:.75rem; flex-shrink:0; }
.pd-thread-body { flex:1; overflow-y:auto; padding:1.5rem; display:flex; flex-direction:column; gap:.9rem; }
.pd-bubble { max-width:65%; padding:10px 14px; font-size:13px; font-weight:300; line-height:1.6; }
.pd-bubble.them { align-self:flex-start; background:${T.navyMid}; border:1px solid ${T.divider}; color:rgba(244,239,230,.75); }
.pd-bubble.me { align-self:flex-end; background:${T.blue}; color:#fff; }
.pd-bubble-time { font-size:10px; margin-top:4px; opacity:.5; }
.pd-thread-empty { flex:1; display:flex; align-items:center; justify-content:center; color:rgba(244,239,230,.25); font-size:13px; }
.pd-thread-input { display:flex; gap:.6rem; padding:1rem 1.25rem; border-top:1px solid ${T.divider}; flex-shrink:0; }
.pd-thread-input input { flex:1; padding:10px 14px; background:${T.navyMid}; border:1px solid rgba(244,239,230,.07); color:${T.cream}; font-family:'Outfit',sans-serif; font-size:13px; outline:none; }
.pd-thread-input input:focus { border-color:rgba(59,125,216,.5); }

/* ════════════ SETTINGS ════════════ */
.pd-settings-section { background:${T.navyCard}; border:1px solid ${T.divider}; padding:1.6rem 1.75rem; margin-bottom:1.25rem; }
.pd-settings-title { font-family:'DM Serif Display',serif; font-size:16px; font-weight:400; color:${T.cream}; margin-bottom:.25rem; }
.pd-settings-sub { font-size:11.5px; font-weight:300; color:rgba(244,239,230,.32); margin-bottom:1.4rem; }
.pd-toggle-row { display:flex; justify-content:space-between; align-items:center; padding:.85rem 0; border-bottom:1px solid ${T.divider}; }
.pd-toggle-row:last-child { border-bottom:none; padding-bottom:0; }
.pd-toggle-row:first-child { padding-top:0; }
.pd-toggle-label { font-size:13px; color:rgba(244,239,230,.7); margin-bottom:2px; }
.pd-toggle-desc { font-size:11px; color:rgba(244,239,230,.3); }
.pd-switch { width:38px; height:21px; border-radius:11px; background:rgba(244,239,230,.1); border:1px solid ${T.divider}; position:relative; cursor:pointer; flex-shrink:0; transition:background .22s; }
.pd-switch.on { background:${T.blue}; border-color:${T.blue}; }
.pd-switch-knob { width:15px; height:15px; border-radius:50%; background:#fff; position:absolute; top:2px; left:2px; transition:transform .22s; }
.pd-switch.on .pd-switch-knob { transform:translateX(17px); }
.pd-danger-row { display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; }
.pd-danger-text { font-size:12.5px; color:rgba(244,239,230,.4); line-height:1.6; max-width:420px; }

/* ════════════ RESPONSIVE ════════════ */

/* ─ Tablet: 960px and below ─ */
@media(max-width:960px) {
  .pd-layout { grid-template-columns:1fr; }
  .pd-sidebar { 
    position:fixed; left:-220px; top:0; width:220px; height:100vh; 
    transition:left .3s cubic-bezier(.4,0,.2,1); z-index:160;
    box-shadow:4px 0 16px rgba(0,0,0,.5); overflow-y:auto;
  }
  .pd-sidebar.open { left:0; }
  .pd-main { position:relative; z-index:1; }
  .pd-content { padding:1.5rem; }
  .pd-topbar { padding:0.9rem 1.2rem; gap:0.5rem; }
  .pd-topbar-title { font-size:18px; }
  .pd-grid-2 { grid-template-columns:1fr; }
  .pd-msg-layout { grid-template-columns:1fr; height:auto; }
  .pd-msg-list { max-height:280px; border-right:none; border-bottom:1px solid ${T.divider}; }
  .pd-mobile-toggle { display:flex; }
  .pd-mobile-overlay { z-index:150; }
  .pd-cc-toolbar { flex-direction:column; gap:1rem; }
  .pd-cc-search { min-width:100%; }
  .pd-cc-filters { width:100%; overflow-x:auto; }
}

/* ─ Small tablet & large mobile: 768px and below ─ */
@media(max-width:768px) {
  .pd-content { padding:1.25rem; }
  .pd-topbar { padding:0.8rem 1rem; gap:0.4rem; }
  .pd-topbar-title { font-size:16px; flex:1; margin-right:0.5rem; }
  .pd-mobile-toggle { font-size:20px; width:40px; height:40px; }
  .pd-topbar-title em { font-style:italic; }
  .pd-section { margin-bottom:1rem; }
  .pd-section-head { padding:1rem 1.25rem; }
  .pd-section-body { padding:1.25rem; }
  .pd-cc-card { padding:1.25rem 1.5rem; }
  .pd-field { margin-bottom:0.9rem; }
  .pd-grid-2 { gap:0.75rem; }
  .pd-label { font-size:9px; }
  .pd-input, .pd-textarea { padding:9px 11px; font-size:13px; }
  .btn-solid-sm, .btn-ghost-sm, .btn-danger-sm { padding:7px 16px; font-size:10px; }
  .pd-alert { padding:0.85rem 1.2rem; gap:10px; font-size:12px; }
  .pd-sub-card { padding:1rem 1.35rem; }
  .pd-cc-top { gap:0.75rem; }
  .pd-cc-title { font-size:15px; }
  .pd-cc-meta { gap:0.85rem; font-size:11px; }
  .pd-cc-foot { gap:0.75rem; }
  .pd-cc-badges { gap:0.4rem; }
  .pd-cc-actions { flex-wrap:wrap; gap:0.4rem; }
  .pd-modal { max-width:90vw; }
  .pd-modal-body { padding:1.5rem; font-size:12.5px; }
  .pd-toast { bottom:1.5rem; right:1.5rem; padding:10px 15px; font-size:11px; }
}

/* ─ Mobile: 640px and below ─ */
@media(max-width:640px) {
  body { font-size:14px; }
  .pd-content { padding:1rem; }
  .pd-topbar { padding:0.7rem 0.9rem; gap:0.3rem; }
  .pd-topbar-title { font-size:15px; margin-right:0.3rem; }
  .pd-mobile-toggle { font-size:20px; width:40px; height:40px; }
  .pd-topbar-actions { gap:0.5rem; }
  .pd-topbar-actions .btn-ghost-sm { display:none; }
  .pd-section-head { padding:0.9rem 1rem; }
  .pd-section-body { padding:1rem; }
  .pd-cc-card { padding:1rem 1.25rem; }
  .pd-field { margin-bottom:0.8rem; }
  .pd-grid-2 { gap:0.65rem; margin-bottom:0.9rem; }
  .pd-label { font-size:8.5px; margin-bottom:5px; }
  .pd-input, .pd-textarea { padding:8px 10px; font-size:12px; min-height:38px; }
  .pd-textarea { min-height:90px; }
  .btn-solid-sm, .btn-ghost-sm, .btn-danger-sm { 
    padding:6px 14px; font-size:9px; min-height:36px; min-width:36px; 
  }
  .btn-solid-sm:hover { transform:none; }
  .pd-chips { gap:0.4rem; }
  .pd-chip { padding:6px 12px; font-size:11px; }
  .pd-callform-actions { flex-direction:column-reverse; gap:0.6rem; }
  .pd-callform-actions button { width:100%; }
  .pd-alert { padding:0.75rem 1rem; gap:8px; font-size:11.5px; margin-bottom:1.5rem; }
  .pd-cc-title { font-size:14px; }
  .pd-cc-role { font-size:11px; }
  .pd-cc-meta { gap:0.6rem; font-size:10px; flex-wrap:wrap; }
  .pd-cc-desc { font-size:12px; margin-bottom:0.85rem; }
  .pd-cc-tags { gap:0.3rem; margin-bottom:0.9rem; }
  .pd-cc-tag { font-size:9px; padding:2px 8px; }
  .pd-cc-foot { flex-direction:column; padding-top:0.85rem; border-top:1px solid ${T.divider}; }
  .pd-cc-subs { order:2; }
  .pd-cc-actions { order:1; width:100%; }
  .pd-cc-iconbtn { flex:1; padding:6px 10px; font-size:10px; min-height:36px; }
  .pd-sub-card { padding:0.9rem 1.1rem; }
  .pd-sub-head { flex-direction:column; gap:0.5rem; }
  .pd-modal { max-width:95vw; margin:0 1rem; }
  .pd-modal-head { padding:1rem 1.25rem; }
  .pd-modal-title { font-size:15px; }
  .pd-modal-body { padding:1.25rem; font-size:12px; }
  .pd-toggle-row { padding:0.7rem 0; }
  .pd-toggle-label { font-size:12px; }
  .pd-toggle-desc { font-size:10px; }
  .pd-danger-text { font-size:11.5px; }
  .pd-toast { bottom:1rem; right:1rem; padding:9px 13px; font-size:10.5px; gap:6px; }
  .pd-thread-input { padding:0.85rem 1rem; gap:0.5rem; }
  .pd-thread-input input { padding:8px 11px; font-size:12px; }
  .pd-bubble { max-width:80%; padding:8px 12px; font-size:12px; }
  .pd-msg-name { font-size:12px; }
  .pd-msg-role { font-size:10px; }
  .pd-msg-preview { font-size:10.5px; }
}

/* ─ Small mobile: 480px and below ─ */
@media(max-width:480px) {
  .pd-content { padding:0.85rem; }
  .pd-topbar { padding:0.65rem 0.75rem; gap:0.25rem; }
  .pd-topbar-title { font-size:13px; margin-right:0.25rem; }
  .pd-mobile-toggle { font-size:18px; width:38px; height:38px; }
  .pd-topbar-actions { gap:0.3rem; }
  .pd-section { margin-bottom:0.85rem; }
  .pd-section-head { padding:0.8rem 0.9rem; }
  .pd-section-left { gap:8px; }
  .pd-section-icon-box { width:32px; height:32px; font-size:13px; }
  .pd-section-title { font-size:14px; margin-bottom:1px; }
  .pd-section-sub { font-size:10px; }
  .pd-section-body { padding:0.9rem; }
  .pd-section-right { gap:6px; }
  .pd-cc-card { padding:0.9rem 1.1rem; }
  .pd-field { margin-bottom:0.7rem; }
  .pd-grid-2 { gap:0.5rem; margin-bottom:0.8rem; }
  .pd-label { font-size:8px; margin-bottom:4px; letter-spacing:1.5px; }
  .pd-input, .pd-textarea { padding:7px 9px; font-size:11.5px; }
  .pd-textarea { min-height:80px; }
  .btn-solid-sm, .btn-ghost-sm, .btn-danger-sm { 
    padding:5px 12px; font-size:8.5px; min-height:34px; letter-spacing:1px;
  }
  .pd-chips { gap:0.3rem; }
  .pd-chip { padding:5px 10px; font-size:10px; }
  .pd-cc-top { flex-direction:column; gap:0.5rem; margin-bottom:0.6rem; }
  .pd-cc-badges { width:100%; }
  .pd-cc-type, .pd-cc-statusbadge { font-size:9px; padding:3px 8px; }
  .pd-cc-meta { gap:0.5rem; font-size:9px; }
  .pd-cc-desc { font-size:11.5px; margin-bottom:0.7rem; line-height:1.5; }
  .pd-cc-tags { gap:0.25rem; margin-bottom:0.8rem; }
  .pd-cc-tag { font-size:8px; padding:2px 7px; }
  .pd-cc-iconbtn { font-size:9px; padding:5px 9px; min-height:34px; }
  .pd-alert { padding:0.7rem 0.9rem; gap:7px; font-size:11px; margin-bottom:1.25rem; }
  .pd-msg-list { max-height:240px; }
  .pd-msg-item { padding:0.8rem 1rem; gap:0.6rem; }
  .pd-msg-avatar { width:34px; height:34px; font-size:14px; }
  .pd-msg-name { font-size:11px; }
  .pd-msg-role { font-size:9px; }
  .pd-msg-preview { font-size:10px; }
  .pd-thread-head { padding:0.9rem 1rem; gap:0.6rem; }
  .pd-bubble { max-width:85%; padding:7px 11px; font-size:11px; }
  .pd-bubble-time { font-size:9px; }
  .pd-thread-input { padding:0.75rem 0.85rem; gap:0.4rem; }
  .pd-thread-input input { padding:7px 9px; font-size:11.5px; }
  .pd-modal { max-width:98vw; margin:0 0.5rem; }
  .pd-modal-head { padding:0.9rem 1.1rem; }
  .pd-modal-title { font-size:13px; }
  .pd-modal-close { font-size:16px; }
  .pd-modal-body { padding:1rem 1.1rem; font-size:11px; line-height:1.5; }
  .pd-modal-actions { gap:0.6rem; margin-top:1.2rem; }
  .pd-sub-card { padding:0.8rem 1rem; }
  .pd-sub-title { font-size:13px; }
  .pd-sub-count { font-size:10px; }
  .pd-sub-empty { font-size:11.5px; line-height:1.5; }
  .pd-toggle-row { padding:0.6rem 0; }
  .pd-toggle-label { font-size:11px; margin-bottom:2px; }
  .pd-toggle-desc { font-size:9.5px; }
  .pd-switch { width:36px; height:20px; }
  .pd-switch-knob { width:14px; height:14px; }
  .pd-switch.on .pd-switch-knob { transform:translateX(16px); }
  .pd-danger-text { font-size:11px; max-width:100%; line-height:1.5; }
  .pd-toast { bottom:0.85rem; right:0.85rem; padding:8px 11px; font-size:10px; gap:5px; }
}

/* ─ Extra small mobile: 360px and below ─ */
@media(max-width:360px) {
  .pd-content { padding:0.75rem; }
  .pd-topbar { padding:0.6rem 0.75rem; }
  .pd-topbar-title { font-size:12px; }
  .pd-section-head { padding:0.7rem 0.8rem; }
  .pd-section-body { padding:0.8rem; }
  .pd-cc-card { padding:0.8rem 1rem; }
  .pd-field { margin-bottom:0.65rem; }
  .pd-input, .pd-textarea { font-size:11px; }
  .pd-textarea { min-height:75px; }
  .btn-solid-sm, .btn-ghost-sm, .btn-danger-sm { 
    padding:4px 10px; font-size:8px; min-height:32px;
  }
  .pd-chip { padding:4px 9px; font-size:9px; }
  .pd-cc-top { gap:0.4rem; }
  .pd-alert { font-size:10px; }
  .pd-modal { max-width:100vw; border-radius:8px 8px 0 0; margin:0; }
  .pd-modal-bg { padding:1rem; }
  .pd-toast { bottom:0.75rem; right:0.75rem; padding:7px 10px; font-size:9px; }
}
`;

/* ── constants ── */
const PROJECT_TYPES = ["AD", "Short Film", "Feature Film", "Music Video", "YouTube/Social Media Content"];
const AGE_GROUPS    = ["Child Artist", "18-25", "25-35", "35-45", "45-60", "60+"];
const GENDERS       = ["Male", "Female", "Any"];
const ROLE_TYPES    = ["Lead", "Supporting", "Extras", "Crowd"];

const EMPTY_CALL = {
  title: "", projectType: "", ageGroups: [], gender: "", contactNumber: "",
  description: "", roleType: "", location: "", numberNeeded: "", deadline: "",
};

/* ── mock inbox (frontend-only placeholder data, actor → producer) ── */
const INITIAL_CONVERSATIONS = [
  {
    id: "m1", name: "Aarav Sharma", role: "Actor · applied to Lead Actress role", avatar: "🎭", unread: true,
    messages: [
      { from: "them", text: "Hi! I just submitted my profile for the lead role — really excited about the project.", time: "9:40 AM" },
      { from: "me",   text: "Thanks for applying! We'll review and get back to you this week.", time: "9:52 AM" },
    ],
  },
  {
    id: "m2", name: "Nisha Karki", role: "Actor · Short Film inquiry", avatar: "🎬", unread: false,
    messages: [
      { from: "them", text: "Could you share the shoot dates before I confirm my availability?", time: "Yesterday" },
    ],
  },
];

/* ── chip selector (single or multi) ── */
function ChipGroup({ options, value, onChange, multi = false }) {
  const isActive = (opt) => (multi ? value.includes(opt) : value === opt);
  const toggle = (opt) => {
    if (multi) {
      onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
    } else {
      onChange(opt);
    }
  };
  return (
    <div className="pd-chips">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`pd-chip${isActive(opt) ? " on" : ""}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ── collapsible section ── */
function Section({ icon, title, sub, defaultOpen = false, status = "empty", children }) {
  const [open, setOpen] = useState(defaultOpen);
  const statusMap = {
    done:    { dot: "done",    label: "Complete" },
    partial: { dot: "partial", label: "In progress" },
    empty:   { dot: "empty",   label: "Not started" },
  };
  const s = statusMap[status];
  return (
    <div className="pd-section">
      <div className={`pd-section-head${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
        <div className="pd-section-left">
          <div className="pd-section-icon-box">{icon}</div>
          <div>
            <div className="pd-section-title">{title}</div>
            <div className="pd-section-sub">{sub}</div>
          </div>
        </div>
        <div className="pd-section-right">
          <div className={`pd-status-dot ${s.dot}`} />
          <span className="pd-status-text">{s.label}</span>
          <span className={`pd-chevron${open ? " open" : ""}`}>▾</span>
        </div>
      </div>
      {open && <div className="pd-section-body">{children}</div>}
    </div>
  );
}

/* ── toggle switch ── */
function Switch({ on, onToggle }) {
  return (
    <div className={`pd-switch${on ? " on" : ""}`} onClick={onToggle}>
      <div className="pd-switch-knob" />
    </div>
  );
}

/* ── casting call create/edit form ── */
function CallForm({ initial, isEditing, onCancel, onSave }) {
  const [f, setF] = useState(initial);
  const [errs, setErrs] = useState({});
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.title.trim())                e.title         = "Project / role title is required";
    if (!f.projectType)                 e.projectType   = "Select what you're working on";
    if (!f.ageGroups.length)            e.ageGroups     = "Select at least one age group";
    if (!f.gender)                      e.gender        = "Select a gender preference";
    if (!f.roleType)                    e.roleType      = "Select a role type";
    if (!/^\d{10}$/.test(f.contactNumber)) e.contactNumber = "Enter a 10-digit contact number";
    if (!f.description.trim() || f.description.trim().length < 15)
      e.description = "Add a bit more detail (min 15 characters)";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({});
    onSave({
      ...f,
      title: f.title.trim(),
      location: f.location.trim(),
      contactNumber: f.contactNumber.trim(),
      description: f.description.trim(),
    });
  };

  return (
    <div className="pd-callform">
      <div className="pd-field">
        <label className="pd-label">Project / Role Title</label>
        <input className="pd-input" value={f.title} onChange={(e) => set("title")(e.target.value)}
          placeholder="e.g. Lead Actress — Short Film &quot;Monsoon&quot;" />
        {errs.title && <div className="pd-error">{errs.title}</div>}
      </div>

      <div className="pd-field">
        <label className="pd-label">What are you working on?</label>
        <ChipGroup options={PROJECT_TYPES} value={f.projectType} onChange={set("projectType")} />
        {errs.projectType && <div className="pd-error">{errs.projectType}</div>}
      </div>

      <div className="pd-field">
        <label className="pd-label">Age Group of Artist Wanted</label>
        <ChipGroup options={AGE_GROUPS} value={f.ageGroups} onChange={set("ageGroups")} multi />
        {errs.ageGroups && <div className="pd-error">{errs.ageGroups}</div>}
      </div>

      <div className="pd-grid-2">
        <div className="pd-field">
          <label className="pd-label">Gender</label>
          <ChipGroup options={GENDERS} value={f.gender} onChange={set("gender")} />
          {errs.gender && <div className="pd-error">{errs.gender}</div>}
        </div>
        <div className="pd-field">
          <label className="pd-label">Role of Artist</label>
          <ChipGroup options={ROLE_TYPES} value={f.roleType} onChange={set("roleType")} />
          {errs.roleType && <div className="pd-error">{errs.roleType}</div>}
        </div>
      </div>

      <div className="pd-grid-2">
        <div className="pd-field">
          <label className="pd-label">Contact Number</label>
          <input className="pd-input" type="tel" value={f.contactNumber}
            onChange={(e) => set("contactNumber")(e.target.value)} placeholder="98XXXXXXXX" />
          {errs.contactNumber && <div className="pd-error">{errs.contactNumber}</div>}
        </div>
        <div className="pd-field">
          <label className="pd-label">Location <span className="pd-optional">(optional)</span></label>
          <input className="pd-input" value={f.location} onChange={(e) => set("location")(e.target.value)}
            placeholder="Kathmandu" />
        </div>
      </div>

      <div className="pd-grid-2">
        <div className="pd-field">
          <label className="pd-label">Artists Needed <span className="pd-optional">(optional)</span></label>
          <input className="pd-input" type="number" min="1" value={f.numberNeeded}
            onChange={(e) => set("numberNeeded")(e.target.value)} placeholder="1" />
        </div>
        <div className="pd-field">
          <label className="pd-label">Application Deadline <span className="pd-optional">(optional)</span></label>
          <input className="pd-input" type="date" value={f.deadline}
            onChange={(e) => set("deadline")(e.target.value)} />
        </div>
      </div>

      <div className="pd-field">
        <label className="pd-label">Further Details</label>
        <textarea className="pd-textarea" value={f.description}
          onChange={(e) => set("description")(e.target.value)}
          placeholder="Describe the character, tone of the project, shoot dates, compensation, requirements..." />
        {errs.description && <div className="pd-error">{errs.description}</div>}
      </div>

      <div className="pd-callform-actions">
        <button className="btn-ghost-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-solid-sm" onClick={submit}>
          {isEditing ? "Save Changes" : "Post Casting Call"}
        </button>
      </div>
    </div>
  );
}

/* ── casting call card ── */
function CallCard({ call, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className={`pd-cc-card${call.status === "closed" ? " closed" : ""}`}>
      <div className="pd-cc-top">
        <div className="pd-cc-title-wrap">
          <div className="pd-cc-title">{call.title}</div>
          <div className="pd-cc-role">{call.roleType} role</div>
        </div>
        <div className="pd-cc-badges">
          <span className="pd-cc-type">{call.projectType}</span>
          <span className={`pd-cc-statusbadge ${call.status}`}>{call.status === "open" ? "Open" : "Closed"}</span>
        </div>
      </div>

      <div className="pd-cc-meta">
        {call.location && <span>📍 {call.location}</span>}
        <span>📞 {call.contactNumber}</span>
        {call.numberNeeded && <span>👥 {call.numberNeeded} needed</span>}
        {call.deadline && <span>🗓 Apply by <strong>{call.deadline}</strong></span>}
      </div>

      <div className="pd-cc-desc">{call.description}</div>

      <div className="pd-cc-tags">
        {call.ageGroups.map((g) => <span className="pd-cc-tag" key={g}>{g}</span>)}
        <span className="pd-cc-tag">{call.gender}</span>
      </div>

      <div className="pd-cc-foot">
        <div className="pd-cc-subs">
          <strong>{call.submissions || 0}</strong> submission{call.submissions === 1 ? "" : "s"}
        </div>
        <div className="pd-cc-actions">
          <button className="pd-cc-iconbtn" onClick={() => onToggleStatus(call.id)}>
            {call.status === "open" ? "Close call" : "Reopen"}
          </button>
          <button className="pd-cc-iconbtn" onClick={() => onEdit(call.id)}>Edit</button>
          <button className="pd-cc-iconbtn danger" onClick={() => onDelete(call.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── main component ── */
export default function ProducerDashboard() {
  const session = getSession();
  const uid = session?.user?.id ?? "guest";
  const profileKey = `ch_producer_profile:${uid}`;
  const callsKey   = `ch_producer_calls:${uid}`;
  const notifKey   = `ch_producer_notifications:${uid}`;

  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(profileKey) || "null");
    return saved || {
      companyName: session?.user?.company || "",
      contactName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
      website: "",
      about: "",
    };
  });

  const [calls, setCalls] = useState(() => JSON.parse(localStorage.getItem(callsKey) || "[]"));

  const [activeNav, setActiveNav] = useState("profile");
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState(null); // null | "new" | <callId>
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [ccSearch, setCcSearch] = useState("");
  const [ccFilter, setCcFilter] = useState("All");

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvo, setActiveConvo] = useState(null);
  const [draft, setDraft] = useState("");

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState("");
  const [notifs, setNotifs] = useState(() => {
    return JSON.parse(localStorage.getItem(notifKey) || "null") || {
      newApplicants: true, messages: true, email: true,
    };
  });
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteCallId, setDeleteCallId] = useState(null);

  useEffect(() => { localStorage.setItem(notifKey, JSON.stringify(notifs)); }, [notifs, notifKey]);
  useEffect(() => { localStorage.setItem(callsKey, JSON.stringify(calls)); }, [calls, callsKey]);

  const showToast = (msg, isErr = false) => {
    setToast({ msg, isErr });
    setTimeout(() => setToast(null), 3000);
  };

  const setP = (k) => (v) => setProfile((p) => ({ ...p, [k]: v }));
  const saveProfile = () => {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    showToast("✓ Company profile saved");
  };

  const handleSignOut = () => { clearSession(); window.location.href = "/"; };

  const addCall = (data) => {
    const newCall = { ...data, id: `call_${Date.now()}`, status: "open", createdAt: new Date().toISOString(), submissions: 0 };
    setCalls((prev) => [newCall, ...prev]);
    setFormMode(null);
    showToast("✓ Casting call posted");
  };

  const saveEditedCall = (id, data) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    setFormMode(null);
    showToast("✓ Casting call updated");
  };

  const toggleCallStatus = (id) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === "open" ? "closed" : "open" } : c)));
  };

  const removeCall = () => {
    setCalls((prev) => prev.filter((c) => c.id !== deleteCallId));
    setDeleteCallId(null);
    showToast("Casting call deleted");
  };

  const filteredCalls = useMemo(() => {
    return calls.filter((c) => {
      const matchesType = ccFilter === "All" || c.projectType === ccFilter;
      const q = ccSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        (c.location || "").toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [calls, ccSearch, ccFilter]);

  const openCallsCount = calls.filter((c) => c.status === "open").length;
  const totalSubmissions = calls.reduce((sum, c) => sum + (c.submissions || 0), 0);

  const sendMessage = () => {
    if (!draft.trim() || !activeConvo) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvo
          ? { ...c, unread: false, messages: [...c.messages, { from: "me", text: draft.trim(), time: "Now" }] }
          : c
      )
    );
    setDraft("");
  };

  const openConvo = (id) => {
    setActiveConvo(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  };

  const submitPasswordChange = () => {
    if (!pwForm.current) return setPwErr("Enter your current password");
    if (pwForm.next.length < 6) return setPwErr("New password must be at least 6 characters");
    if (pwForm.next !== pwForm.confirm) return setPwErr("New passwords don't match");
    setPwErr("");
    // Frontend-only for now — no backend endpoint to change password yet.
    setPwForm({ current: "", next: "", confirm: "" });
    showToast("✓ Password updated");
  };

  const confirmDeleteAccount = () => {
    setShowDeleteAccount(false);
    localStorage.removeItem(profileKey);
    localStorage.removeItem(callsKey);
    localStorage.removeItem(notifKey);
    clearSession();
    window.location.href = "/";
  };

  const NAV = [
    { id: "profile",     icon: "🏢", label: "Company Profile" },
    { id: "calls",       icon: "🎬", label: "Casting Calls", badge: openCallsCount ? String(openCallsCount) : null },
    { id: "submissions", icon: "📥", label: "Submissions", badge: totalSubmissions ? String(totalSubmissions) : null },
    { id: "messages",    icon: "✉️", label: "Messages", badge: conversations.some((c) => c.unread) ? String(conversations.filter((c) => c.unread).length) : null },
    { id: "settings",    icon: "⚙️", label: "Settings" },
  ];

  const TITLES = {
    profile: <>Company <em>Profile</em></>,
    calls: <>Casting <em>Calls</em></>,
    submissions: <em>Submissions</em>,
    messages: <>My <em>Messages</em></>,
    settings: <>Account <em>Settings</em></>,
  };

  const editingCall = formMode && formMode !== "new" ? calls.find((c) => c.id === formMode) : null;
  const activeConvoObj = conversations.find((c) => c.id === activeConvo);

  return (
    <>
      <style>{CSS}</style>

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div 
          className="pd-mobile-overlay open"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="pd-layout">

        {/* ── SIDEBAR ── */}
        <aside className={`pd-sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="pd-logo">
            <div className="pd-logo-mark"><span>C</span></div>
            <span className="pd-logo-name">Casting<em>.Home</em></span>
          </div>

          <div className="pd-prod-card">
            <div className="pd-avatar">🎬</div>
            <div className="pd-prod-name">{profile.companyName || session?.user?.name || "Your Company"}</div>
            <div className="pd-prod-role">Producer</div>
          </div>

          <div className="pd-stats">
            <div className="pd-stat">
              <div className="pd-stat-num">{openCallsCount}</div>
              <div className="pd-stat-lbl">Open Calls</div>
            </div>
            <div className="pd-stat">
              <div className="pd-stat-num">{totalSubmissions}</div>
              <div className="pd-stat-lbl">Submissions</div>
            </div>
          </div>

          <nav className="pd-nav">
            <div className="pd-nav-section">Menu</div>
            {NAV.map((item) => (
              <div
                key={item.id}
                className={`pd-nav-item${activeNav === item.id ? " on" : ""}`}
                onClick={() => { setActiveNav(item.id); setFormMode(null); setSidebarOpen(false); }}
              >
                <span className="pd-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="pd-nav-badge">{item.badge}</span>}
              </div>
            ))}
          </nav>

          <div className="pd-sidebar-foot">
            <button className="pd-signout" onClick={handleSignOut}>← Sign out</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="pd-main">

          <div className="pd-topbar">
            <button className="pd-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="pd-topbar-title">{TITLES[activeNav]}</div>
            <div className="pd-topbar-actions">
              {activeNav === "profile" && (
                <button className="btn-solid-sm" onClick={saveProfile}>Save changes</button>
              )}
              {activeNav === "calls" && !formMode && (
                <button className="btn-solid-sm" onClick={() => setFormMode("new")}>+ Post Casting Call</button>
              )}
            </div>
          </div>

          <div className="pd-content">

            {/* ══════════ PROFILE ══════════ */}
            {activeNav === "profile" && (
              <Section icon="🏢" title="Company Information" sub="Shown to actors on your casting calls" defaultOpen status="partial">
                <div className="pd-grid-2">
                  <div className="pd-field">
                    <label className="pd-label">Company / Production House</label>
                    <input className="pd-input" value={profile.companyName} onChange={(e) => setP("companyName")(e.target.value)} placeholder="Home Production Pvt. Ltd." />
                  </div>
                  <div className="pd-field">
                    <label className="pd-label">Contact Person</label>
                    <input className="pd-input" value={profile.contactName} onChange={(e) => setP("contactName")(e.target.value)} placeholder="Your name" />
                  </div>
                </div>
                <div className="pd-grid-2">
                  <div className="pd-field">
                    <label className="pd-label">Email</label>
                    <input className="pd-input" value={profile.email} disabled />
                  </div>
                  <div className="pd-field">
                    <label className="pd-label">Phone</label>
                    <input className="pd-input" type="tel" value={profile.phone} onChange={(e) => setP("phone")(e.target.value)} placeholder="98XXXXXXXX" />
                  </div>
                </div>
                <div className="pd-field">
                  <label className="pd-label">Website / Portfolio <span className="pd-optional">(optional)</span></label>
                  <input className="pd-input" value={profile.website} onChange={(e) => setP("website")(e.target.value)} placeholder="https://" />
                </div>
                <div className="pd-field">
                  <label className="pd-label">About</label>
                  <textarea className="pd-textarea" value={profile.about} onChange={(e) => setP("about")(e.target.value)}
                    placeholder="Tell actors a bit about your production house and the kind of work you make." />
                </div>
              </Section>
            )}

            {/* ══════════ CASTING CALLS ══════════ */}
            {activeNav === "calls" && (
              <>
                {formMode ? (
                  <Section icon="🎬" title={formMode === "new" ? "New Casting Call" : "Edit Casting Call"}
                    sub="Actors will see this once you post it" defaultOpen status="partial">
                    <CallForm
                      initial={editingCall || EMPTY_CALL}
                      isEditing={formMode !== "new"}
                      onCancel={() => setFormMode(null)}
                      onSave={(data) => formMode === "new" ? addCall(data) : saveEditedCall(formMode, data)}
                    />
                  </Section>
                ) : (
                  <>
                    <div className="pd-cc-toolbar">
                      <input
                        className="pd-input pd-cc-search"
                        placeholder="Search your casting calls…"
                        value={ccSearch}
                        onChange={(e) => setCcSearch(e.target.value)}
                      />
                      <div className="pd-cc-filters">
                        {["All", ...PROJECT_TYPES].map((f) => (
                          <button
                            key={f}
                            className={`pd-cc-filter-btn${ccFilter === f ? " on" : ""}`}
                            onClick={() => setCcFilter(f)}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredCalls.length === 0 ? (
                      <div className="pd-cc-empty">
                        {calls.length === 0
                          ? "You haven't posted a casting call yet."
                          : "No casting calls match your search or filter."}
                        <div className="pd-cc-empty-cta">
                          <button className="btn-solid-sm" onClick={() => setFormMode("new")}>+ Post Casting Call</button>
                        </div>
                      </div>
                    ) : (
                      <div className="pd-cc-grid">
                        {filteredCalls.map((call) => (
                          <CallCard
                            key={call.id}
                            call={call}
                            onEdit={setFormMode}
                            onDelete={setDeleteCallId}
                            onToggleStatus={toggleCallStatus}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ══════════ SUBMISSIONS ══════════ */}
            {activeNav === "submissions" && (
              <>
                {calls.length === 0 ? (
                  <div className="pd-cc-empty">
                    Post a casting call first — submissions from actors will show up here once they apply.
                    <div className="pd-cc-empty-cta">
                      <button className="btn-solid-sm" onClick={() => { setActiveNav("calls"); setFormMode("new"); }}>
                        + Post Casting Call
                      </button>
                    </div>
                  </div>
                ) : (
                  calls.map((call) => (
                    <div className="pd-sub-card" key={call.id}>
                      <div className="pd-sub-head">
                        <div className="pd-sub-title">{call.title}</div>
                        <div className="pd-sub-count">{call.submissions || 0} submission{call.submissions === 1 ? "" : "s"}</div>
                      </div>
                      <div className="pd-sub-empty">
                        No submissions yet. Actor applications will appear here once they can apply through the platform.
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* ══════════ MESSAGES ══════════ */}
            {activeNav === "messages" && (
              <div className="pd-msg-layout">
                <div className="pd-msg-list">
                  {conversations.map((c) => (
                    <div
                      key={c.id}
                      className={`pd-msg-item${activeConvo === c.id ? " on" : ""}`}
                      onClick={() => openConvo(c.id)}
                    >
                      <div className="pd-msg-avatar">{c.avatar}</div>
                      <div className="pd-msg-info">
                        <div className="pd-msg-name">{c.name}</div>
                        <div className="pd-msg-role">{c.role}</div>
                        <div className="pd-msg-preview">{c.messages[c.messages.length - 1]?.text}</div>
                      </div>
                      {c.unread && <div className="pd-msg-dot" />}
                    </div>
                  ))}
                </div>
                <div className="pd-thread">
                  {activeConvoObj ? (
                    <>
                      <div className="pd-thread-head">
                        <div className="pd-msg-avatar">{activeConvoObj.avatar}</div>
                        <div>
                          <div className="pd-msg-name">{activeConvoObj.name}</div>
                          <div className="pd-msg-role">{activeConvoObj.role}</div>
                        </div>
                      </div>
                      <div className="pd-thread-body">
                        {activeConvoObj.messages.map((m, i) => (
                          <div key={i} className={`pd-bubble ${m.from}`}>
                            {m.text}
                            <div className="pd-bubble-time">{m.time}</div>
                          </div>
                        ))}
                      </div>
                      <div className="pd-thread-input">
                        <input
                          placeholder="Write a reply…"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button className="btn-solid-sm" onClick={sendMessage}>Send</button>
                      </div>
                    </>
                  ) : (
                    <div className="pd-thread-empty">Select a conversation to view messages</div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════ SETTINGS ══════════ */}
            {activeNav === "settings" && (
              <>
                <div className="pd-settings-section">
                  <div className="pd-settings-title">Change Password</div>
                  <div className="pd-settings-sub">Update the password used to sign in to your producer account</div>
                  {pwErr && <div className="pd-error" style={{ marginBottom: "1rem" }}>{pwErr}</div>}
                  <div className="pd-field">
                    <label className="pd-label">Current Password</label>
                    <input className="pd-input" type="password" value={pwForm.current}
                      onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} />
                  </div>
                  <div className="pd-grid-2">
                    <div className="pd-field">
                      <label className="pd-label">New Password</label>
                      <input className="pd-input" type="password" value={pwForm.next}
                        onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))} />
                    </div>
                    <div className="pd-field">
                      <label className="pd-label">Confirm New Password</label>
                      <input className="pd-input" type="password" value={pwForm.confirm}
                        onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn-solid-sm" onClick={submitPasswordChange}>Update Password</button>
                </div>

                <div className="pd-settings-section">
                  <div className="pd-settings-title">Notifications</div>
                  <div className="pd-settings-sub">Choose what you get notified about</div>
                  <div className="pd-toggle-row">
                    <div>
                      <div className="pd-toggle-label">New applicants</div>
                      <div className="pd-toggle-desc">Get notified when an actor applies to your casting call</div>
                    </div>
                    <Switch on={notifs.newApplicants} onToggle={() => setNotifs((n) => ({ ...n, newApplicants: !n.newApplicants }))} />
                  </div>
                  <div className="pd-toggle-row">
                    <div>
                      <div className="pd-toggle-label">Messages</div>
                      <div className="pd-toggle-desc">Get notified when an actor messages you</div>
                    </div>
                    <Switch on={notifs.messages} onToggle={() => setNotifs((n) => ({ ...n, messages: !n.messages }))} />
                  </div>
                  <div className="pd-toggle-row">
                    <div>
                      <div className="pd-toggle-label">Email updates</div>
                      <div className="pd-toggle-desc">Platform news and casting tips by email</div>
                    </div>
                    <Switch on={notifs.email} onToggle={() => setNotifs((n) => ({ ...n, email: !n.email }))} />
                  </div>
                </div>

                <div className="pd-settings-section">
                  <div className="pd-settings-title">Danger Zone</div>
                  <div className="pd-settings-sub">Irreversible actions</div>
                  <div className="pd-danger-row">
                    <div className="pd-danger-text">
                      Deleting your account removes your company profile, all posted casting calls, and settings from this browser.
                    </div>
                    <button className="btn-danger-sm" onClick={() => setShowDeleteAccount(true)}>Delete Account</button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ── delete account modal ── */}
      {showDeleteAccount && (
        <div className="pd-modal-bg" onClick={() => setShowDeleteAccount(false)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-head">
              <div className="pd-modal-title">Delete account?</div>
              <button className="pd-modal-close" onClick={() => setShowDeleteAccount(false)}>✕</button>
            </div>
            <div className="pd-modal-body">
              This will permanently remove your company profile, casting calls, and settings from this browser. This can't be undone.
              <div className="pd-modal-actions">
                <button className="btn-ghost-sm" onClick={() => setShowDeleteAccount(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={confirmDeleteAccount}>Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── delete call modal ── */}
      {deleteCallId && (
        <div className="pd-modal-bg" onClick={() => setDeleteCallId(null)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-head">
              <div className="pd-modal-title">Delete casting call?</div>
              <button className="pd-modal-close" onClick={() => setDeleteCallId(null)}>✕</button>
            </div>
            <div className="pd-modal-body">
              This casting call and any submission data linked to it will be removed. This can't be undone.
              <div className="pd-modal-actions">
                <button className="btn-ghost-sm" onClick={() => setDeleteCallId(null)}>Cancel</button>
                <button className="btn-danger-sm" onClick={removeCall}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`pd-toast${toast.isErr ? " err" : ""}`}>{toast.msg}</div>}
    </>
  );
}
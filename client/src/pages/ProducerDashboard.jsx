import { useState, useEffect, useMemo } from "react";
import {
  getSession, clearSession,
  createCastingCall, listMyCastingCalls, updateCastingCall,
  toggleCastingCallStatus, deleteCastingCall,
} from "../lib/api";

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
  amber:    "#c9a24a",
  amberPale:"rgba(201,162,74,0.12)",
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

@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes shimmer { from { background-position:-500px 0; } to { background-position:500px 0; } }
@keyframes dotPulse { 0%,100% { opacity:.5;transform:scale(1); } 50% { opacity:1;transform:scale(1.25); } }
@keyframes toastIn { from { opacity:0;transform:translateY(10px); } to { opacity:1;transform:translateY(0); } }

/* ════════════ LAYOUT ════════════ */
.pd-layout { display:grid; grid-template-columns:220px 1fr; min-height:100vh; }

/* ════════════ SIDEBAR ════════════ */
.pd-sidebar {
  background:${T.navyCard}; border-right:1px solid ${T.divider};
  display:flex; flex-direction:column;
  position:sticky; top:0; height:100vh; overflow-y:auto;
  z-index:100; animation:fadeIn .5s ease both;
}
.pd-logo {
  padding:1.6rem 1.5rem 1.4rem; border-bottom:1px solid ${T.divider};
  display:flex; align-items:center; gap:11px; cursor:pointer; flex-shrink:0;
}
.pd-logo-mark {
  width:32px;height:32px; border:1px solid rgba(59,125,216,.38);
  display:flex;align-items:center;justify-content:center; flex-shrink:0; position:relative;
}
.pd-logo-mark::after { content:'';position:absolute;inset:3px;border:1px solid rgba(59,125,216,.1); }
.pd-logo-mark span { font-family:'DM Serif Display',serif;font-size:16px;color:${T.blue};position:relative;z-index:1; }
.pd-logo-name { font-family:'DM Serif Display',serif;font-size:17px;color:${T.cream};letter-spacing:.1px; }
.pd-logo-name em { font-style:normal;color:${T.blue}; }

.pd-company-card { padding:1.4rem 1.5rem; border-bottom:1px solid ${T.divider}; flex-shrink:0; }
.pd-avatar {
  width:48px;height:48px;border-radius:10px;
  border:1px solid ${T.blueDim};background:${T.bluePale};
  display:flex;align-items:center;justify-content:center;font-size:20px;
  margin-bottom:.75rem; overflow:hidden;
}
.pd-avatar img { width:100%;height:100%;object-fit:cover; }
.pd-company-name {
  font-family:'DM Serif Display',serif;font-size:15px;font-weight:400;color:${T.cream};
  margin-bottom:3px; white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.pd-company-role { font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:${T.blue};opacity:.7; }

.pd-completion { padding:1.1rem 1.5rem; border-bottom:1px solid ${T.divider}; flex-shrink:0; }
.pd-completion-row { display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px; }
.pd-completion-label { font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(244,239,230,.28); }
.pd-completion-pct { font-family:'DM Serif Display',serif;font-size:15px;color:${T.blueLt}; }
.pd-bar-bg { height:2px;background:rgba(244,239,230,.07);overflow:hidden; }
.pd-bar-fill { height:100%;background:linear-gradient(to right,${T.blue},${T.blueLt});transition:width .8s cubic-bezier(.22,1,.36,1); }

.pd-nav { flex:1;padding:.75rem 0;overflow-y:auto; }
.pd-nav-section { padding:.5rem 1.5rem .3rem;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(244,239,230,.18);margin-top:.4rem; }
.pd-nav-item {
  display:flex;align-items:center;gap:10px;padding:9px 1.5rem;font-size:13px;font-weight:400;
  color:rgba(244,239,230,.4);cursor:pointer;transition:color .2s,background .2s;
  border-left:2px solid transparent;position:relative;
}
.pd-nav-item:hover { color:rgba(244,239,230,.7);background:${T.faint}; }
.pd-nav-item.on { color:${T.blueLt};background:${T.bluePale};border-left-color:${T.blue}; }
.pd-nav-icon { font-size:14px;width:16px;text-align:center;flex-shrink:0; }
.pd-nav-badge { margin-left:auto;background:${T.blue};color:#fff;font-size:10px;font-weight:500;padding:1px 7px;letter-spacing:.3px; }

.pd-sidebar-foot { padding:1.1rem 1.5rem;border-top:1px solid ${T.divider};flex-shrink:0; }
.pd-signout {
  display:flex;align-items:center;gap:8px;font-size:12px;font-weight:300;color:rgba(244,239,230,.25);
  background:none;border:none;cursor:pointer;font-family:'Outfit',sans-serif;
  transition:color .2s;padding:0;letter-spacing:.3px;
}
.pd-signout:hover { color:rgba(200,80,80,.8); }

/* ════════════ MAIN ════════════ */
.pd-main { display:flex;flex-direction:column;min-height:100vh;overflow-x:hidden; }
.pd-topbar {
  padding:1.1rem 2.5rem;border-bottom:1px solid ${T.divider};
  display:flex;justify-content:space-between;align-items:center;background:${T.navy};
  position:sticky;top:0;z-index:50;animation:fadeIn .5s ease both;gap:1rem;
}
.pd-topbar-title { font-family:'DM Serif Display',serif;font-size:22px;font-weight:400;color:${T.cream}; }
.pd-topbar-title em { font-style:italic;color:${T.blue}; }
.pd-topbar-actions { display:flex;align-items:center;gap:.85rem;flex-shrink:0; }

.btn-ghost-sm {
  display:flex;align-items:center;gap:7px;padding:8px 18px;border:1px solid ${T.divider};background:transparent;
  font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;
  font-weight:400;color:rgba(244,239,230,.45);cursor:pointer;transition:border-color .22s,color .22s;
}
.btn-ghost-sm:hover { border-color:rgba(59,125,216,.4);color:${T.cream}; }

.btn-solid-sm {
  position:relative;overflow:hidden;padding:8px 20px;background:${T.blue};border:none;
  font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;
  font-weight:500;color:#fff;cursor:pointer;transition:transform .24s,box-shadow .24s;
}
.btn-solid-sm::after {
  content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);
  background-size:500px 100%;opacity:0;transition:opacity .24s;
}
.btn-solid-sm:hover { transform:translateY(-1px);box-shadow:0 10px 30px rgba(59,125,216,.28); }
.btn-solid-sm:hover::after { opacity:1;animation:shimmer .7s linear; }
.btn-solid-sm:disabled { opacity:.4;cursor:not-allowed;transform:none;box-shadow:none; }

.btn-danger-sm {
  padding:8px 20px;background:transparent;border:1px solid rgba(201,97,95,.4);
  font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;
  font-weight:500;color:${T.red};cursor:pointer;transition:background .22s,border-color .22s;
}
.btn-danger-sm:hover { background:${T.redPale};border-color:${T.red}; }

/* ════════════ CONTENT ════════════ */
.pd-content { padding:2.25rem 2.5rem;flex:1;animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .08s both; }

.pd-alert {
  display:flex;align-items:flex-start;gap:12px;padding:1rem 1.4rem;
  border:1px solid rgba(59,125,216,.2);background:${T.bluePale};margin-bottom:2rem;
  font-size:13px;font-weight:300;color:rgba(244,239,230,.5);line-height:1.6;
}
.pd-alert-icon { font-size:14px;flex-shrink:0;margin-top:1px; }
.pd-alert strong { color:${T.blueLt};font-weight:500; }

/* ════════════ STAT CARDS ════════════ */
.pd-stats { display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem; }
.pd-stat {
  background:${T.navyCard};border:1px solid ${T.divider};padding:1.25rem 1.4rem;
  transition:border-color .25s;
}
.pd-stat:hover { border-color:rgba(59,125,216,.22); }
.pd-stat-num { font-family:'DM Serif Display',serif;font-size:26px;color:${T.blueLt};margin-bottom:2px; }
.pd-stat-label { font-size:11px;letter-spacing:1px;text-transform:uppercase;color:rgba(244,239,230,.32); }

/* ════════════ SECTION CARD (profile accordion) ════════════ */
.pd-section { background:${T.navyCard};border:1px solid ${T.divider};margin-bottom:1.25rem;overflow:hidden;transition:border-color .28s; }
.pd-section:hover { border-color:rgba(59,125,216,.18); }
.pd-section-head {
  display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.6rem;
  border-bottom:1px solid transparent;cursor:pointer;user-select:none;transition:background .22s;
}
.pd-section-head:hover { background:${T.faint}; }
.pd-section-head.open { border-bottom-color:${T.divider}; }
.pd-section-left { display:flex;align-items:center;gap:12px; }
.pd-section-icon-box {
  width:36px;height:36px;border:1px solid ${T.divider};display:flex;align-items:center;justify-content:center;
  font-size:15px;flex-shrink:0;transition:border-color .25s,background .25s;
}
.pd-section-head:hover .pd-section-icon-box, .pd-section-head.open .pd-section-icon-box { border-color:rgba(59,125,216,.3);background:${T.bluePale}; }
.pd-section-title { font-family:'DM Serif Display',serif;font-size:16px;font-weight:400;color:${T.cream};margin-bottom:2px; }
.pd-section-sub { font-size:11px;font-weight:300;color:rgba(244,239,230,.28); }
.pd-section-right { display:flex;align-items:center;gap:10px;flex-shrink:0; }
.pd-status-dot { width:6px;height:6px;border-radius:50%; }
.pd-status-dot.done { background:#4a9b6f; }
.pd-status-dot.partial { background:${T.blue};animation:dotPulse 2.5s ease-in-out infinite; }
.pd-status-dot.empty { background:rgba(244,239,230,.12); }
.pd-status-text { font-size:10px;letter-spacing:.5px;color:rgba(244,239,230,.25); }
.pd-chevron { font-size:10px;color:rgba(244,239,230,.2);transition:transform .28s cubic-bezier(.22,1,.36,1); }
.pd-chevron.open { transform:rotate(180deg); }
.pd-section-body { padding:1.6rem; }

/* ════════════ FORM ELEMENTS ════════════ */
.pd-field { margin-bottom:1.1rem; }
.pd-field:last-child { margin-bottom:0; }
.pd-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.1rem; }
.pd-grid-2:last-child { margin-bottom:0; }
.pd-grid-3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.1rem; }

.pd-label { display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:500;color:rgba(244,239,230,.3);margin-bottom:6px; }
.pd-input {
  width:100%;padding:10px 12px;background:${T.navyMid};border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:300;color:${T.cream};outline:none;
  transition:border-color .22s,background .22s;
}
.pd-input::placeholder { color:rgba(244,239,230,.18); }
.pd-input:focus { border-color:rgba(59,125,216,.5);background:${T.navyLite}; }
.pd-input:disabled { color:rgba(244,239,230,.35);cursor:not-allowed; }

.pd-textarea {
  width:100%;padding:10px 12px;background:${T.navyMid};border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:300;color:${T.cream};outline:none;
  resize:vertical;min-height:100px;line-height:1.7;transition:border-color .22s,background .22s;
}
.pd-textarea::placeholder { color:rgba(244,239,230,.18); }
.pd-textarea:focus { border-color:rgba(59,125,216,.5);background:${T.navyLite}; }

.pd-select {
  width:100%;padding:10px 12px;background:${T.navyMid};border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:300;color:${T.cream};outline:none;cursor:pointer;
  appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(59,125,216,0.5)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;transition:border-color .22s;
}
.pd-select:focus { border-color:rgba(59,125,216,.5); }
.pd-select option { background:${T.navyCard}; }
.pd-hint { font-size:11px;font-weight:300;color:rgba(244,239,230,.22);margin-top:.5rem;line-height:1.6; }
.pd-error { font-size:11px;font-weight:400;color:${T.red};margin-top:.5rem; }

/* logo upload (single slot) */
.pd-logo-slot {
  width:120px;aspect-ratio:1;border:1px dashed rgba(59,125,216,.2);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;
  background:${T.navyMid};position:relative;overflow:hidden;transition:border-color .28s,background .28s;
}
.pd-logo-slot:hover { border-color:rgba(59,125,216,.5);background:${T.navyLite}; }
.pd-logo-slot.filled { border-style:solid;border-color:rgba(59,125,216,.3); }
.pd-logo-slot input[type=file] { position:absolute;inset:0;opacity:0;cursor:pointer; }
.pd-logo-preview { width:100%;height:100%;object-fit:cover;position:absolute;inset:0; }
.pd-logo-overlay {
  position:absolute;inset:0;background:rgba(7,17,43,.7);display:flex;align-items:center;justify-content:center;
  opacity:0;transition:opacity .28s;
}
.pd-logo-slot:hover .pd-logo-overlay { opacity:1; }
.pd-logo-plus { font-size:18px;color:rgba(244,239,230,.35); }
.pd-logo-lbl { font-size:10px;letter-spacing:1px;text-transform:uppercase;color:rgba(244,239,230,.4);text-align:center; }
.pd-logo-change { font-size:10px;letter-spacing:1px;text-transform:uppercase;color:${T.blueLt};font-weight:500; }

/* ════════════ MODAL ════════════ */
.pd-modal-bg {
  position:fixed;inset:0;z-index:200;background:rgba(4,10,20,.88);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;padding:2rem;animation:fadeIn .28s ease both;
  overflow-y:auto;
}
.pd-modal {
  background:${T.navyCard};border:1px solid ${T.divider};width:100%;max-width:560px;
  max-height:88vh;overflow-y:auto;animation:fadeUp .35s cubic-bezier(.22,1,.36,1) both;
}
.pd-modal-head { padding:1.3rem 1.6rem;border-bottom:1px solid ${T.divider};display:flex;justify-content:space-between;align-items:center; }
.pd-modal-title { font-family:'DM Serif Display',serif;font-size:18px;font-weight:400;color:${T.cream}; }
.pd-modal-close { background:none;border:none;color:rgba(244,239,230,.25);font-size:18px;cursor:pointer;transition:color .2s;padding:0;line-height:1; }
.pd-modal-close:hover { color:${T.cream}; }
.pd-modal-body { padding:1.75rem; }

/* ════════════ TOAST ════════════ */
.pd-toast {
  position:fixed;bottom:2rem;right:2rem;z-index:300;display:flex;align-items:center;gap:9px;
  padding:11px 18px;background:${T.navyCard};border:1px solid rgba(74,155,111,.35);
  font-size:12px;font-weight:300;color:rgba(150,210,170,.9);letter-spacing:.3px;
  animation:toastIn .35s cubic-bezier(.22,1,.36,1) both;box-shadow:0 8px 32px rgba(0,0,0,.4);
}
.pd-toast.err { border-color:rgba(201,97,95,.4);color:rgba(230,160,158,.95); }

/* ════════════ CASTING CALLS (producer's own) ════════════ */
.pd-cc-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap; }
.pd-cc-grid { display:flex;flex-direction:column;gap:1rem; }
.pd-cc-card { background:${T.navyCard};border:1px solid ${T.divider};padding:1.5rem 1.75rem;transition:border-color .25s; }
.pd-cc-card:hover { border-color:rgba(59,125,216,.22); }
.pd-cc-top { display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:.75rem; }
.pd-cc-title-wrap { flex:1; }
.pd-cc-title { font-family:'DM Serif Display',serif;font-size:17px;font-weight:400;color:${T.cream};margin-bottom:3px; }
.pd-cc-prod { font-size:12px;font-weight:300;color:${T.blueLt}; }
.pd-cc-status {
  flex-shrink:0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border:1px solid transparent;
}
.pd-cc-status.open { color:${T.green};background:${T.greenPale};border-color:rgba(74,155,111,.3); }
.pd-cc-status.closed { color:rgba(244,239,230,.35);background:${T.faint};border-color:${T.divider}; }
.pd-cc-meta { display:flex;gap:1.25rem;flex-wrap:wrap;font-size:12px;color:rgba(244,239,230,.35);margin-bottom:.85rem; }
.pd-cc-meta span { display:flex;align-items:center;gap:5px; }
.pd-cc-desc { font-size:13px;font-weight:300;line-height:1.7;color:rgba(244,239,230,.5);margin-bottom:1rem; }
.pd-cc-tags { display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1.1rem; }
.pd-cc-tag { font-size:10px;letter-spacing:.5px;padding:3px 9px;background:${T.faint};border:1px solid ${T.divider};color:rgba(244,239,230,.4); }
.pd-cc-foot { display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid ${T.divider};gap:.75rem;flex-wrap:wrap; }
.pd-cc-applicants-count { font-size:11px;color:rgba(244,239,230,.35); }
.pd-cc-applicants-count strong { color:${T.blueLt};font-weight:500; }
.pd-cc-actions { display:flex;gap:.5rem; }
.pd-cc-empty { text-align:center;padding:3.5rem 1rem;color:rgba(244,239,230,.28);font-size:13px; }
.pd-cc-empty-cta { margin-top:1rem; }

/* ════════════ APPLICANTS ════════════ */
.pd-app-filters { display:flex;gap:.6rem;margin-bottom:1.5rem;flex-wrap:wrap; }
.pd-app-filter-btn {
  padding:8px 16px;border:1px solid ${T.divider};background:transparent;font-family:'Outfit',sans-serif;
  font-size:11px;letter-spacing:1px;text-transform:uppercase;color:rgba(244,239,230,.4);cursor:pointer;
  transition:all .2s;white-space:nowrap;
}
.pd-app-filter-btn:hover { border-color:rgba(59,125,216,.35);color:${T.cream}; }
.pd-app-filter-btn.on { border-color:${T.blue};color:${T.blueLt};background:${T.bluePale}; }

.pd-app-grid { display:flex;flex-direction:column;gap:.85rem; }
.pd-app-card { background:${T.navyCard};border:1px solid ${T.divider};padding:1.25rem 1.5rem;display:flex;gap:1.1rem;align-items:flex-start;transition:border-color .25s; }
.pd-app-card:hover { border-color:rgba(59,125,216,.2); }
.pd-app-avatar {
  width:52px;height:52px;border-radius:50%;flex-shrink:0;border:1px solid ${T.blueDim};background:${T.bluePale};
  display:flex;align-items:center;justify-content:center;font-size:22px;
}
.pd-app-info { flex:1;min-width:0; }
.pd-app-top { display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:4px; }
.pd-app-name { font-family:'DM Serif Display',serif;font-size:15.5px;color:${T.cream}; }
.pd-app-for { font-size:11px;color:rgba(244,239,230,.32);margin-bottom:6px; }
.pd-app-for strong { color:${T.blueLt};font-weight:500; }
.pd-app-meta { display:flex;gap:1rem;font-size:11.5px;color:rgba(244,239,230,.4);margin-bottom:8px;flex-wrap:wrap; }
.pd-app-note { font-size:12.5px;font-weight:300;color:rgba(244,239,230,.48);line-height:1.65;margin-bottom:10px; }
.pd-app-actions { display:flex;gap:.5rem;flex-wrap:wrap; }
.pd-app-status-badge {
  font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:4px 10px;font-weight:500;flex-shrink:0;
}
.pd-app-status-badge.new       { color:${T.blueLt};background:${T.bluePale}; }
.pd-app-status-badge.shortlist { color:${T.amber};background:${T.amberPale}; }
.pd-app-status-badge.accepted  { color:${T.green};background:${T.greenPale}; }
.pd-app-status-badge.declined  { color:rgba(244,239,230,.32);background:${T.faint}; }
.pd-app-empty { text-align:center;padding:3.5rem 1rem;color:rgba(244,239,230,.28);font-size:13px; }

/* ════════════ MESSAGES ════════════ */
.pd-msg-layout { display:grid;grid-template-columns:280px 1fr;background:${T.navyCard};border:1px solid ${T.divider};height:calc(100vh - 180px);min-height:420px; }
.pd-msg-list { border-right:1px solid ${T.divider};overflow-y:auto; }
.pd-msg-item { display:flex;gap:.75rem;padding:1rem 1.25rem;border-bottom:1px solid ${T.divider};cursor:pointer;transition:background .2s;position:relative; }
.pd-msg-item:hover { background:${T.faint}; }
.pd-msg-item.on { background:${T.bluePale}; }
.pd-msg-avatar { width:38px;height:38px;border-radius:50%;flex-shrink:0;border:1px solid ${T.blueDim};background:${T.bluePale};display:flex;align-items:center;justify-content:center;font-size:16px; }
.pd-msg-info { flex:1;min-width:0; }
.pd-msg-name { font-size:13px;font-weight:500;color:${T.cream};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px; }
.pd-msg-role { font-size:10.5px;color:rgba(244,239,230,.32);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px; }
.pd-msg-preview { font-size:11.5px;color:rgba(244,239,230,.42);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.pd-msg-dot { width:8px;height:8px;border-radius:50%;background:${T.blue};position:absolute;top:1.15rem;right:1rem; }
.pd-thread { display:flex;flex-direction:column;height:100%; }
.pd-thread-head { padding:1.1rem 1.5rem;border-bottom:1px solid ${T.divider};display:flex;align-items:center;gap:.75rem;flex-shrink:0; }
.pd-thread-body { flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:.9rem; }
.pd-bubble { max-width:65%;padding:10px 14px;font-size:13px;font-weight:300;line-height:1.6; }
.pd-bubble.them { align-self:flex-start;background:${T.navyMid};border:1px solid ${T.divider};color:rgba(244,239,230,.75); }
.pd-bubble.me { align-self:flex-end;background:${T.blue};color:#fff; }
.pd-bubble-time { font-size:10px;margin-top:4px;opacity:.5; }
.pd-thread-empty { flex:1;display:flex;align-items:center;justify-content:center;color:rgba(244,239,230,.25);font-size:13px; }
.pd-thread-input { display:flex;gap:.6rem;padding:1rem 1.25rem;border-top:1px solid ${T.divider};flex-shrink:0; }
.pd-thread-input input { flex:1;padding:10px 14px;background:${T.navyMid};border:1px solid rgba(244,239,230,.07);color:${T.cream};font-family:'Outfit',sans-serif;font-size:13px;outline:none; }
.pd-thread-input input:focus { border-color:rgba(59,125,216,.5); }

/* ════════════ SETTINGS ════════════ */
.pd-settings-section { background:${T.navyCard};border:1px solid ${T.divider};padding:1.6rem 1.75rem;margin-bottom:1.25rem; }
.pd-settings-title { font-family:'DM Serif Display',serif;font-size:16px;font-weight:400;color:${T.cream};margin-bottom:.25rem; }
.pd-settings-sub { font-size:11.5px;font-weight:300;color:rgba(244,239,230,.32);margin-bottom:1.4rem; }
.pd-toggle-row { display:flex;justify-content:space-between;align-items:center;padding:.85rem 0;border-bottom:1px solid ${T.divider}; }
.pd-toggle-row:last-child { border-bottom:none;padding-bottom:0; }
.pd-toggle-row:first-child { padding-top:0; }
.pd-toggle-label { font-size:13px;color:rgba(244,239,230,.7);margin-bottom:2px; }
.pd-toggle-desc { font-size:11px;color:rgba(244,239,230,.3); }
.pd-switch { width:38px;height:21px;border-radius:11px;background:rgba(244,239,230,.1);border:1px solid ${T.divider};position:relative;cursor:pointer;flex-shrink:0;transition:background .22s; }
.pd-switch.on { background:${T.blue};border-color:${T.blue}; }
.pd-switch-knob { width:15px;height:15px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:transform .22s; }
.pd-switch.on .pd-switch-knob { transform:translateX(17px); }
.pd-danger-row { display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap; }
.pd-danger-text { font-size:12.5px;color:rgba(244,239,230,.4);line-height:1.6;max-width:420px; }

/* ════════════ RESPONSIVE ════════════ */
@media(max-width:960px) {
  .pd-layout { grid-template-columns:1fr; }
  .pd-sidebar { display:none; }
  .pd-content { padding:1.5rem; }
  .pd-topbar { padding:1rem 1.5rem; }
  .pd-grid-2 { grid-template-columns:1fr; }
  .pd-grid-3 { grid-template-columns:1fr; }
  .pd-stats { grid-template-columns:repeat(2,1fr); }
  .pd-msg-layout { grid-template-columns:1fr;height:auto; }
  .pd-msg-list { max-height:220px; }
}
@media(max-width:500px) {
  .pd-stats { grid-template-columns:1fr; }
  .pd-topbar-actions .btn-ghost-sm { display:none; }
}
`;

/* ── section accordion ── */
function Section({ icon, title, sub, defaultOpen = false, status = "empty", children }) {
  const [open, setOpen] = useState(defaultOpen);
  const statusMap = {
    done:    { dot:"done",    label:"Complete" },
    partial: { dot:"partial", label:"In progress" },
    empty:   { dot:"empty",   label:"Not started" },
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

function Switch({ on, onToggle }) {
  return (
    <div className={`pd-switch${on ? " on" : ""}`} onClick={onToggle}>
      <div className="pd-switch-knob" />
    </div>
  );
}

const EMPTY_CALL = {
  title: "", type: "Film", location: "", ageRange: "", gender: "Any",
  deadline: "", tags: "", description: "",
};

/* mock applicants — frontend-only placeholder data, keyed by call id */
const MOCK_APPLICANTS = [
  { id:"a1", name:"Sujata Karki", age:24, city:"Kathmandu", avatar:"🎭", note:"5 years theatre experience, fluent in Nepali and English.", status:"new" },
  { id:"a2", name:"Bikash Thapa", age:29, city:"Pokhara", avatar:"🎬", note:"Lead role in two independent features, trained in stage combat.", status:"shortlist" },
  { id:"a3", name:"Anjali Rana", age:22, city:"Kathmandu", avatar:"🎭", note:"Fresh graduate from a film academy, strong dance background.", status:"new" },
  { id:"a4", name:"Rohit Shrestha", age:31, city:"Lalitpur", avatar:"🎬", note:"Worked on 3 TVCs this year, comfortable with comedic timing.", status:"accepted" },
  { id:"a5", name:"Priya Maharjan", age:26, city:"Bhaktapur", avatar:"🎭", note:"Bilingual voice-over artist branching into on-screen work.", status:"declined" },
];

const INITIAL_CONVERSATIONS = [
  {
    id:"m1", name:"Sujata Karki", role:"Applicant · Lead Female Role", avatar:"🎭", unread:true,
    messages:[
      { from:"them", text:"Hi! Thank you for considering my application — happy to send additional reels if useful.", time:"9:40 AM" },
      { from:"me",   text:"Thanks for reaching out — could you send your showreel from the last production?", time:"9:52 AM" },
    ],
  },
  {
    id:"m2", name:"Bikash Thapa", role:"Applicant · Supporting Role", avatar:"🎬", unread:false,
    messages:[
      { from:"them", text:"Looking forward to the callback next week.", time:"Yesterday" },
    ],
  },
];

export default function ProducerDashboard() {
  const session = getSession();
  const profileKey = `ch_producer_profile:${session?.user?.id ?? "guest"}`;
  const callsKey = `ch_producer_calls:${session?.user?.id ?? "guest"}`;
  const applicantsKey = `ch_producer_applicants:${session?.user?.id ?? "guest"}`;
  const notifKey = `ch_producer_notifications:${session?.user?.id ?? "guest"}`;

  const [info, setInfo] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(profileKey) || "null");
    return saved?.info || {
      company: session?.user?.company || "",
      contactName: session?.user?.name || "",
      phone: session?.user?.phone || "",
      website: "", industry: "Film Production",
      city: "", about: "",
    };
  });
  const [logo, setLogo] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(profileKey) || "null");
    return saved?.logo || null;
  });

  const [activeNav, setActiveNav] = useState("profile");
  const [toast, setToast] = useState(null);

  // ── casting calls (producer's own postings) ──
  // localStorage seeds instant UI on load; the database (via
  // /api/producer/casting-calls) is the real source of truth once
  // the initial fetch below completes.
  const [calls, setCalls] = useState(() => {
    return JSON.parse(localStorage.getItem(callsKey) || "[]");
  });
  const [callsLoading, setCallsLoading] = useState(true);
  const [showCallModal, setShowCallModal] = useState(false);
  const [editingCallId, setEditingCallId] = useState(null);
  const [callForm, setCallForm] = useState(EMPTY_CALL);
  const [callErr, setCallErr] = useState("");
  const [callSubmitting, setCallSubmitting] = useState(false);

  // ── applicants ──
  const [applicants, setApplicants] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(applicantsKey) || "null");
    return saved || MOCK_APPLICANTS;
  });
  const [appFilter, setAppFilter] = useState("All");

  // ── messages ──
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvo, setActiveConvo] = useState(null);
  const [draft, setDraft] = useState("");

  // ── settings ──
  const [pwForm, setPwForm] = useState({ current:"", next:"", confirm:"" });
  const [pwErr, setPwErr] = useState("");
  const [notifs, setNotifs] = useState(() => {
    return JSON.parse(localStorage.getItem(notifKey) || "null") || {
      email:true, newApplicants:true, messages:true,
    };
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { localStorage.setItem(notifKey, JSON.stringify(notifs)); }, [notifs, notifKey]);
  useEffect(() => { localStorage.setItem(callsKey, JSON.stringify(calls)); }, [calls, callsKey]);
  useEffect(() => { localStorage.setItem(applicantsKey, JSON.stringify(applicants)); }, [applicants, applicantsKey]);

  // Load this producer's real casting calls from the database on mount.
  useEffect(() => {
    let cancelled = false;
    listMyCastingCalls()
      .then(({ calls: serverCalls }) => {
        if (!cancelled) setCalls(serverCalls);
      })
      .catch((err) => {
        console.warn("Could not load casting calls from server, using local cache:", err.message);
      })
      .finally(() => { if (!cancelled) setCallsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const setI = (k) => (v) => setInfo((p) => ({ ...p, [k]: v }));

  const allFields = [info.company, info.contactName, info.phone, info.website, info.city, info.about, logo];
  const pct = Math.round(allFields.filter(Boolean).length / allFields.length * 100);

  const status = (keys) => {
    const vals = keys.map((k) => (k === "logo" ? logo : info[k]));
    if (vals.every(Boolean)) return "done";
    if (vals.some(Boolean)) return "partial";
    return "empty";
  };

  const showToast = (msg, isErr = false) => {
    setToast({ msg, isErr });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = () => {
    localStorage.setItem(profileKey, JSON.stringify({ info, logo }));
    showToast("✓ Company profile saved");
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(URL.createObjectURL(file));
  };

  const handleSignOut = () => {
    clearSession();
    window.location.href = "/";
  };

  const openNewCallModal = () => {
    setEditingCallId(null);
    setCallForm(EMPTY_CALL);
    setCallErr("");
    setShowCallModal(true);
  };

  const openEditCallModal = (call) => {
    setEditingCallId(call.id);
    setCallForm({
      title: call.title, type: call.type, location: call.location,
      ageRange: call.ageRange, gender: call.gender, deadline: call.deadline,
      tags: call.tags.join(", "), description: call.description,
    });
    setCallErr("");
    setShowCallModal(true);
  };

  const submitCall = async () => {
    if (!callForm.title.trim())    return setCallErr("Title is required");
    if (!callForm.location.trim()) return setCallErr("Location is required");
    if (!callForm.deadline)        return setCallErr("Application deadline is required");
    if (!callForm.description.trim()) return setCallErr("Description is required");
    setCallErr("");
    setCallSubmitting(true);

    try {
      if (editingCallId) {
        const { call } = await updateCastingCall(editingCallId, callForm);
        setCalls((prev) => prev.map((c) => (c.id === editingCallId ? call : c)));
        showToast("✓ Casting call updated");
      } else {
        // Saving this also emails the admin the full brief server-side
        // (server/lib/mailer.js) so it can be manually reviewed and
        // matched with actors — see emailSent in the response.
        const { call, emailSent } = await createCastingCall(callForm);
        setCalls((prev) => [call, ...prev]);
        showToast(
          emailSent
            ? "✓ Casting call posted — our team has been notified"
            : "✓ Casting call posted"
        );
      }
      setShowCallModal(false);
    } catch (err) {
      setCallErr(err.message || "Something went wrong — please try again");
    } finally {
      setCallSubmitting(false);
    }
  };

  const toggleCallStatus = async (id) => {
    try {
      const { call } = await toggleCastingCallStatus(id);
      setCalls((prev) => prev.map((c) => (c.id === id ? call : c)));
    } catch (err) {
      showToast(err.message || "Couldn't update status", true);
    }
  };

  const deleteCall = async (id) => {
    try {
      await deleteCastingCall(id);
      setCalls((prev) => prev.filter((c) => c.id !== id));
      showToast("Casting call deleted");
    } catch (err) {
      showToast(err.message || "Couldn't delete casting call", true);
    }
  };

  const filteredApplicants = useMemo(() => {
    if (appFilter === "All") return applicants;
    return applicants.filter((a) => a.status === appFilter.toLowerCase());
  }, [applicants, appFilter]);

  const setApplicantStatus = (id, status) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const newApplicantsCount = applicants.filter((a) => a.status === "new").length;
  const openCallsCount = calls.filter((c) => c.status === "open").length;

  const sendMessage = () => {
    if (!draft.trim() || !activeConvo) return;
    setConversations((prev) => prev.map((c) =>
      c.id === activeConvo
        ? { ...c, unread:false, messages:[...c.messages, { from:"me", text:draft.trim(), time:"Now" }] }
        : c
    ));
    setDraft("");
  };

  const openConvo = (id) => {
    setActiveConvo(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread:false } : c)));
  };

  const submitPasswordChange = () => {
    if (!pwForm.current) return setPwErr("Enter your current password");
    if (pwForm.next.length < 6) return setPwErr("New password must be at least 6 characters");
    if (pwForm.next !== pwForm.confirm) return setPwErr("New passwords don't match");
    setPwErr("");
    setPwForm({ current:"", next:"", confirm:"" });
    showToast("✓ Password updated");
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    localStorage.removeItem(profileKey);
    localStorage.removeItem(callsKey);
    localStorage.removeItem(applicantsKey);
    localStorage.removeItem(notifKey);
    clearSession();
    window.location.href = "/";
  };

  const NAV = [
    { id:"profile",     icon:"🏢", label:"Company Profile" },
    { id:"calls",       icon:"🎬", label:"My Casting Calls", badge: openCallsCount > 0 ? String(openCallsCount) : null },
    { id:"applicants",  icon:"🎭", label:"Applicants", badge: newApplicantsCount > 0 ? String(newApplicantsCount) : null },
    { id:"messages",    icon:"✉️", label:"Messages", badge: conversations.some((c) => c.unread) ? String(conversations.filter((c) => c.unread).length) : null },
    { id:"settings",    icon:"⚙️", label:"Settings" },
  ];

  const TITLES = {
    profile: <>Company <em>Profile</em></>,
    calls: <>My Casting <em>Calls</em></>,
    applicants: <>Review <em>Applicants</em></>,
    messages: <>My <em>Messages</em></>,
    settings: <>Account <em>Settings</em></>,
  };

  const activeConvoObj = conversations.find((c) => c.id === activeConvo);

  return (
    <>
      <style>{CSS}</style>

      <div className="pd-layout">

        {/* ── SIDEBAR ── */}
        <aside className="pd-sidebar">
          <div className="pd-logo">
            <div className="pd-logo-mark"><span>C</span></div>
            <span className="pd-logo-name">Casting<em>.Home</em></span>
          </div>

          <div className="pd-company-card">
            <div className="pd-avatar">
              {logo ? <img src={logo} alt="Logo" /> : "🏢"}
            </div>
            <div className="pd-company-name">{info.company || "Your Company"}</div>
            <div className="pd-company-role">Producer</div>
          </div>

          <div className="pd-completion">
            <div className="pd-completion-row">
              <span className="pd-completion-label">Profile</span>
              <span className="pd-completion-pct">{pct}%</span>
            </div>
            <div className="pd-bar-bg"><div className="pd-bar-fill" style={{ width:`${pct}%` }} /></div>
          </div>

          <nav className="pd-nav">
            <div className="pd-nav-section">Menu</div>
            {NAV.map((item) => (
              <div
                key={item.id}
                className={`pd-nav-item${activeNav === item.id ? " on" : ""}`}
                onClick={() => setActiveNav(item.id)}
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
            <div className="pd-topbar-title">{TITLES[activeNav]}</div>
            <div className="pd-topbar-actions">
              {activeNav === "profile" && (
                <button className="btn-solid-sm" onClick={handleSaveProfile}>Save changes</button>
              )}
              {activeNav === "calls" && (
                <button className="btn-solid-sm" onClick={openNewCallModal}>+ Post a casting call</button>
              )}
            </div>
          </div>

          <div className="pd-content">

            {/* ══════════ COMPANY PROFILE ══════════ */}
            {activeNav === "profile" && (
              <>
                {pct < 100 && (
                  <div className="pd-alert">
                    <span className="pd-alert-icon">—</span>
                    <span>Your company profile is <strong>{pct}% complete.</strong> A complete profile builds trust with actors reviewing your casting calls.</span>
                  </div>
                )}

                <Section icon="🏢" title="Company Details" sub="Name, contact, website" defaultOpen
                  status={status(["company","contactName","phone","website"])}>
                  <div className="pd-grid-2">
                    <div className="pd-field">
                      <label className="pd-label">Company Name</label>
                      <input className="pd-input" value={info.company}
                        onChange={(e) => setI("company")(e.target.value)} placeholder="XYZ Films" />
                    </div>
                    <div className="pd-field">
                      <label className="pd-label">Contact Person</label>
                      <input className="pd-input" value={info.contactName}
                        onChange={(e) => setI("contactName")(e.target.value)} placeholder="Ramesh Thapa" />
                    </div>
                  </div>
                  <div className="pd-grid-2">
                    <div className="pd-field">
                      <label className="pd-label">Phone</label>
                      <input className="pd-input" type="tel" value={info.phone}
                        onChange={(e) => setI("phone")(e.target.value)} placeholder="98XXXXXXXX" />
                    </div>
                    <div className="pd-field">
                      <label className="pd-label">Website</label>
                      <input className="pd-input" value={info.website}
                        onChange={(e) => setI("website")(e.target.value)} placeholder="https://yourcompany.com" />
                    </div>
                  </div>
                  <div className="pd-grid-2">
                    <div className="pd-field">
                      <label className="pd-label">Industry</label>
                      <select className="pd-select" value={info.industry}
                        onChange={(e) => setI("industry")(e.target.value)}>
                        <option>Film Production</option>
                        <option>TV Production</option>
                        <option>Ad Agency</option>
                        <option>Theatre</option>
                        <option>Web Series / OTT</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="pd-field">
                      <label className="pd-label">City</label>
                      <input className="pd-input" value={info.city}
                        onChange={(e) => setI("city")(e.target.value)} placeholder="Kathmandu" />
                    </div>
                  </div>
                </Section>

                <Section icon="🖼️" title="Company Logo" sub="Shown on your casting calls" status={logo ? "done" : "empty"}>
                  <div className={`pd-logo-slot${logo ? " filled" : ""}`}>
                    <input type="file" accept="image/*" onChange={handleLogo} />
                    {logo ? (
                      <>
                        <img src={logo} alt="Logo" className="pd-logo-preview" />
                        <div className="pd-logo-overlay"><span className="pd-logo-change">Change</span></div>
                      </>
                    ) : (
                      <>
                        <div className="pd-logo-plus">+</div>
                        <div className="pd-logo-lbl">Upload logo</div>
                      </>
                    )}
                  </div>
                  <p className="pd-hint">Square image works best. JPEG or PNG, max 5 MB.</p>
                </Section>

                <Section icon="📝" title="About the Company" sub="What actors should know before applying" status={status(["about"])}>
                  <div className="pd-field">
                    <label className="pd-label">Company bio</label>
                    <textarea className="pd-textarea" rows={5} value={info.about}
                      onChange={(e) => setI("about")(e.target.value)}
                      placeholder="Tell actors about your company — past productions, the kind of work you make, what it's like to work with you." />
                  </div>
                </Section>
              </>
            )}

            {/* ══════════ MY CASTING CALLS ══════════ */}
            {activeNav === "calls" && (
              <>
                <div className="pd-stats">
                  <div className="pd-stat">
                    <div className="pd-stat-num">{calls.length}</div>
                    <div className="pd-stat-label">Total posted</div>
                  </div>
                  <div className="pd-stat">
                    <div className="pd-stat-num">{openCallsCount}</div>
                    <div className="pd-stat-label">Currently open</div>
                  </div>
                  <div className="pd-stat">
                    <div className="pd-stat-num">{applicants.length}</div>
                    <div className="pd-stat-label">Total applicants</div>
                  </div>
                  <div className="pd-stat">
                    <div className="pd-stat-num">{newApplicantsCount}</div>
                    <div className="pd-stat-label">Awaiting review</div>
                  </div>
                </div>

                {callsLoading ? (
                  <div className="pd-cc-empty">Loading your casting calls…</div>
                ) : calls.length === 0 ? (
                  <div className="pd-cc-empty">
                    You haven't posted any casting calls yet.
                    <div className="pd-cc-empty-cta">
                      <button className="btn-solid-sm" onClick={openNewCallModal}>+ Post your first casting call</button>
                    </div>
                  </div>
                ) : null}
                {!callsLoading && calls.length > 0 && (
                  <div className="pd-cc-grid">
                    {calls.map((c) => (
                      <div className="pd-cc-card" key={c.id}>
                        <div className="pd-cc-top">
                          <div className="pd-cc-title-wrap">
                            <div className="pd-cc-title">{c.title}</div>
                            <div className="pd-cc-prod">{c.type} · {c.location}</div>
                          </div>
                          <div className={`pd-cc-status ${c.status}`}>{c.status}</div>
                        </div>
                        <div className="pd-cc-meta">
                          <span>🎂 {c.ageRange || "Any age"}</span>
                          <span>⚧ {c.gender}</span>
                          <span>📅 Apply by {new Date(c.deadline).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                        </div>
                        <p className="pd-cc-desc">{c.description}</p>
                        {c.tags?.length > 0 && (
                          <div className="pd-cc-tags">
                            {c.tags.map((t) => <span className="pd-cc-tag" key={t}>{t}</span>)}
                          </div>
                        )}
                        <div className="pd-cc-foot">
                          <div className="pd-cc-applicants-count">
                            <strong>{applicants.length}</strong> applicants so far
                          </div>
                          <div className="pd-cc-actions">
                            <button className="btn-ghost-sm" onClick={() => openEditCallModal(c)}>Edit</button>
                            <button className="btn-ghost-sm" onClick={() => toggleCallStatus(c.id)}>
                              {c.status === "open" ? "Close" : "Reopen"}
                            </button>
                            <button className="btn-danger-sm" onClick={() => deleteCall(c.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ══════════ APPLICANTS ══════════ */}
            {activeNav === "applicants" && (
              <>
                <div className="pd-app-filters">
                  {["All","New","Shortlist","Accepted","Declined"].map((f) => (
                    <button
                      key={f}
                      className={`pd-app-filter-btn${appFilter === f ? " on" : ""}`}
                      onClick={() => setAppFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {filteredApplicants.length === 0 ? (
                  <div className="pd-app-empty">No applicants in this category yet.</div>
                ) : (
                  <div className="pd-app-grid">
                    {filteredApplicants.map((a) => (
                      <div className="pd-app-card" key={a.id}>
                        <div className="pd-app-avatar">{a.avatar}</div>
                        <div className="pd-app-info">
                          <div className="pd-app-top">
                            <div>
                              <div className="pd-app-name">{a.name}</div>
                              <div className="pd-app-for">Applied for <strong>{calls[0]?.title || "a casting call"}</strong></div>
                            </div>
                            <span className={`pd-app-status-badge ${a.status}`}>{a.status}</span>
                          </div>
                          <div className="pd-app-meta">
                            <span>🎂 {a.age}</span>
                            <span>📍 {a.city}</span>
                          </div>
                          <p className="pd-app-note">{a.note}</p>
                          <div className="pd-app-actions">
                            {a.status !== "shortlist" && (
                              <button className="btn-ghost-sm" onClick={() => setApplicantStatus(a.id, "shortlist")}>Shortlist</button>
                            )}
                            {a.status !== "accepted" && (
                              <button className="btn-solid-sm" onClick={() => setApplicantStatus(a.id, "accepted")}>Accept</button>
                            )}
                            {a.status !== "declined" && (
                              <button className="btn-danger-sm" onClick={() => setApplicantStatus(a.id, "declined")}>Decline</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ══════════ MESSAGES ══════════ */}
            {activeNav === "messages" && (
              <div className="pd-msg-layout">
                <div className="pd-msg-list">
                  {conversations.map((c) => (
                    <div key={c.id} className={`pd-msg-item${activeConvo === c.id ? " on" : ""}`} onClick={() => openConvo(c.id)}>
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
                          <div className={`pd-bubble ${m.from}`} key={i}>
                            {m.text}
                            <div className="pd-bubble-time">{m.time}</div>
                          </div>
                        ))}
                      </div>
                      <div className="pd-thread-input">
                        <input placeholder="Type a message…" value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
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
                  <div className="pd-settings-title">Account</div>
                  <div className="pd-settings-sub">Your login details for Casting.Home</div>
                  <div className="pd-grid-2">
                    <div className="pd-field">
                      <label className="pd-label">Email</label>
                      <input className="pd-input" value={session?.user?.email || ""} disabled />
                    </div>
                    <div className="pd-field">
                      <label className="pd-label">Account type</label>
                      <input className="pd-input" value="Producer" disabled />
                    </div>
                  </div>
                </div>

                <div className="pd-settings-section">
                  <div className="pd-settings-title">Change Password</div>
                  <div className="pd-settings-sub">Choose a strong password you don't use elsewhere</div>
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
                  {pwErr && <div className="pd-error">{pwErr}</div>}
                  <div style={{ marginTop:"1rem" }}>
                    <button className="btn-solid-sm" onClick={submitPasswordChange}>Update password</button>
                  </div>
                </div>

                <div className="pd-settings-section">
                  <div className="pd-settings-title">Notifications</div>
                  <div className="pd-settings-sub">Choose what Casting.Home should email you about</div>
                  <div className="pd-toggle-row">
                    <div>
                      <div className="pd-toggle-label">Email notifications</div>
                      <div className="pd-toggle-desc">General account and activity emails</div>
                    </div>
                    <Switch on={notifs.email} onToggle={() => setNotifs((n) => ({ ...n, email: !n.email }))} />
                  </div>
                  <div className="pd-toggle-row">
                    <div>
                      <div className="pd-toggle-label">New applicant alerts</div>
                      <div className="pd-toggle-desc">Get notified when an actor applies to your casting call</div>
                    </div>
                    <Switch on={notifs.newApplicants} onToggle={() => setNotifs((n) => ({ ...n, newApplicants: !n.newApplicants }))} />
                  </div>
                  <div className="pd-toggle-row">
                    <div>
                      <div className="pd-toggle-label">Message notifications</div>
                      <div className="pd-toggle-desc">Email me when an actor messages me</div>
                    </div>
                    <Switch on={notifs.messages} onToggle={() => setNotifs((n) => ({ ...n, messages: !n.messages }))} />
                  </div>
                </div>

                <div className="pd-settings-section">
                  <div className="pd-settings-title" style={{ color:T.red }}>Danger Zone</div>
                  <div className="pd-danger-row">
                    <div className="pd-danger-text">
                      Deleting your account removes your company profile, casting calls, and applicant data. This cannot be undone.
                    </div>
                    <button className="btn-danger-sm" onClick={() => setShowDeleteConfirm(true)}>Delete account</button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ── POST / EDIT CASTING CALL MODAL ── */}
      {showCallModal && (
        <div className="pd-modal-bg" onClick={() => setShowCallModal(false)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-head">
              <div className="pd-modal-title">{editingCallId ? "Edit casting call" : "Post a casting call"}</div>
              <button className="pd-modal-close" onClick={() => setShowCallModal(false)}>✕</button>
            </div>
            <div className="pd-modal-body">
              <div className="pd-field">
                <label className="pd-label">Title</label>
                <input className="pd-input" value={callForm.title}
                  onChange={(e) => setCallForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Lead Actress — Feature Film" />
              </div>
              <div className="pd-grid-2">
                <div className="pd-field">
                  <label className="pd-label">Type</label>
                  <select className="pd-select" value={callForm.type}
                    onChange={(e) => setCallForm((f) => ({ ...f, type: e.target.value }))}>
                    <option>Film</option>
                    <option>TV</option>
                    <option>Web Series</option>
                    <option>Ad</option>
                    <option>Theatre</option>
                  </select>
                </div>
                <div className="pd-field">
                  <label className="pd-label">Location</label>
                  <input className="pd-input" value={callForm.location}
                    onChange={(e) => setCallForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Kathmandu" />
                </div>
              </div>
              <div className="pd-grid-3">
                <div className="pd-field">
                  <label className="pd-label">Age Range</label>
                  <input className="pd-input" value={callForm.ageRange}
                    onChange={(e) => setCallForm((f) => ({ ...f, ageRange: e.target.value }))}
                    placeholder="22–28" />
                </div>
                <div className="pd-field">
                  <label className="pd-label">Gender</label>
                  <select className="pd-select" value={callForm.gender}
                    onChange={(e) => setCallForm((f) => ({ ...f, gender: e.target.value }))}>
                    <option>Any</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="pd-field">
                  <label className="pd-label">Deadline</label>
                  <input className="pd-input" type="date" value={callForm.deadline}
                    onChange={(e) => setCallForm((f) => ({ ...f, deadline: e.target.value }))} />
                </div>
              </div>
              <div className="pd-field">
                <label className="pd-label">Tags (comma separated)</label>
                <input className="pd-input" value={callForm.tags}
                  onChange={(e) => setCallForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="Drama, Nepali/English" />
              </div>
              <div className="pd-field">
                <label className="pd-label">Description</label>
                <textarea className="pd-textarea" rows={4} value={callForm.description}
                  onChange={(e) => setCallForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the role, the production, and what you're looking for." />
              </div>
              {callErr && <div className="pd-error">{callErr}</div>}
              <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end", marginTop:"1.25rem" }}>
                <button className="btn-ghost-sm" onClick={() => setShowCallModal(false)}>Cancel</button>
                <button className="btn-solid-sm" onClick={submitCall} disabled={callSubmitting}>
                  {callSubmitting ? "Saving…" : editingCallId ? "Save changes" : "Post casting call"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE ACCOUNT CONFIRM MODAL ── */}
      {showDeleteConfirm && (
        <div className="pd-modal-bg" onClick={() => setShowDeleteConfirm(false)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pd-modal-head">
              <div className="pd-modal-title">Delete account?</div>
              <button className="pd-modal-close" onClick={() => setShowDeleteConfirm(false)}>✕</button>
            </div>
            <div className="pd-modal-body">
              <p style={{ fontSize:13, color:"rgba(244,239,230,.5)", lineHeight:1.7, marginBottom:"1.5rem" }}>
                This will permanently remove your company profile, casting calls, applicant records, and message history from Casting.Home. This cannot be undone.
              </p>
              <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end" }}>
                <button className="btn-ghost-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={confirmDelete}>Yes, delete my account</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div className={`pd-toast${toast.isErr ? " err" : ""}`}>{toast.msg}</div>}
    </>
  );
}

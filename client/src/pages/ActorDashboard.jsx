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

/* ── keyframes ── */
@keyframes fadeUp {
  from { opacity:0; transform:translateY(18px); }
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
@keyframes barPulse {
  0%,100% { opacity:.15; }
  50%     { opacity:.28; }
}
@keyframes dotPulse {
  0%,100% { opacity:.5; transform:scale(1); }
  50%     { opacity:1;  transform:scale(1.25); }
}
@keyframes toastIn {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes spin {
  to { transform:rotate(360deg); }
}

/* ════════════ LAYOUT ════════════ */
.ad-layout {
  display:grid;
  grid-template-columns:220px 1fr;
  min-height:100vh;
}

/* ════════════ SIDEBAR ════════════ */
.ad-sidebar {
  background:${T.navyCard};
  border-right:1px solid ${T.divider};
  display:flex;
  flex-direction:column;
  position:sticky;
  top:0;
  height:100vh;
  overflow-y:auto;
  z-index:100;
  animation:fadeIn .5s ease both;
}

.ad-logo {
  padding:1.6rem 1.5rem 1.4rem;
  border-bottom:1px solid ${T.divider};
  display:flex;
  align-items:center;
  gap:11px;
  cursor:pointer;
  flex-shrink:0;
}
.ad-logo-mark {
  width:32px;height:32px;
  border:1px solid rgba(59,125,216,.38);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;position:relative;
}
.ad-logo-mark::after {
  content:'';position:absolute;inset:3px;
  border:1px solid rgba(59,125,216,.1);
}
.ad-logo-mark span {
  font-family:'DM Serif Display',serif;
  font-size:16px;color:${T.blue};
  position:relative;z-index:1;
}
.ad-logo-name {
  font-family:'DM Serif Display',serif;
  font-size:17px;color:${T.cream};letter-spacing:.1px;
}
.ad-logo-name em { font-style:normal;color:${T.blue}; }

.ad-actor-card {
  padding:1.4rem 1.5rem;
  border-bottom:1px solid ${T.divider};
  flex-shrink:0;
}
.ad-avatar {
  width:48px;height:48px;
  border-radius:50%;
  border:1px solid ${T.blueDim};
  background:${T.bluePale};
  display:flex;align-items:center;justify-content:center;
  font-size:20px;
  margin-bottom:.75rem;
}
.ad-actor-name {
  font-family:'DM Serif Display',serif;
  font-size:15px;font-weight:400;
  color:${T.cream};margin-bottom:3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.ad-actor-role {
  font-size:10px;letter-spacing:2.5px;text-transform:uppercase;
  color:${T.blue};opacity:.7;
}

.ad-completion {
  padding:1.1rem 1.5rem;
  border-bottom:1px solid ${T.divider};
  flex-shrink:0;
}
.ad-completion-row {
  display:flex;justify-content:space-between;align-items:baseline;
  margin-bottom:7px;
}
.ad-completion-label {
  font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
  color:rgba(244,239,230,.28);
}
.ad-completion-pct {
  font-family:'DM Serif Display',serif;
  font-size:15px;color:${T.blueLt};
}
.ad-bar-bg {
  height:2px;background:rgba(244,239,230,.07);overflow:hidden;
}
.ad-bar-fill {
  height:100%;
  background:linear-gradient(to right,${T.blue},${T.blueLt});
  transition:width .8s cubic-bezier(.22,1,.36,1);
}

.ad-nav {
  flex:1;padding:.75rem 0;overflow-y:auto;
}
.ad-nav-section {
  padding:.5rem 1.5rem .3rem;
  font-size:9px;letter-spacing:2.5px;text-transform:uppercase;
  color:rgba(244,239,230,.18);margin-top:.4rem;
}
.ad-nav-item {
  display:flex;align-items:center;gap:10px;
  padding:9px 1.5rem;
  font-size:13px;font-weight:400;
  color:rgba(244,239,230,.4);
  cursor:pointer;
  transition:color .2s,background .2s;
  border-left:2px solid transparent;
  position:relative;
}
.ad-nav-item:hover { color:rgba(244,239,230,.7);background:${T.faint}; }
.ad-nav-item.on {
  color:${T.blueLt};
  background:${T.bluePale};
  border-left-color:${T.blue};
}
.ad-nav-icon { font-size:14px;width:16px;text-align:center;flex-shrink:0; }
.ad-nav-badge {
  margin-left:auto;
  background:${T.blue};
  color:#fff;
  font-size:10px;font-weight:500;
  padding:1px 7px;letter-spacing:.3px;
}

.ad-sidebar-foot {
  padding:1.1rem 1.5rem;
  border-top:1px solid ${T.divider};
  flex-shrink:0;
}
.ad-signout {
  display:flex;align-items:center;gap:8px;
  font-size:12px;font-weight:300;
  color:rgba(244,239,230,.25);
  background:none;border:none;cursor:pointer;
  font-family:'Outfit',sans-serif;
  transition:color .2s;padding:0;
  letter-spacing:.3px;
}
.ad-signout:hover { color:rgba(200,80,80,.8); }

/* ════════════ MAIN ════════════ */
.ad-main {
  display:flex;flex-direction:column;
  min-height:100vh;
  overflow-x:hidden;
}

.ad-topbar {
  padding:1.1rem 2.5rem;
  border-bottom:1px solid ${T.divider};
  display:flex;justify-content:space-between;align-items:center;
  background:${T.navy};
  position:sticky;top:0;z-index:50;
  animation:fadeIn .5s ease both;
  gap:1rem;
}
.ad-topbar-title {
  font-family:'DM Serif Display',serif;
  font-size:22px;font-weight:400;color:${T.cream};
}
.ad-topbar-title em { font-style:italic;color:${T.blue}; }

.ad-topbar-actions { display:flex;align-items:center;gap:.85rem;flex-shrink:0; }

.btn-ghost-sm {
  display:flex;align-items:center;gap:7px;
  padding:8px 18px;
  border:1px solid ${T.divider};
  background:transparent;
  font-family:'Outfit',sans-serif;
  font-size:11px;letter-spacing:1.6px;text-transform:uppercase;
  font-weight:400;color:rgba(244,239,230,.45);
  cursor:pointer;
  transition:border-color .22s,color .22s;
}
.btn-ghost-sm:hover { border-color:rgba(59,125,216,.4);color:${T.cream}; }

.btn-solid-sm {
  position:relative;overflow:hidden;
  padding:8px 20px;
  background:${T.blue};border:none;
  font-family:'Outfit',sans-serif;
  font-size:11px;letter-spacing:1.6px;text-transform:uppercase;
  font-weight:500;color:#fff;cursor:pointer;
  transition:transform .24s,box-shadow .24s;
}
.btn-solid-sm::after {
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);
  background-size:500px 100%;opacity:0;transition:opacity .24s;
}
.btn-solid-sm:hover { transform:translateY(-1px);box-shadow:0 10px 30px rgba(59,125,216,.28); }
.btn-solid-sm:hover::after { opacity:1;animation:shimmer .7s linear; }
.btn-solid-sm:disabled { opacity:.4;cursor:not-allowed;transform:none;box-shadow:none; }

.btn-danger-sm {
  padding:8px 20px;
  background:transparent;
  border:1px solid rgba(201,97,95,.4);
  font-family:'Outfit',sans-serif;
  font-size:11px;letter-spacing:1.6px;text-transform:uppercase;
  font-weight:500;color:${T.red};cursor:pointer;
  transition:background .22s,border-color .22s;
}
.btn-danger-sm:hover { background:${T.redPale};border-color:${T.red}; }

/* ════════════ CONTENT ════════════ */
.ad-content {
  padding:2.25rem 2.5rem;
  flex:1;
  animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .08s both;
}

.ad-alert {
  display:flex;align-items:flex-start;gap:12px;
  padding:1rem 1.4rem;
  border:1px solid rgba(59,125,216,.2);
  background:${T.bluePale};
  margin-bottom:2rem;
  font-size:13px;font-weight:300;
  color:rgba(244,239,230,.5);
  line-height:1.6;
}
.ad-alert-icon { font-size:14px;flex-shrink:0;margin-top:1px; }
.ad-alert strong { color:${T.blueLt};font-weight:500; }

/* ════════════ SECTION CARD ════════════ */
.ad-section {
  background:${T.navyCard};
  border:1px solid ${T.divider};
  margin-bottom:1.25rem;
  overflow:hidden;
  transition:border-color .28s;
}
.ad-section:hover { border-color:rgba(59,125,216,.18); }

.ad-section-head {
  display:flex;align-items:center;justify-content:space-between;
  padding:1.25rem 1.6rem;
  border-bottom:1px solid transparent;
  cursor:pointer;user-select:none;
  transition:background .22s;
}
.ad-section-head:hover { background:${T.faint}; }
.ad-section-head.open { border-bottom-color:${T.divider}; }

.ad-section-left { display:flex;align-items:center;gap:12px; }
.ad-section-icon-box {
  width:36px;height:36px;
  border:1px solid ${T.divider};
  display:flex;align-items:center;justify-content:center;
  font-size:15px;flex-shrink:0;
  transition:border-color .25s,background .25s;
}
.ad-section-head:hover .ad-section-icon-box,
.ad-section-head.open .ad-section-icon-box {
  border-color:rgba(59,125,216,.3);
  background:${T.bluePale};
}
.ad-section-title {
  font-family:'DM Serif Display',serif;
  font-size:16px;font-weight:400;color:${T.cream};
  margin-bottom:2px;
}
.ad-section-sub {
  font-size:11px;font-weight:300;color:rgba(244,239,230,.28);
}

.ad-section-right { display:flex;align-items:center;gap:10px;flex-shrink:0; }
.ad-status-dot {
  width:6px;height:6px;border-radius:50%;
}
.ad-status-dot.done    { background:#4a9b6f; }
.ad-status-dot.partial { background:${T.blue};animation:dotPulse 2.5s ease-in-out infinite; }
.ad-status-dot.empty   { background:rgba(244,239,230,.12); }
.ad-status-text {
  font-size:10px;letter-spacing:.5px;color:rgba(244,239,230,.25);
}
.ad-chevron {
  font-size:10px;color:rgba(244,239,230,.2);
  transition:transform .28s cubic-bezier(.22,1,.36,1);
}
.ad-chevron.open { transform:rotate(180deg); }

.ad-section-body {
  padding:1.6rem;
}

/* ════════════ FORM ELEMENTS ════════════ */
.ad-field { margin-bottom:1.1rem; }
.ad-field:last-child { margin-bottom:0; }
.ad-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.1rem; }
.ad-grid-2:last-child { margin-bottom:0; }
.ad-grid-3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.1rem; }

.ad-label {
  display:block;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  font-weight:500;color:rgba(244,239,230,.3);
  margin-bottom:6px;
}

.ad-input {
  width:100%;padding:10px 12px;
  background:${T.navyMid};
  border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif;
  font-size:13.5px;font-weight:300;
  color:${T.cream};outline:none;
  transition:border-color .22s,background .22s;
  -webkit-font-smoothing:antialiased;
}
.ad-input::placeholder { color:rgba(244,239,230,.18); }
.ad-input:focus { border-color:rgba(59,125,216,.5);background:${T.navyLite}; }
.ad-input:disabled { color:rgba(244,239,230,.35);cursor:not-allowed; }

.ad-textarea {
  width:100%;padding:10px 12px;
  background:${T.navyMid};
  border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif;
  font-size:13.5px;font-weight:300;
  color:${T.cream};outline:none;
  resize:vertical;min-height:100px;line-height:1.7;
  transition:border-color .22s,background .22s;
}
.ad-textarea::placeholder { color:rgba(244,239,230,.18); }
.ad-textarea:focus { border-color:rgba(59,125,216,.5);background:${T.navyLite}; }

.ad-select {
  width:100%;padding:10px 12px;
  background:${T.navyMid};
  border:1px solid rgba(244,239,230,.07);
  font-family:'Outfit',sans-serif;
  font-size:13.5px;font-weight:300;
  color:${T.cream};outline:none;cursor:pointer;
  appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(59,125,216,0.5)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 12px center;
  padding-right:32px;
  transition:border-color .22s;
}
.ad-select:focus { border-color:rgba(59,125,216,.5); }
.ad-select option { background:${T.navyCard}; }

.ad-hint {
  font-size:11px;font-weight:300;
  color:rgba(244,239,230,.22);
  margin-top:.5rem;line-height:1.6;
}
.ad-error {
  font-size:11px;font-weight:400;
  color:${T.red};margin-top:.5rem;
}

/* ════════════ PHOTO UPLOAD ════════════ */
.ad-photos {
  display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;
}
.ad-photo-slot {
  aspect-ratio:3/4;
  border:1px dashed rgba(59,125,216,.2);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:8px;cursor:pointer;
  background:${T.navyMid};
  position:relative;overflow:hidden;
  transition:border-color .28s,background .28s;
}
.ad-photo-slot:hover { border-color:rgba(59,125,216,.5);background:${T.navyLite}; }
.ad-photo-slot.filled { border-style:solid;border-color:rgba(59,125,216,.3); }
.ad-photo-slot input[type=file] { position:absolute;inset:0;opacity:0;cursor:pointer; }
.ad-photo-preview { width:100%;height:100%;object-fit:cover;position:absolute;inset:0; }
.ad-photo-overlay {
  position:absolute;inset:0;
  background:rgba(7,17,43,.7);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:5px;opacity:0;transition:opacity .28s;
}
.ad-photo-slot:hover .ad-photo-overlay { opacity:1; }
.ad-photo-plus { font-size:20px;color:rgba(244,239,230,.35);line-height:1; }
.ad-photo-lbl {
  font-size:11px;letter-spacing:1.5px;text-transform:uppercase;
  color:rgba(244,239,230,.4);text-align:center;
}
.ad-photo-sub {
  font-size:10px;color:rgba(244,239,230,.22);text-align:center;
}
.ad-photo-change {
  font-size:11px;letter-spacing:1.5px;text-transform:uppercase;
  color:${T.blueLt};font-weight:500;
}

/* ════════════ VIDEO UPLOAD ════════════ */
.ad-video-drop {
  border:1px dashed rgba(59,125,216,.18);
  padding:2.25rem;text-align:center;
  background:${T.navyMid};
  cursor:pointer;position:relative;
  transition:border-color .28s,background .28s;
}
.ad-video-drop:hover { border-color:rgba(59,125,216,.45);background:${T.navyLite}; }
.ad-video-drop.filled { border-style:solid;border-color:rgba(59,125,216,.3); }
.ad-video-drop input[type=file] { position:absolute;inset:0;opacity:0;cursor:pointer; }
.ad-video-icon { font-size:28px;margin-bottom:.6rem; }
.ad-video-text {
  font-size:13.5px;font-weight:300;
  color:rgba(244,239,230,.42);margin-bottom:3px;
}
.ad-video-text strong { color:${T.blueLt};font-weight:500; }
.ad-video-sub { font-size:11px;color:rgba(244,239,230,.22); }
.ad-video-filename {
  display:inline-flex;align-items:center;gap:7px;
  margin-top:.85rem;padding:6px 14px;
  border:1px solid rgba(59,125,216,.2);
  background:${T.bluePale};
  font-size:12px;color:${T.blueLt};
}

.ad-video-tips {
  display:grid;grid-template-columns:repeat(3,1fr);gap:.85rem;
  margin-top:1rem;
}
.ad-tip {
  padding:.85rem 1rem;
  background:${T.navyMid};
  border:1px solid ${T.divider};
  font-size:12px;font-weight:300;
  color:rgba(244,239,230,.32);line-height:1.6;
}
.ad-tip strong {
  display:block;font-weight:500;
  color:rgba(244,239,230,.55);margin-bottom:3px;
  font-size:12px;
}

/* ════════════ SOCIAL ════════════ */
.ad-social-btns { display:flex;gap:.6rem;margin-bottom:1rem; }
.ad-social-btn {
  display:flex;align-items:center;gap:7px;
  padding:9px 14px;
  border:1px solid ${T.divider};
  background:transparent;
  font-family:'Outfit',sans-serif;
  font-size:12px;font-weight:400;
  color:rgba(244,239,230,.38);cursor:pointer;
  transition:border-color .22s,color .22s,background .22s;
}
.ad-social-btn:hover { border-color:rgba(59,125,216,.35);color:rgba(244,239,230,.65); }
.ad-social-btn.on { border-color:rgba(59,125,216,.5);color:${T.blueLt};background:${T.bluePale}; }

/* ════════════ PREVIEW MODAL ════════════ */
.ad-modal-bg {
  position:fixed;inset:0;z-index:200;
  background:rgba(4,10,20,.88);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;
  padding:2rem;
  animation:fadeIn .28s ease both;
}
.ad-modal {
  background:${T.navyCard};
  border:1px solid ${T.divider};
  width:100%;max-width:480px;
  max-height:85vh;overflow-y:auto;
  animation:fadeUp .35s cubic-bezier(.22,1,.36,1) both;
}
.ad-modal-head {
  padding:1.3rem 1.6rem;
  border-bottom:1px solid ${T.divider};
  display:flex;justify-content:space-between;align-items:center;
}
.ad-modal-title {
  font-family:'DM Serif Display',serif;
  font-size:18px;font-weight:400;color:${T.cream};
}
.ad-modal-close {
  background:none;border:none;
  color:rgba(244,239,230,.25);font-size:18px;
  cursor:pointer;transition:color .2s;padding:0;line-height:1;
}
.ad-modal-close:hover { color:${T.cream}; }
.ad-modal-body { padding:1.75rem; }

.ad-preview-avatar {
  width:64px;height:64px;border-radius:50%;
  border:1px solid ${T.blueDim};background:${T.bluePale};
  display:flex;align-items:center;justify-content:center;
  font-size:26px;margin:0 auto 1.1rem;
}
.ad-preview-name {
  font-family:'DM Serif Display',serif;
  font-size:22px;font-weight:400;color:${T.cream};
  text-align:center;margin-bottom:4px;
}
.ad-preview-meta {
  text-align:center;font-size:12px;font-weight:300;
  color:rgba(244,239,230,.35);margin-bottom:1.4rem;
}
.ad-preview-tags {
  display:flex;flex-wrap:wrap;gap:.45rem;
  justify-content:center;margin-bottom:1.5rem;
}
.ad-preview-tag {
  padding:4px 11px;
  border:1px solid rgba(59,125,216,.22);
  font-size:11px;font-weight:300;
  color:${T.blueLt};background:${T.bluePale};
  letter-spacing:.3px;
}
.ad-preview-sect { margin-bottom:1.1rem; }
.ad-preview-sect-label {
  font-size:9px;letter-spacing:2.5px;text-transform:uppercase;
  color:${T.blue};margin-bottom:.4rem;opacity:.8;
}
.ad-preview-sect-text {
  font-size:13px;font-weight:300;
  color:rgba(244,239,230,.42);line-height:1.75;
}

/* ════════════ TOAST ════════════ */
.ad-toast {
  position:fixed;bottom:2rem;right:2rem;z-index:300;
  display:flex;align-items:center;gap:9px;
  padding:11px 18px;
  background:${T.navyCard};
  border:1px solid rgba(74,155,111,.35);
  font-size:12px;font-weight:300;
  color:rgba(150,210,170,.9);
  letter-spacing:.3px;
  animation:toastIn .35s cubic-bezier(.22,1,.36,1) both;
  box-shadow:0 8px 32px rgba(0,0,0,.4);
}
.ad-toast.err {
  border-color:rgba(201,97,95,.4);
  color:rgba(230,160,158,.95);
}

/* ════════════ CASTING CALLS ════════════ */
.ad-cc-toolbar {
  display:flex;gap:.85rem;margin-bottom:1.5rem;flex-wrap:wrap;
}
.ad-cc-search {
  flex:1;min-width:200px;
}
.ad-cc-filters { display:flex;gap:.5rem;flex-wrap:wrap; }
.ad-cc-filter-btn {
  padding:8px 16px;
  border:1px solid ${T.divider};
  background:transparent;
  font-family:'Outfit',sans-serif;
  font-size:11px;letter-spacing:1px;text-transform:uppercase;
  color:rgba(244,239,230,.4);cursor:pointer;
  transition:all .2s;white-space:nowrap;
}
.ad-cc-filter-btn:hover { border-color:rgba(59,125,216,.35);color:${T.cream}; }
.ad-cc-filter-btn.on { border-color:${T.blue};color:${T.blueLt};background:${T.bluePale}; }

.ad-cc-grid { display:flex;flex-direction:column;gap:1rem; }
.ad-cc-card {
  background:${T.navyCard};
  border:1px solid ${T.divider};
  padding:1.5rem 1.75rem;
  transition:border-color .25s;
}
.ad-cc-card:hover { border-color:rgba(59,125,216,.22); }
.ad-cc-top {
  display:flex;justify-content:space-between;align-items:flex-start;
  gap:1rem;margin-bottom:.75rem;
}
.ad-cc-title-wrap { flex:1; }
.ad-cc-title {
  font-family:'DM Serif Display',serif;
  font-size:17px;font-weight:400;color:${T.cream};margin-bottom:3px;
}
.ad-cc-prod {
  font-size:12px;font-weight:300;color:${T.blueLt};
}
.ad-cc-type {
  flex-shrink:0;
  font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
  color:rgba(244,239,230,.4);
  border:1px solid ${T.divider};
  padding:4px 10px;
}
.ad-cc-meta {
  display:flex;gap:1.25rem;flex-wrap:wrap;
  font-size:12px;color:rgba(244,239,230,.35);
  margin-bottom:.85rem;
}
.ad-cc-meta span { display:flex;align-items:center;gap:5px; }
.ad-cc-desc {
  font-size:13px;font-weight:300;line-height:1.7;
  color:rgba(244,239,230,.5);margin-bottom:1rem;
}
.ad-cc-tags { display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1.1rem; }
.ad-cc-tag {
  font-size:10px;letter-spacing:.5px;
  padding:3px 9px;
  background:${T.faint};
  border:1px solid ${T.divider};
  color:rgba(244,239,230,.4);
}
.ad-cc-foot {
  display:flex;justify-content:space-between;align-items:center;
  padding-top:1rem;border-top:1px solid ${T.divider};
}
.ad-cc-deadline { font-size:11px;color:rgba(244,239,230,.3); }
.ad-cc-deadline strong { color:rgba(244,239,230,.55);font-weight:500; }
.ad-cc-applied {
  display:flex;align-items:center;gap:6px;
  font-size:11px;letter-spacing:1px;text-transform:uppercase;
  color:${T.green};font-weight:500;
}
.ad-cc-empty {
  text-align:center;padding:3.5rem 1rem;
  color:rgba(244,239,230,.28);font-size:13px;
}

/* ════════════ MESSAGES ════════════ */
.ad-msg-layout {
  display:grid;grid-template-columns:280px 1fr;
  background:${T.navyCard};
  border:1px solid ${T.divider};
  height:calc(100vh - 180px);
  min-height:420px;
}
.ad-msg-list {
  border-right:1px solid ${T.divider};
  overflow-y:auto;
}
.ad-msg-item {
  display:flex;gap:.75rem;
  padding:1rem 1.25rem;
  border-bottom:1px solid ${T.divider};
  cursor:pointer;
  transition:background .2s;
  position:relative;
}
.ad-msg-item:hover { background:${T.faint}; }
.ad-msg-item.on { background:${T.bluePale}; }
.ad-msg-avatar {
  width:38px;height:38px;border-radius:50%;flex-shrink:0;
  border:1px solid ${T.blueDim};background:${T.bluePale};
  display:flex;align-items:center;justify-content:center;font-size:16px;
}
.ad-msg-info { flex:1;min-width:0; }
.ad-msg-name {
  font-size:13px;font-weight:500;color:${T.cream};
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;
}
.ad-msg-role {
  font-size:10.5px;color:rgba(244,239,230,.32);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;
}
.ad-msg-preview {
  font-size:11.5px;color:rgba(244,239,230,.42);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.ad-msg-dot {
  width:8px;height:8px;border-radius:50%;background:${T.blue};
  position:absolute;top:1.15rem;right:1rem;
}
.ad-thread { display:flex;flex-direction:column;height:100%; }
.ad-thread-head {
  padding:1.1rem 1.5rem;border-bottom:1px solid ${T.divider};
  display:flex;align-items:center;gap:.75rem;flex-shrink:0;
}
.ad-thread-body {
  flex:1;overflow-y:auto;padding:1.5rem;
  display:flex;flex-direction:column;gap:.9rem;
}
.ad-bubble {
  max-width:65%;padding:10px 14px;
  font-size:13px;font-weight:300;line-height:1.6;
}
.ad-bubble.them {
  align-self:flex-start;
  background:${T.navyMid};border:1px solid ${T.divider};
  color:rgba(244,239,230,.75);
}
.ad-bubble.me {
  align-self:flex-end;
  background:${T.blue};color:#fff;
}
.ad-bubble-time {
  font-size:10px;margin-top:4px;opacity:.5;
}
.ad-thread-empty {
  flex:1;display:flex;align-items:center;justify-content:center;
  color:rgba(244,239,230,.25);font-size:13px;
}
.ad-thread-input {
  display:flex;gap:.6rem;padding:1rem 1.25rem;
  border-top:1px solid ${T.divider};flex-shrink:0;
}
.ad-thread-input input {
  flex:1;padding:10px 14px;
  background:${T.navyMid};border:1px solid rgba(244,239,230,.07);
  color:${T.cream};font-family:'Outfit',sans-serif;font-size:13px;outline:none;
}
.ad-thread-input input:focus { border-color:rgba(59,125,216,.5); }

/* ════════════ SETTINGS ════════════ */
.ad-settings-section {
  background:${T.navyCard};
  border:1px solid ${T.divider};
  padding:1.6rem 1.75rem;
  margin-bottom:1.25rem;
}
.ad-settings-title {
  font-family:'DM Serif Display',serif;
  font-size:16px;font-weight:400;color:${T.cream};margin-bottom:.25rem;
}
.ad-settings-sub {
  font-size:11.5px;font-weight:300;color:rgba(244,239,230,.32);
  margin-bottom:1.4rem;
}
.ad-toggle-row {
  display:flex;justify-content:space-between;align-items:center;
  padding:.85rem 0;border-bottom:1px solid ${T.divider};
}
.ad-toggle-row:last-child { border-bottom:none;padding-bottom:0; }
.ad-toggle-row:first-child { padding-top:0; }
.ad-toggle-label { font-size:13px;color:rgba(244,239,230,.7);margin-bottom:2px; }
.ad-toggle-desc { font-size:11px;color:rgba(244,239,230,.3); }
.ad-switch {
  width:38px;height:21px;border-radius:11px;
  background:rgba(244,239,230,.1);
  border:1px solid ${T.divider};
  position:relative;cursor:pointer;flex-shrink:0;
  transition:background .22s;
}
.ad-switch.on { background:${T.blue};border-color:${T.blue}; }
.ad-switch-knob {
  width:15px;height:15px;border-radius:50%;background:#fff;
  position:absolute;top:2px;left:2px;
  transition:transform .22s;
}
.ad-switch.on .ad-switch-knob { transform:translateX(17px); }
.ad-danger-row {
  display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;
}
.ad-danger-text { font-size:12.5px;color:rgba(244,239,230,.4);line-height:1.6;max-width:420px; }

/* ════════════ RESPONSIVE ════════════ */
@media(max-width:960px) {
  .ad-layout { grid-template-columns:1fr; }
  .ad-sidebar { display:none; }
  .ad-content { padding:1.5rem; }
  .ad-topbar { padding:1rem 1.5rem; }
  .ad-grid-2 { grid-template-columns:1fr; }
  .ad-grid-3 { grid-template-columns:1fr; }
  .ad-video-tips { grid-template-columns:1fr; }
  .ad-msg-layout { grid-template-columns:1fr; height:auto; }
  .ad-msg-list { max-height:220px; }
}
@media(max-width:500px) {
  .ad-photos { grid-template-columns:repeat(3,1fr);gap:.65rem; }
  .ad-topbar-actions .btn-ghost-sm { display:none; }
}
`;

/* ── Section accordion ── */
function Section({ icon, title, sub, defaultOpen = false, status = "empty", children }) {
  const [open, setOpen] = useState(defaultOpen);

  const statusMap = {
    done:    { dot:"done",    label:"Complete" },
    partial: { dot:"partial", label:"In progress" },
    empty:   { dot:"empty",   label:"Not started" },
  };
  const s = statusMap[status];

  return (
    <div className="ad-section">
      <div
        className={`ad-section-head${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="ad-section-left">
          <div className="ad-section-icon-box">{icon}</div>
          <div>
            <div className="ad-section-title">{title}</div>
            <div className="ad-section-sub">{sub}</div>
          </div>
        </div>
        <div className="ad-section-right">
          <div className={`ad-status-dot ${s.dot}`} />
          <span className="ad-status-text">{s.label}</span>
          <span className={`ad-chevron${open ? " open" : ""}`}>▾</span>
        </div>
      </div>
      {open && <div className="ad-section-body">{children}</div>}
    </div>
  );
}

/* ── toggle switch ── */
function Switch({ on, onToggle }) {
  return (
    <div className={`ad-switch${on ? " on" : ""}`} onClick={onToggle}>
      <div className="ad-switch-knob" />
    </div>
  );
}

/* ── mock casting calls (frontend-only placeholder data) ── */
const CASTING_CALLS = [
  {
    id: "cc1", title: "Lead Actress — Feature Film", production: "Himalayan Tales",
    type: "Film", location: "Kathmandu", ageRange: "22–28", gender: "Female",
    deadline: "2026-09-05",
    tags: ["Drama", "Nepali/English"],
    description: "Seeking a lead actress for a feature film exploring three generations of a Kathmandu family. Fluent Nepali required; English a plus.",
  },
  {
    id: "cc2", title: "Supporting Role — Web Series", production: "City Lights",
    type: "Web Series", location: "Pokhara", ageRange: "25–35", gender: "Male",
    deadline: "2026-08-28",
    tags: ["Comedy", "8-episode arc"],
    description: "A recurring supporting character across an 8-episode comedy series set in Pokhara. Prior on-camera experience preferred.",
  },
  {
    id: "cc3", title: "Brand Ambassador — TVC", production: "Everest Foods",
    type: "Ad", location: "Kathmandu", ageRange: "20–30", gender: "Any",
    deadline: "2026-08-22",
    tags: ["Commercial", "1-day shoot"],
    description: "National TV commercial for a food brand. Friendly, camera-ready presence. One-day shoot with same-day rate.",
  },
  {
    id: "cc4", title: "Ensemble Cast — Stage Play", production: "Nepal National Theatre",
    type: "Theatre", location: "Kathmandu", ageRange: "18–45", gender: "Any",
    deadline: "2026-09-15",
    tags: ["Live Theatre", "6-week rehearsal"],
    description: "Ensemble roles for an original stage production. Six weeks of rehearsal, three-week run. Prior theatre experience helpful but not required.",
  },
];

/* ── mock conversations (frontend-only placeholder data) ── */
const INITIAL_CONVERSATIONS = [
  {
    id: "m1", name: "Prakash Rai", role: "Casting Director · Himalayan Tales", avatar: "🎬", unread: true,
    messages: [
      { from: "them", text: "Hi! We loved your profile — are you available for a callback next week?", time: "10:12 AM" },
      { from: "me",   text: "Yes, I'm available. What day works for you?", time: "10:20 AM" },
      { from: "them", text: "Great — let's tentatively say Tuesday afternoon. I'll confirm the exact time by Friday.", time: "10:24 AM" },
    ],
  },
  {
    id: "m2", name: "Sunita Gurung", role: "Producer · City Lights", avatar: "🎥", unread: false,
    messages: [
      { from: "them", text: "Thanks for applying! We'll review submissions and get back within a week.", time: "Yesterday" },
    ],
  },
  {
    id: "m3", name: "Everest Foods Casting", role: "Ad Agency", avatar: "📣", unread: false,
    messages: [
      { from: "them", text: "Could you share a recent headshot without filters?", time: "Mon" },
      { from: "me",   text: "Sure, sending it over now.", time: "Mon" },
    ],
  },
];

/* ── main component ── */
export default function ActorDashboard() {
  const session = getSession();
  const storageKey = `ch_actor_profile:${session?.user?.id ?? "guest"}`;
  const applicationsKey = `ch_actor_applications:${session?.user?.id ?? "guest"}`;
  const notifKey = `ch_actor_notifications:${session?.user?.id ?? "guest"}`;

  const [info, setInfo] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return saved?.info || {
      fullName: session?.user?.name || "",
      age: session?.user?.age ? String(session.user.age) : "",
      height: "", gender: "male",
      phone: session?.user?.phone || "",
      city: "", experience: "",
    };
  });
  const [photos, setPhotos] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return saved?.photos || { right: null, front: null, left: null };
  });
  const [video, setVideo] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return saved?.video || null;
  });
  const [social, setSocial] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return saved?.social || { type: "instagram", url: "" };
  });

  const [activeNav, setActiveNav] = useState("profile");
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);

  // ── casting calls: applications persisted per-actor ──
  const [applied, setApplied] = useState(() => {
    return JSON.parse(localStorage.getItem(applicationsKey) || "[]");
  });
  const [ccSearch, setCcSearch] = useState("");
  const [ccFilter, setCcFilter] = useState("All");

  // ── messages ──
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvo, setActiveConvo] = useState(null);
  const [draft, setDraft] = useState("");

  // ── settings ──
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState("");
  const [notifs, setNotifs] = useState(() => {
    return JSON.parse(localStorage.getItem(notifKey) || "null") || {
      email: true, castingAlerts: true, messages: true,
    };
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem(notifKey, JSON.stringify(notifs));
  }, [notifs, notifKey]);

  const setI = (k) => (v) => setInfo((p) => ({ ...p, [k]: v }));

  const allFields = [
    info.fullName, info.age, info.height, info.phone, info.city,
    info.experience,
    photos.right, photos.front, photos.left,
    video, social.url,
  ];
  const pct = Math.round(allFields.filter(Boolean).length / allFields.length * 100);

  const status = (keys) => {
    const vals = keys.map((k) => {
      if (k.startsWith("photo.")) return photos[k.slice(6)];
      if (k === "video")          return video;
      if (k === "social")         return social.url;
      return info[k];
    });
    if (vals.every(Boolean)) return "done";
    if (vals.some(Boolean))  return "partial";
    return "empty";
  };

  const handlePhoto = (slot, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotos((p) => ({ ...p, [slot]: URL.createObjectURL(file) }));
  };

  const showToast = (msg, isErr = false) => {
    setToast({ msg, isErr });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify({ info, photos, video, social }));
    showToast("✓ Changes saved");
  };

  const handleSignOut = () => {
    clearSession();
    window.location.href = "/";
  };

  const toggleApply = (id) => {
    setApplied((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(applicationsKey, JSON.stringify(next));
      return next;
    });
  };

  const filteredCalls = useMemo(() => {
    return CASTING_CALLS.filter((c) => {
      const matchesType = ccFilter === "All" || c.type === ccFilter;
      const q = ccSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        c.production.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [ccSearch, ccFilter]);

  const openCallsNotApplied = CASTING_CALLS.filter((c) => !applied.includes(c.id)).length;

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

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(applicationsKey);
    localStorage.removeItem(notifKey);
    clearSession();
    window.location.href = "/";
  };

  const NAV = [
    { id:"profile",  icon:"👤", label:"My Profile" },
    { id:"casting",  icon:"🎬", label:"Casting Calls", badge: openCallsNotApplied > 0 ? String(openCallsNotApplied) : null },
    { id:"messages", icon:"✉️", label:"Messages", badge: conversations.some((c) => c.unread) ? String(conversations.filter((c) => c.unread).length) : null },
    { id:"settings", icon:"⚙️", label:"Settings" },
  ];

  const TITLES = {
    profile: <>My <em>Profile</em></>,
    casting: <>Casting <em>Calls</em></>,
    messages: <>My <em>Messages</em></>,
    settings: <>Account <em>Settings</em></>,
  };

  const activeConvoObj = conversations.find((c) => c.id === activeConvo);

  return (
    <>
      <style>{CSS}</style>

      <div className="ad-layout">

        {/* ── SIDEBAR ── */}
        <aside className="ad-sidebar">

          <div className="ad-logo">
            <div className="ad-logo-mark"><span>C</span></div>
            <span className="ad-logo-name">Casting<em>.Home</em></span>
          </div>

          <div className="ad-actor-card">
            <div className="ad-avatar">🎭</div>
            <div className="ad-actor-name">{info.fullName || "Your Name"}</div>
            <div className="ad-actor-role">Actor</div>
          </div>

          <div className="ad-completion">
            <div className="ad-completion-row">
              <span className="ad-completion-label">Profile</span>
              <span className="ad-completion-pct">{pct}%</span>
            </div>
            <div className="ad-bar-bg">
              <div className="ad-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <nav className="ad-nav">
            <div className="ad-nav-section">Menu</div>
            {NAV.map((item) => (
              <div
                key={item.id}
                className={`ad-nav-item${activeNav === item.id ? " on" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="ad-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className="ad-nav-badge">{item.badge}</span>
                )}
              </div>
            ))}
          </nav>

          <div className="ad-sidebar-foot">
            <button className="ad-signout" onClick={handleSignOut}>← Sign out</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="ad-main">

          {/* topbar */}
          <div className="ad-topbar">
            <div className="ad-topbar-title">{TITLES[activeNav]}</div>
            {activeNav === "profile" && (
              <div className="ad-topbar-actions">
                <button className="btn-ghost-sm" onClick={() => setShowPreview(true)}>
                  Preview
                </button>
                <button className="btn-solid-sm" onClick={handleSave}>
                  Save changes
                </button>
              </div>
            )}
          </div>

          {/* content */}
          <div className="ad-content">

            {/* ══════════ PROFILE VIEW ══════════ */}
            {activeNav === "profile" && (
              <>
                {pct < 100 && (
                  <div className="ad-alert">
                    <span className="ad-alert-icon">—</span>
                    <span>
                      Your profile is <strong>{pct}% complete.</strong> Fill in
                      all sections so producers can discover you.
                    </span>
                  </div>
                )}

                <Section
                  icon="👤"
                  title="Basic Information"
                  sub="Name, age, height, contact"
                  defaultOpen
                  status={status(["fullName","age","height","phone","city"])}
                >
                  <div className="ad-grid-2">
                    <div className="ad-field">
                      <label className="ad-label">Full Name</label>
                      <input className="ad-input" value={info.fullName}
                        onChange={(e) => setI("fullName")(e.target.value)}
                        placeholder="Aarav Sharma" />
                    </div>
                    <div className="ad-field">
                      <label className="ad-label">Age</label>
                      <input className="ad-input" type="number" value={info.age}
                        onChange={(e) => setI("age")(e.target.value)}
                        placeholder="24" />
                    </div>
                  </div>
                  <div className="ad-grid-2">
                    <div className="ad-field">
                      <label className="ad-label">Height</label>
                      <input className="ad-input" value={info.height}
                        onChange={(e) => setI("height")(e.target.value)}
                        placeholder="5'9&quot; or 175 cm" />
                    </div>
                    <div className="ad-field">
                      <label className="ad-label">Gender</label>
                      <select className="ad-select" value={info.gender}
                        onChange={(e) => setI("gender")(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other / Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="ad-grid-2">
                    <div className="ad-field">
                      <label className="ad-label">Phone</label>
                      <input className="ad-input" type="tel" value={info.phone}
                        onChange={(e) => setI("phone")(e.target.value)}
                        placeholder="98XXXXXXXX" />
                    </div>
                    <div className="ad-field">
                      <label className="ad-label">City</label>
                      <input className="ad-input" value={info.city}
                        onChange={(e) => setI("city")(e.target.value)}
                        placeholder="Kathmandu" />
                    </div>
                  </div>
                </Section>

                <Section
                  icon="📸"
                  title="Profile Photos"
                  sub="Right side · Front · Left side"
                  status={status(["photo.right","photo.front","photo.left"])}
                >
                  <div className="ad-photos">
                    {[
                      { key:"right", label:"Right Side", sub:"Turn right" },
                      { key:"front", label:"Front",      sub:"Face forward" },
                      { key:"left",  label:"Left Side",  sub:"Turn left" },
                    ].map(({ key, label, sub }) => (
                      <div
                        key={key}
                        className={`ad-photo-slot${photos[key] ? " filled" : ""}`}
                      >
                        <input type="file" accept="image/*"
                          onChange={(e) => handlePhoto(key, e)} />
                        {photos[key] ? (
                          <>
                            <img src={photos[key]} alt={label} className="ad-photo-preview" />
                            <div className="ad-photo-overlay">
                              <span className="ad-photo-change">Change</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="ad-photo-plus">+</div>
                            <div className="ad-photo-lbl">{label}</div>
                            <div className="ad-photo-sub">{sub}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="ad-hint" style={{ marginTop:".85rem" }}>
                    Clear, well-lit photos. JPEG or PNG, max 5 MB each.
                  </p>
                </Section>

                <Section
                  icon="⭐"
                  title="Experience"
                  sub="Films, theatre, training, special skills"
                  status={status(["experience"])}
                >
                  <div className="ad-field">
                    <label className="ad-label">Your background</label>
                    <textarea className="ad-textarea" value={info.experience}
                      onChange={(e) => setI("experience")(e.target.value)}
                      rows={5}
                      placeholder="Describe your acting experience — films, ads, theatre, training, languages, special skills like dancing or singing." />
                  </div>
                  <p className="ad-hint">
                    Be specific. Production names, roles, and years help producers evaluate you faster.
                  </p>
                </Section>

                <Section
                  icon="🎥"
                  title="Intro Video"
                  sub="~2 minutes in Nepali and English"
                  status={video ? "done" : "empty"}
                >
                  <div className={`ad-video-drop${video ? " filled" : ""}`}>
                    <input type="file" accept="video/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setVideo(f.name);
                      }} />
                    <div className="ad-video-icon">🎬</div>
                    <div className="ad-video-text">
                      <strong>Click to upload</strong> or drag and drop
                    </div>
                    <div className="ad-video-sub">MP4 or MOV · max 200 MB</div>
                    {video && (
                      <div className="ad-video-filename">✓ {video}</div>
                    )}
                  </div>
                  <div className="ad-video-tips">
                    {[
                      { title:"What to say",  body:"Name, age, where you're from, the kind of roles you enjoy." },
                      { title:"Language",     body:"Speak in both Nepali and English — switch halfway or blend naturally." },
                      { title:"Keep it real", body:"Producers want personality, not perfection. No script needed." },
                    ].map((t) => (
                      <div className="ad-tip" key={t.title}>
                        <strong>{t.title}</strong>{t.body}
                      </div>
                    ))}
                  </div>
                </Section>

                <Section
                  icon="🔗"
                  title="Social Media"
                  sub="Instagram or Facebook profile link"
                  status={status(["social"])}
                >
                  <div className="ad-field">
                    <label className="ad-label">Platform</label>
                    <div className="ad-social-btns">
                      {["instagram","facebook"].map((p) => (
                        <button
                          key={p}
                          className={`ad-social-btn${social.type === p ? " on" : ""}`}
                          type="button"
                          onClick={() => setSocial((s) => ({ ...s, type: p }))}
                        >
                          {p === "instagram" ? "📸" : "📘"}
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ad-field">
                    <label className="ad-label">Profile URL</label>
                    <input className="ad-input" value={social.url}
                      onChange={(e) => setSocial((s) => ({ ...s, url: e.target.value }))}
                      placeholder={
                        social.type === "instagram"
                          ? "https://instagram.com/yourhandle"
                          : "https://facebook.com/yourprofile"
                      } />
                  </div>
                </Section>
              </>
            )}

            {/* ══════════ CASTING CALLS VIEW ══════════ */}
            {activeNav === "casting" && (
              <>
                <div className="ad-cc-toolbar">
                  <input
                    className="ad-input ad-cc-search"
                    placeholder="Search by title, production, or location…"
                    value={ccSearch}
                    onChange={(e) => setCcSearch(e.target.value)}
                  />
                  <div className="ad-cc-filters">
                    {["All","Film","Web Series","Ad","Theatre"].map((f) => (
                      <button
                        key={f}
                        className={`ad-cc-filter-btn${ccFilter === f ? " on" : ""}`}
                        onClick={() => setCcFilter(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ad-cc-grid">
                  {filteredCalls.length === 0 && (
                    <div className="ad-cc-empty">No casting calls match your search.</div>
                  )}
                  {filteredCalls.map((c) => {
                    const isApplied = applied.includes(c.id);
                    return (
                      <div className="ad-cc-card" key={c.id}>
                        <div className="ad-cc-top">
                          <div className="ad-cc-title-wrap">
                            <div className="ad-cc-title">{c.title}</div>
                            <div className="ad-cc-prod">{c.production}</div>
                          </div>
                          <div className="ad-cc-type">{c.type}</div>
                        </div>
                        <div className="ad-cc-meta">
                          <span>📍 {c.location}</span>
                          <span>🎂 {c.ageRange}</span>
                          <span>⚧ {c.gender}</span>
                        </div>
                        <p className="ad-cc-desc">{c.description}</p>
                        <div className="ad-cc-tags">
                          {c.tags.map((t) => <span className="ad-cc-tag" key={t}>{t}</span>)}
                        </div>
                        <div className="ad-cc-foot">
                          <div className="ad-cc-deadline">
                            Apply by <strong>{new Date(c.deadline).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}</strong>
                          </div>
                          {isApplied ? (
                            <div className="ad-cc-applied">✓ Applied
                              <button
                                className="btn-ghost-sm"
                                style={{ marginLeft:10 }}
                                onClick={() => toggleApply(c.id)}
                              >
                                Withdraw
                              </button>
                            </div>
                          ) : (
                            <button className="btn-solid-sm" onClick={() => { toggleApply(c.id); showToast("✓ Application submitted"); }}>
                              Apply now
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ══════════ MESSAGES VIEW ══════════ */}
            {activeNav === "messages" && (
              <div className="ad-msg-layout">
                <div className="ad-msg-list">
                  {conversations.map((c) => (
                    <div
                      key={c.id}
                      className={`ad-msg-item${activeConvo === c.id ? " on" : ""}`}
                      onClick={() => openConvo(c.id)}
                    >
                      <div className="ad-msg-avatar">{c.avatar}</div>
                      <div className="ad-msg-info">
                        <div className="ad-msg-name">{c.name}</div>
                        <div className="ad-msg-role">{c.role}</div>
                        <div className="ad-msg-preview">
                          {c.messages[c.messages.length - 1]?.text}
                        </div>
                      </div>
                      {c.unread && <div className="ad-msg-dot" />}
                    </div>
                  ))}
                </div>

                <div className="ad-thread">
                  {activeConvoObj ? (
                    <>
                      <div className="ad-thread-head">
                        <div className="ad-msg-avatar">{activeConvoObj.avatar}</div>
                        <div>
                          <div className="ad-msg-name">{activeConvoObj.name}</div>
                          <div className="ad-msg-role">{activeConvoObj.role}</div>
                        </div>
                      </div>
                      <div className="ad-thread-body">
                        {activeConvoObj.messages.map((m, i) => (
                          <div className={`ad-bubble ${m.from}`} key={i}>
                            {m.text}
                            <div className="ad-bubble-time">{m.time}</div>
                          </div>
                        ))}
                      </div>
                      <div className="ad-thread-input">
                        <input
                          placeholder="Type a message…"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button className="btn-solid-sm" onClick={sendMessage}>Send</button>
                      </div>
                    </>
                  ) : (
                    <div className="ad-thread-empty">Select a conversation to view messages</div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════ SETTINGS VIEW ══════════ */}
            {activeNav === "settings" && (
              <>
                <div className="ad-settings-section">
                  <div className="ad-settings-title">Account</div>
                  <div className="ad-settings-sub">Your login details for Casting.Home</div>
                  <div className="ad-grid-2">
                    <div className="ad-field">
                      <label className="ad-label">Email</label>
                      <input className="ad-input" value={session?.user?.email || ""} disabled />
                    </div>
                    <div className="ad-field">
                      <label className="ad-label">Account type</label>
                      <input className="ad-input" value="Actor" disabled />
                    </div>
                  </div>
                </div>

                <div className="ad-settings-section">
                  <div className="ad-settings-title">Change Password</div>
                  <div className="ad-settings-sub">Choose a strong password you don't use elsewhere</div>
                  <div className="ad-field">
                    <label className="ad-label">Current Password</label>
                    <input className="ad-input" type="password" value={pwForm.current}
                      onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))} />
                  </div>
                  <div className="ad-grid-2">
                    <div className="ad-field">
                      <label className="ad-label">New Password</label>
                      <input className="ad-input" type="password" value={pwForm.next}
                        onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))} />
                    </div>
                    <div className="ad-field">
                      <label className="ad-label">Confirm New Password</label>
                      <input className="ad-input" type="password" value={pwForm.confirm}
                        onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} />
                    </div>
                  </div>
                  {pwErr && <div className="ad-error">{pwErr}</div>}
                  <div style={{ marginTop:"1rem" }}>
                    <button className="btn-solid-sm" onClick={submitPasswordChange}>Update password</button>
                  </div>
                </div>

                <div className="ad-settings-section">
                  <div className="ad-settings-title">Notifications</div>
                  <div className="ad-settings-sub">Choose what Casting.Home should email you about</div>
                  <div className="ad-toggle-row">
                    <div>
                      <div className="ad-toggle-label">Email notifications</div>
                      <div className="ad-toggle-desc">General account and activity emails</div>
                    </div>
                    <Switch on={notifs.email} onToggle={() => setNotifs((n) => ({ ...n, email: !n.email }))} />
                  </div>
                  <div className="ad-toggle-row">
                    <div>
                      <div className="ad-toggle-label">New casting call alerts</div>
                      <div className="ad-toggle-desc">Get notified when a matching role opens</div>
                    </div>
                    <Switch on={notifs.castingAlerts} onToggle={() => setNotifs((n) => ({ ...n, castingAlerts: !n.castingAlerts }))} />
                  </div>
                  <div className="ad-toggle-row">
                    <div>
                      <div className="ad-toggle-label">Message notifications</div>
                      <div className="ad-toggle-desc">Email me when a producer messages me</div>
                    </div>
                    <Switch on={notifs.messages} onToggle={() => setNotifs((n) => ({ ...n, messages: !n.messages }))} />
                  </div>
                </div>

                <div className="ad-settings-section">
                  <div className="ad-settings-title" style={{ color: T.red }}>Danger Zone</div>
                  <div className="ad-danger-row">
                    <div className="ad-danger-text">
                      Deleting your account removes your profile, photos, and applications.
                      This cannot be undone.
                    </div>
                    <button className="btn-danger-sm" onClick={() => setShowDeleteConfirm(true)}>
                      Delete account
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      {showPreview && (
        <div className="ad-modal-bg" onClick={() => setShowPreview(false)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <div className="ad-modal-title">Profile Preview</div>
              <button className="ad-modal-close"
                onClick={() => setShowPreview(false)}>✕</button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-preview-avatar">🎭</div>
              <div className="ad-preview-name">{info.fullName || "—"}</div>
              <div className="ad-preview-meta">
                {[info.age && `Age ${info.age}`, info.height, info.city]
                  .filter(Boolean).join(" · ") || "Complete your profile"}
              </div>
              <div className="ad-preview-tags">
                {info.gender && (
                  <span className="ad-preview-tag">
                    {info.gender.charAt(0).toUpperCase() + info.gender.slice(1)}
                  </span>
                )}
                {video     && <span className="ad-preview-tag">✓ Intro video</span>}
                {photos.front && <span className="ad-preview-tag">✓ Photos</span>}
                {social.url   && <span className="ad-preview-tag">{social.type.charAt(0).toUpperCase() + social.type.slice(1)}</span>}
              </div>
              {info.experience && (
                <div className="ad-preview-sect">
                  <div className="ad-preview-sect-label">Experience</div>
                  <div className="ad-preview-sect-text">{info.experience}</div>
                </div>
              )}
              <div className="ad-preview-sect">
                <div className="ad-preview-sect-label">Contact</div>
                <div className="ad-preview-sect-text">{info.phone || "—"}</div>
              </div>
              <p style={{ fontSize:11,color:"rgba(244,239,230,.18)",textAlign:"center",marginTop:"1.5rem" }}>
                This is how your profile appears to producers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE ACCOUNT CONFIRM MODAL ── */}
      {showDeleteConfirm && (
        <div className="ad-modal-bg" onClick={() => setShowDeleteConfirm(false)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <div className="ad-modal-title">Delete account?</div>
              <button className="ad-modal-close" onClick={() => setShowDeleteConfirm(false)}>✕</button>
            </div>
            <div className="ad-modal-body">
              <p style={{ fontSize:13, color:"rgba(244,239,230,.5)", lineHeight:1.7, marginBottom:"1.5rem" }}>
                This will permanently remove your profile, photos, applications, and
                message history from Casting.Home. This cannot be undone.
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
      {toast && (
        <div className={`ad-toast${toast.isErr ? " err" : ""}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}

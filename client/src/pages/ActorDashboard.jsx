import { useState } from "react";

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
@keyframes barGrow {
  from { width:0%; }
  to   { width:var(--w); }
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

/* logo */
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

/* actor card */
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

/* completion bar */
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

/* nav */
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

/* sidebar bottom */
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

/* topbar */
.ad-topbar {
  padding:1.1rem 2.5rem;
  border-bottom:1px solid ${T.divider};
  display:flex;justify-content:space-between;align-items:center;
  background:${T.navy};
  position:sticky;top:0;z-index:50;
  animation:fadeIn .5s ease both;
}
.ad-topbar-title {
  font-family:'DM Serif Display',serif;
  font-size:22px;font-weight:400;color:${T.cream};
}
.ad-topbar-title em { font-style:italic;color:${T.blue}; }

.ad-topbar-actions { display:flex;align-items:center;gap:.85rem; }

/* ghost button */
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

/* solid button — same as landing */
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

/* ════════════ CONTENT ════════════ */
.ad-content {
  padding:2.25rem 2.5rem;
  flex:1;
  animation:fadeUp .55s cubic-bezier(.22,1,.36,1) .08s both;
}

/* incomplete alert */
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

/* ════════════ RESPONSIVE ════════════ */
@media(max-width:960px) {
  .ad-layout { grid-template-columns:1fr; }
  .ad-sidebar { display:none; }
  .ad-content { padding:1.5rem; }
  .ad-topbar { padding:1rem 1.5rem; }
  .ad-grid-2 { grid-template-columns:1fr; }
  .ad-grid-3 { grid-template-columns:1fr; }
  .ad-video-tips { grid-template-columns:1fr; }
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

/* ── main component ── */
export default function ActorDashboard() {
  const [info, setInfo] = useState({
    fullName: "Aarav Sharma", age: "24", height: "",
    gender: "male", phone: "", city: "", experience: "",
  });
  const [photos, setPhotos]     = useState({ right: null, front: null, left: null });
  const [video, setVideo]       = useState(null);
  const [social, setSocial]     = useState({ type: "instagram", url: "" });
  const [activeNav, setActiveNav] = useState("profile");
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast]       = useState(false);

  const setI = (k) => (v) => setInfo((p) => ({ ...p, [k]: v }));

  /* completion % */
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

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const NAV = [
    { id:"profile",  icon:"👤", label:"My Profile" },
    { id:"casting",  icon:"🎬", label:"Casting Calls", badge:"3" },
    { id:"messages", icon:"✉️", label:"Messages" },
    { id:"settings", icon:"⚙️", label:"Settings" },
  ];

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
            <button className="ad-signout">← Sign out</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="ad-main">

          {/* topbar */}
          <div className="ad-topbar">
            <div className="ad-topbar-title">My <em>Profile</em></div>
            <div className="ad-topbar-actions">
              <button className="btn-ghost-sm" onClick={() => setShowPreview(true)}>
                Preview
              </button>
              <button className="btn-solid-sm" onClick={handleSave}>
                Save changes
              </button>
            </div>
          </div>

          {/* content */}
          <div className="ad-content">

            {pct < 100 && (
              <div className="ad-alert">
                <span className="ad-alert-icon">—</span>
                <span>
                  Your profile is <strong>{pct}% complete.</strong> Fill in
                  all sections so producers can discover you.
                </span>
              </div>
            )}

            {/* 1. Basic Info */}
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

            {/* 2. Photos */}
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

            {/* 3. Experience */}
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

            {/* 4. Intro Video */}
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

            {/* 5. Social Media */}
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

      {/* ── TOAST ── */}
      {toast && (
        <div className="ad-toast">
          ✓ Changes saved
        </div>
      )}
    </>
  );
}
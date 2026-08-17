import { useState } from "react";
import { signup, login, saveSession } from "../lib/api";

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
  err:      "#d95f5f",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}

body{
  font-family:'Outfit',sans-serif;
  background:${T.navy};
  color:${T.cream};
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}

::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:${T.navy}}
::-webkit-scrollbar-thumb{background:${T.blue};border-radius:2px}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(20px)}
  to  {opacity:1;transform:translateY(0)}
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes shimmer{
  from{background-position:-500px 0}
  to  {background-position: 500px 0}
}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideIn{
  from{opacity:0;transform:translateX(12px)}
  to  {opacity:1;transform:translateX(0)}
}
@keyframes barPulse{
  0%,100%{opacity:.15}
  50%    {opacity:.28}
}
@keyframes successPop{
  0%  {opacity:0;transform:scale(.86)}
  65% {transform:scale(1.04)}
  100%{opacity:1;transform:scale(1)}
}

/* ── PAGE ── */
.ap-page{
  min-height:100vh;
  display:grid;
  grid-template-columns:1fr 1fr;
}

/* ══════════ LEFT ══════════ */
.ap-left{
  background:${T.navyCard};
  border-right:1px solid ${T.divider};
  display:flex;flex-direction:column;
  justify-content:space-between;
  padding:2.5rem 3rem;
  position:relative;overflow:hidden;
}

/* dot grid */
.ap-left::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(circle,rgba(59,125,216,.1) 1px,transparent 1px);
  background-size:40px 40px;
  pointer-events:none;
  mask-image:radial-gradient(ellipse 80% 70% at 20% 60%,black 0%,transparent 65%);
  -webkit-mask-image:radial-gradient(ellipse 80% 70% at 20% 60%,black 0%,transparent 65%);
}

.ap-left-glow{
  position:absolute;top:-160px;left:-100px;
  width:500px;height:500px;border-radius:50%;
  background:radial-gradient(circle,rgba(59,125,216,.1) 0%,transparent 62%);
  pointer-events:none;
}
.ap-left-bar{
  position:absolute;left:0;top:0;bottom:0;width:2px;
  background:linear-gradient(to bottom,
    transparent 0%,${T.blue} 35%,rgba(59,125,216,.2) 70%,transparent 100%);
  animation:barPulse 4s ease-in-out infinite;
  pointer-events:none;
}

/* logo */
.ap-logo{
  display:flex;align-items:center;gap:11px;
  position:relative;z-index:1;
  cursor:pointer;text-decoration:none;
  animation:fadeIn .5s ease both;
}
.ap-logo-mark{
  width:34px;height:34px;
  border:1px solid rgba(59,125,216,.38);
  display:flex;align-items:center;justify-content:center;
  position:relative;flex-shrink:0;
}
.ap-logo-mark::after{
  content:'';position:absolute;inset:3px;
  border:1px solid rgba(59,125,216,.1);
}
.ap-logo-mark span{
  font-family:'DM Serif Display',serif;
  font-size:18px;color:${T.blue};
  position:relative;z-index:1;
}
.ap-logo-name{
  font-family:'DM Serif Display',serif;
  font-size:18px;color:${T.cream};letter-spacing:.1px;
}
.ap-logo-name em{font-style:normal;color:${T.blue}}

/* left editorial body */
.ap-left-body{
  position:relative;z-index:1;
  animation:fadeUp .8s cubic-bezier(.22,1,.36,1) .18s both;
}
.ap-left-over{
  display:inline-flex;align-items:center;gap:10px;
  font-size:10px;letter-spacing:3px;text-transform:uppercase;
  color:${T.blue};font-weight:400;margin-bottom:1.25rem;
}
.ap-left-over::before{
  content:'';width:18px;height:1px;background:${T.blue};opacity:.55;
}
.ap-left-h{
  font-family:'DM Serif Display',serif;
  font-size:clamp(26px,2.8vw,40px);
  font-weight:400;line-height:1.15;
  color:${T.cream};margin-bottom:1rem;
}
.ap-left-h em{font-style:italic;color:${T.blue}}
.ap-left-p{
  font-size:13.5px;font-weight:300;line-height:1.88;
  color:rgba(244,239,230,.36);
  max-width:300px;margin-bottom:2rem;
}

/* role badge */
.ap-role-badge{
  display:inline-flex;align-items:center;gap:8px;
  border:1px solid rgba(59,125,216,.22);
  padding:9px 14px;
  background:${T.bluePale};
  font-size:12px;font-weight:400;
  color:${T.blueLt};margin-bottom:2rem;
}

/* feature list */
.ap-feats{display:flex;flex-direction:column;gap:.6rem}
.ap-feat{
  display:flex;align-items:baseline;gap:10px;
  font-size:13px;font-weight:300;
  color:rgba(244,239,230,.32);
}
.ap-feat-dash{color:${T.blue};font-size:11px;opacity:.6;flex-shrink:0}

/* left footer */
.ap-left-foot{
  position:relative;z-index:1;
  font-size:11px;color:rgba(244,239,230,.16);letter-spacing:.3px;
  animation:fadeIn .8s ease .5s both;
}

/* ══════════ RIGHT ══════════ */
.ap-right{
  background:${T.navy};
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:3rem 2.5rem;
  position:relative;overflow-y:auto;
}

/* subtle dot grid */
.ap-right::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(circle,rgba(59,125,216,.06) 1px,transparent 1px);
  background-size:36px 36px;
  pointer-events:none;
  mask-image:radial-gradient(ellipse 60% 60% at 70% 40%,black 0%,transparent 65%);
  -webkit-mask-image:radial-gradient(ellipse 60% 60% at 70% 40%,black 0%,transparent 65%);
}

.ap-form-wrap{
  width:100%;max-width:390px;
  position:relative;z-index:1;
}

/* back button */
.ap-back{
  display:inline-flex;align-items:center;gap:7px;
  font-size:11px;letter-spacing:1.5px;text-transform:uppercase;
  font-weight:400;color:rgba(244,239,230,.28);
  background:none;border:none;cursor:pointer;
  margin-bottom:2rem;
  transition:color .2s;padding:0;
  animation:fadeIn .5s ease both;
}
.ap-back:hover{color:rgba(244,239,230,.6)}
.ap-back-arr{display:inline-block;transition:transform .22s}
.ap-back:hover .ap-back-arr{transform:translateX(-3px)}

/* tabs */
.ap-tabs{
  display:flex;
  border:1px solid ${T.divider};
  margin-bottom:2.25rem;
  overflow:hidden;
  animation:fadeIn .55s ease .1s both;
}
.ap-tab{
  flex:1;padding:10px;
  font-family:'Outfit',sans-serif;
  font-size:11px;letter-spacing:1.8px;text-transform:uppercase;
  font-weight:500;
  background:transparent;border:none;
  color:rgba(244,239,230,.3);cursor:pointer;
  transition:background .25s,color .25s;
}
.ap-tab.on{background:${T.blue};color:#fff}
.ap-tab:not(.on):hover{
  color:rgba(244,239,230,.6);
  background:rgba(59,125,216,.06);
}

/* form heading */
.ap-head{
  margin-bottom:1.75rem;
  animation:fadeUp .6s cubic-bezier(.22,1,.36,1) .15s both;
}
.ap-head-title{
  font-family:'DM Serif Display',serif;
  font-size:clamp(24px,3vw,32px);
  font-weight:400;color:${T.cream};
  margin-bottom:.35rem;line-height:1.15;
}
.ap-head-title em{font-style:italic;color:${T.blue}}
.ap-head-sub{
  font-size:13px;font-weight:300;line-height:1.7;
  color:rgba(244,239,230,.32);
}
.ap-head-sub button{
  background:none;border:none;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:400;
  color:${T.blueLt};cursor:pointer;padding:0;margin-left:4px;
  text-decoration:underline;text-underline-offset:3px;
  transition:color .2s;
}
.ap-head-sub button:hover{color:${T.cream}}

/* form layout */
.ap-form{
  display:flex;flex-direction:column;gap:1rem;
  animation:slideIn .3s ease both;
}
.ap-row{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
.ap-field{display:flex;flex-direction:column;gap:5px}
.ap-label{
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  font-weight:500;color:rgba(244,239,230,.32);
}
.ap-input-wrap{position:relative}
.ap-input{
  width:100%;padding:11px 13px;
  background:${T.navyCard};
  border:1px solid rgba(244,239,230,.08);
  font-family:'Outfit',sans-serif;
  font-size:13.5px;font-weight:300;
  color:${T.cream};outline:none;
  transition:border-color .22s,background .22s;
  -webkit-font-smoothing:antialiased;
}
.ap-input::placeholder{color:rgba(244,239,230,.18)}
.ap-input:focus{
  border-color:rgba(59,125,216,.5);
  background:${T.navyLite};
}
.ap-input.err{border-color:${T.err}}

.ap-eye{
  position:absolute;right:11px;top:50%;
  transform:translateY(-50%);
  background:none;border:none;
  color:rgba(244,239,230,.25);cursor:pointer;
  font-size:15px;padding:0;line-height:1;
  transition:color .2s;
}
.ap-eye:hover{color:rgba(244,239,230,.6)}

.ap-err-text{
  font-size:11px;font-weight:300;
  color:${T.err};letter-spacing:.2px;
}

.ap-form-err{
  background:rgba(214,80,80,.1); border:1px solid rgba(214,80,80,.35);
  color:#e28b8b; font-size:.85rem; padding:.6rem .8rem; border-radius:8px;
}
.ap-forgot{text-align:right;margin-top:-.25rem}
.ap-forgot button{
  background:none;border:none;cursor:pointer;padding:0;
  font-family:'Outfit',sans-serif;
  font-size:11px;font-weight:300;
  color:rgba(244,239,230,.25);
  transition:color .2s;
  text-decoration:underline;text-underline-offset:3px;
}
.ap-forgot button:hover{color:rgba(244,239,230,.55)}

/* submit button — same as landing page */
.btn-solid{
  position:relative;overflow:hidden;
  width:100%;padding:14px;margin-top:.25rem;
  background:${T.blue};border:none;
  font-family:'Outfit',sans-serif;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  font-weight:500;color:#fff;cursor:pointer;
  transition:transform .26s,box-shadow .26s,opacity .26s;
}
.btn-solid::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent);
  background-size:500px 100%;opacity:0;transition:opacity .26s;
}
.btn-solid:not(:disabled):hover{
  transform:translateY(-2px);
  box-shadow:0 14px 40px rgba(59,125,216,.28);
}
.btn-solid:not(:disabled):hover::after{opacity:1;animation:shimmer .7s linear}
.btn-solid:disabled{opacity:.3;cursor:not-allowed}

.ap-spinner{
  display:inline-block;
  width:12px;height:12px;
  border:1.5px solid rgba(255,255,255,.3);
  border-top-color:#fff;border-radius:50%;
  animation:spin .65s linear infinite;
  vertical-align:middle;margin-right:7px;
}

/* or divider */
.ap-or{
  display:flex;align-items:center;gap:.85rem;
  margin:1.5rem 0;
}
.ap-or-line{flex:1;height:1px;background:${T.divider}}
.ap-or-text{
  font-size:11px;font-weight:300;
  color:rgba(244,239,230,.18);white-space:nowrap;
}

/* switch hint */
.ap-switch{
  text-align:center;
  font-size:13px;font-weight:300;
  color:rgba(244,239,230,.28);
  animation:fadeIn .7s ease .35s both;
}
.ap-switch button{
  background:none;border:none;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:400;
  color:${T.blueLt};cursor:pointer;padding:0;margin-left:4px;
  text-decoration:underline;text-underline-offset:3px;
  transition:color .2s;
}
.ap-switch button:hover{color:${T.cream}}

/* success */
.ap-success{
  display:flex;flex-direction:column;align-items:center;
  text-align:center;gap:1.1rem;padding:2.5rem 0;
  animation:successPop .5s cubic-bezier(.22,1,.36,1) both;
}
.ap-success-ring{
  width:62px;height:62px;border-radius:50%;
  border:1px solid rgba(59,125,216,.3);
  background:${T.bluePale};
  display:flex;align-items:center;justify-content:center;
  font-size:24px;
}
.ap-success h3{
  font-family:'DM Serif Display',serif;
  font-size:26px;font-weight:400;color:${T.cream};
}
.ap-success h3 em{font-style:italic;color:${T.blue}}
.ap-success p{
  font-size:13.5px;font-weight:300;line-height:1.8;
  color:rgba(244,239,230,.36);max-width:280px;
}

/* ── responsive ── */
@media(max-width:780px){
  .ap-page{grid-template-columns:1fr}
  .ap-left{display:none}
  .ap-right{
    padding:2.5rem 1.5rem;
    justify-content:flex-start;
    min-height:100vh;
  }
  .ap-form-wrap{padding-top:.5rem}
}
@media(max-width:420px){
  .ap-right{padding:2rem 1.25rem}
  .ap-row{grid-template-columns:1fr}
  .ap-head-title{font-size:22px}
}
`;

/* ── Role config ── */
const ROLES = {
  actor: {
    icon: "🎭", label: "Actor",
    headline: ["Your stage", "starts here."],
    desc: "Create your profile and get discovered by Nepal's producers. Free to register, always.",
    feats: ["3-angle professional photos", "Bilingual intro video", "Experience & credits", "Always free — no expiry"],
  },
  producer: {
    icon: "🎬", label: "Producer",
    headline: ["Find your", "perfect cast."],
    desc: "Post a brief and receive a hand-curated shortlist of actors delivered to your inbox within 24 hours.",
    feats: ["Submit a casting brief", "Specify role type & feel", "Hand-picked actor profiles", "24-hour email delivery"],
  },
};

/* ── Field ── */
function Field({ label, type = "text", placeholder, value, onChange, error, children }) {
  return (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      <div className="ap-input-wrap">
        <input
          className={`ap-input${error ? " err" : ""}`}
          type={type} placeholder={placeholder}
          value={value} onChange={(e) => onChange(e.target.value)}
          style={children ? { paddingRight: 38 } : {}}
        />
        {children}
      </div>
      {error && <span className="ap-err-text">{error}</span>}
    </div>
  );
}

/* ── Eye toggle ── */
function Eye({ show, onToggle }) {
  return (
    <button className="ap-eye" type="button" onClick={onToggle} tabIndex={-1}>
      {show ? "🙈" : "👁"}
    </button>
  );
}

/* ── Actor form ── */
function ActorForm({ onSuccess }) {
  const [f, setF]         = useState({ name:"", age:"", email:"", phone:"", pass:"", confirm:"" });
  const [showP, setShowP] = useState(false);
  const [errs, setErrs]   = useState({});
  const [loading, setL]   = useState(false);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim())                        e.name    = "Name is required";
    if (!f.age || +f.age < 5 || +f.age > 90) e.age     = "Enter a valid age";
    if (!f.email.includes("@"))               e.email   = "Enter a valid email";
    if (!/^\d{10}$/.test(f.phone))            e.phone   = "10-digit number";
    if (f.pass.length < 6)                    e.pass    = "Min 6 characters";
    if (f.pass !== f.confirm)                 e.confirm = "Passwords don't match";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({}); setL(true);
    try {
      const { token, user } = await signup({
        role: "actor",
        name: f.name,
        age: f.age,
        email: f.email,
        phone: f.phone,
        password: f.pass,
      });
      saveSession({ token, user });
      setL(false); onSuccess("actor", user);
    } catch (err) {
      setL(false); setErrs({ form: err.message });
    }
  };

  return (
    <div className="ap-form">
      {errs.form && <div className="ap-form-err">{errs.form}</div>}
      <div className="ap-row">
        <Field label="Full Name" value={f.name} onChange={set("name")} placeholder="Aarav Sharma" error={errs.name} />
        <Field label="Age" type="number" value={f.age} onChange={set("age")} placeholder="24" error={errs.age} />
      </div>
      <Field label="Email" type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" error={errs.email} />
      <Field label="Phone" type="tel" value={f.phone} onChange={set("phone")} placeholder="98XXXXXXXX" error={errs.phone} />
      <Field label="Password" type={showP ? "text" : "password"} value={f.pass} onChange={set("pass")} placeholder="Min 6 characters" error={errs.pass}>
        <Eye show={showP} onToggle={() => setShowP((s) => !s)} />
      </Field>
      <Field label="Confirm Password" type="password" value={f.confirm} onChange={set("confirm")} placeholder="Re-enter password" error={errs.confirm} />
      <button className="btn-solid" onClick={submit} disabled={loading}>
        {loading && <span className="ap-spinner" />}
        {loading ? "Creating profile…" : "Create Actor Profile"}
      </button>
    </div>
  );
}

/* ── Producer form ── */
function ProducerForm({ onSuccess }) {
  const [f, setF]         = useState({ name:"", company:"", email:"", phone:"", pass:"", confirm:"" });
  const [showP, setShowP] = useState(false);
  const [errs, setErrs]   = useState({});
  const [loading, setL]   = useState(false);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.name.trim())           e.name    = "Name is required";
    if (!f.company.trim())        e.company = "Company name required";
    if (!f.email.includes("@"))   e.email   = "Enter a valid email";
    if (!/^\d{10}$/.test(f.phone))e.phone   = "10-digit number";
    if (f.pass.length < 6)        e.pass    = "Min 6 characters";
    if (f.pass !== f.confirm)     e.confirm = "Passwords don't match";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({}); setL(true);
    try {
      const { token, user } = await signup({
        role: "producer",
        name: f.name,
        company: f.company,
        email: f.email,
        phone: f.phone,
        password: f.pass,
      });
      saveSession({ token, user });
      setL(false); onSuccess("producer", user);
    } catch (err) {
      setL(false); setErrs({ form: err.message });
    }
  };

  return (
    <div className="ap-form">
      {errs.form && <div className="ap-form-err">{errs.form}</div>}
      <div className="ap-row">
        <Field label="Your Name" value={f.name} onChange={set("name")} placeholder="Ramesh Thapa" error={errs.name} />
        <Field label="Company" value={f.company} onChange={set("company")} placeholder="XYZ Films" error={errs.company} />
      </div>
      <Field label="Email" type="email" value={f.email} onChange={set("email")} placeholder="you@company.com" error={errs.email} />
      <Field label="Phone" type="tel" value={f.phone} onChange={set("phone")} placeholder="98XXXXXXXX" error={errs.phone} />
      <Field label="Password" type={showP ? "text" : "password"} value={f.pass} onChange={set("pass")} placeholder="Min 6 characters" error={errs.pass}>
        <Eye show={showP} onToggle={() => setShowP((s) => !s)} />
      </Field>
      <Field label="Confirm Password" type="password" value={f.confirm} onChange={set("confirm")} placeholder="Re-enter password" error={errs.confirm} />
      <button className="btn-solid" onClick={submit} disabled={loading}>
        {loading && <span className="ap-spinner" />}
        {loading ? "Setting up account…" : "Create Producer Account"}
      </button>
    </div>
  );
}

/* ── Login form ── */
function LoginForm({ onSuccess }) {
  const [f, setF]         = useState({ email:"", pass:"" });
  const [showP, setShowP] = useState(false);
  const [errs, setErrs]   = useState({});
  const [loading, setL]   = useState(false);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    const e = {};
    if (!f.email.includes("@")) e.email = "Enter a valid email";
    if (!f.pass)                e.pass  = "Password is required";
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({}); setL(true);
    try {
      const { token, user } = await login({ email: f.email, password: f.pass });
      saveSession({ token, user });
      setL(false); onSuccess("login", user);
    } catch (err) {
      setL(false); setErrs({ form: err.message });
    }
  };

  return (
    <div className="ap-form">
      {errs.form && <div className="ap-form-err">{errs.form}</div>}
      <Field label="Email" type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" error={errs.email} />
      <Field label="Password" type={showP ? "text" : "password"} value={f.pass} onChange={set("pass")} placeholder="Your password" error={errs.pass}>
        <Eye show={showP} onToggle={() => setShowP((s) => !s)} />
      </Field>
      <div className="ap-forgot">
        <button type="button">Forgot password?</button>
      </div>
      <button className="btn-solid" onClick={submit} disabled={loading}>
        {loading && <span className="ap-spinner" />}
        {loading ? "Signing you in…" : "Sign In"}
      </button>
    </div>
  );
}

/* ── Success screen ── */
function SuccessScreen({ type }) {
  const map = {
    actor:    { icon:"🎭", h:["Profile","created!"],  p:"Your actor profile is live. Our team will review it and match you with the right productions." },
    producer: { icon:"🎬", h:["Account","ready!"],    p:"Your producer account is set up. Post your first casting call and we'll get to work." },
    login:    { icon:"✦",  h:["Welcome","back!"],     p:"You're signed in. Redirecting you to your dashboard shortly." },
  };
  const m = map[type];
  return (
    <div className="ap-success">
      <div className="ap-success-ring">{m.icon}</div>
      <h3>{m.h[0]} <em>{m.h[1]}</em></h3>
      <p>{m.p}</p>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN — AuthPage

   Props:
     role       "actor" | "producer"   — pre-set from RoleSelection
     initialTab "signup" | "login"     — default: "signup"
     onBack()                          — go back to RoleSelection
     onHome()                          — go to landing page
════════════════════════════════════════ */
export default function AuthPage({
  role: initialRole = "actor",
  initialTab        = "signup",
  onBack,
  onHome,
  onAuthSuccess,
}) {
  const [tab,     setTab]     = useState(initialTab);
  const [role,    setRole]    = useState(initialRole);
  const [success, setSuccess] = useState(null);

  const cfg = ROLES[role];

  const switchTab = (t) => { setSuccess(null); setTab(t); };
  const flipRole  = ()  => { setSuccess(null); setRole((r) => r === "actor" ? "producer" : "actor"); };

  // Called by ActorForm / ProducerForm / LoginForm once the API call succeeds.
  // Shows the success screen briefly, then hands off to the router so it can
  // send actors to /actor-dashboard and producers to /producer-dashboard.
  const handleAuthed = (type, user) => {
    setSuccess(type);
    setTimeout(() => {
      onAuthSuccess?.(user);
    }, 1200);
  };

  const leftOver = tab === "signup" ? `Joining as ${cfg.label}` : "Welcome back";
  const leftH    = tab === "signup"
    ? <>{cfg.headline[0]} <em>{cfg.headline[1]}</em></>
    : <>Good to see <em>you again.</em></>;
  const leftP    = tab === "signup"
    ? cfg.desc
    : "Sign in to access your profile, manage casting calls, and pick up where you left off.";

  return (
    <>
      <style>{CSS}</style>
      <div className="ap-page">

        {/* ══ LEFT ══ */}
        <div className="ap-left">
          <div className="ap-left-glow" />
          <div className="ap-left-bar"  />

          <div className="ap-logo" onClick={onHome}>
            <div className="ap-logo-mark"><span>C</span></div>
            <span className="ap-logo-name">Casting<em>.Home</em></span>
          </div>

          <div className="ap-left-body">
            <div className="ap-left-over">{leftOver}</div>
            <h2 className="ap-left-h">{leftH}</h2>
            <p className="ap-left-p">{leftP}</p>

            {tab === "signup" && (
              <>
                <div className="ap-role-badge">
                  <span>{cfg.icon}</span>
                  {cfg.label} account
                </div>
                <div className="ap-feats">
                  {cfg.feats.map((feat) => (
                    <div className="ap-feat" key={feat}>
                      <span className="ap-feat-dash">—</span>
                      {feat}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="ap-left-foot">
            © 2025 Casting.Home · Kathmandu, Nepal
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="ap-right">
          <div className="ap-form-wrap">

            {/* back to role selection */}
            <button className="ap-back" onClick={onBack}>
              <span className="ap-back-arr">←</span> Back
            </button>

            {/* tabs */}
            <div className="ap-tabs">
              <button className={`ap-tab${tab === "signup" ? " on" : ""}`} onClick={() => switchTab("signup")}>Sign Up</button>
              <button className={`ap-tab${tab === "login"  ? " on" : ""}`} onClick={() => switchTab("login")}>Log In</button>
            </div>

            {success ? (
              <SuccessScreen type={success} />
            ) : (
              <>
                {/* heading */}
                <div className="ap-head">
                  {tab === "signup" ? (
                    <>
                      <div className="ap-head-title">Create your <em>account</em></div>
                      <p className="ap-head-sub">
                        Registering as {role === "actor" ? "an" : "a"} {cfg.label.toLowerCase()}.
                        <button onClick={flipRole}>
                          Switch to {role === "actor" ? "Producer" : "Actor"}
                        </button>
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="ap-head-title">Welcome <em>back</em></div>
                      <p className="ap-head-sub">Sign in to your Casting.Home account.</p>
                    </>
                  )}
                </div>

                {/* forms — role-aware */}
                {tab === "signup" && role === "actor"    && <ActorForm    onSuccess={handleAuthed} />}
                {tab === "signup" && role === "producer" && <ProducerForm onSuccess={handleAuthed} />}
                {tab === "login"                         && <LoginForm    onSuccess={handleAuthed} />}

                <div className="ap-or">
                  <div className="ap-or-line" />
                  <span className="ap-or-text">or</span>
                  <div className="ap-or-line" />
                </div>

                <p className="ap-switch">
                  {tab === "signup"
                    ? <>Already have an account?<button onClick={() => switchTab("login")}>Log in</button></>
                    : <>Don't have an account?<button onClick={() => switchTab("signup")}>Sign up</button></>
                  }
                </p>
              </>
            )}

          </div>
        </div>

      </div>
    </>
  );
}
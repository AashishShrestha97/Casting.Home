import { getSession, clearSession } from "../lib/api";

const T = {
  navy:     "#07112B",
  navyCard: "#0D1E3F",
  cream:    "#F4EFE6",
  creamSub: "#C8C0B4",
  blue:     "#3B7DD8",
  divider:  "rgba(244,239,230,0.08)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Outfit',sans-serif;background:${T.navy};color:${T.cream};}
.pd-page{min-height:100vh;padding:2.5rem;}
.pd-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;}
.pd-logo{font-family:'DM Serif Display',serif;font-size:1.4rem;}
.pd-logo em{font-style:normal;color:${T.blue};}
.pd-signout{background:transparent;border:1px solid ${T.divider};color:${T.creamSub};
  padding:.5rem 1rem;border-radius:8px;cursor:pointer;font-family:inherit;}
.pd-signout:hover{border-color:${T.blue};color:${T.cream};}
.pd-hero h1{font-family:'DM Serif Display',serif;font-size:2rem;font-weight:400;margin-bottom:.5rem;}
.pd-hero em{font-style:italic;color:${T.blue};}
.pd-hero p{color:${T.creamSub};max-width:520px;line-height:1.6;}
.pd-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-top:2.5rem;}
.pd-card{background:${T.navyCard};border:1px solid ${T.divider};border-radius:14px;padding:1.5rem;}
.pd-card h3{font-weight:400;margin-bottom:.4rem;}
.pd-card p{color:${T.creamSub};font-size:.9rem;line-height:1.5;}
`;

export default function ProducerDashboard() {
  const session = getSession();

  return (
    <>
      <style>{CSS}</style>
      <div className="pd-page">
        <div className="pd-top">
          <div className="pd-logo">Casting<em>.Home</em></div>
          <button
            className="pd-signout"
            onClick={() => { clearSession(); window.location.href = "/"; }}
          >
            Sign out
          </button>
        </div>

        <div className="pd-hero">
          <h1>Welcome, <em>{session?.user?.name?.split(" ")[0] || "Producer"}</em></h1>
          <p>
            {session?.user?.company ? `${session.user.company} — ` : ""}
            this is your producer dashboard. Post casting calls, review actor
            submissions, and manage your productions from here.
          </p>
        </div>

        <div className="pd-cards">
          <div className="pd-card">
            <h3>Post a Casting Call</h3>
            <p>Describe the role, and we'll match you with the right actors.</p>
          </div>
          <div className="pd-card">
            <h3>Active Calls</h3>
            <p>No casting calls posted yet.</p>
          </div>
          <div className="pd-card">
            <h3>Submissions</h3>
            <p>Actor profiles matched to your calls will show up here.</p>
          </div>
        </div>
      </div>
    </>
  );
}

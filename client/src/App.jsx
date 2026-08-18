import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import CastingHome from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelection";
import AuthPage from "./pages/AuthPage";
import ActorDashboard from "./pages/ActorDashboard";
import ProducerDashboard from "./pages/ProducerDashboard";
import { getSession } from "./lib/api";

function RoleSelectionWrapper() {
  const navigate = useNavigate();
  return (
    <RoleSelection
      onSelectRole={(role) => navigate(`/auth?role=${role}`)}
      onSignIn={() => navigate("/auth?tab=login")}
      onHome={() => navigate("/")}
    />
  );
}

function AuthPageWrapper() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || "actor";
  const tab  = params.get("tab")  || "signup";
  return (
    <AuthPage
      role={role}
      initialTab={tab}
      onBack={() => navigate("/join")}
      onHome={() => navigate("/")}
      onAuthSuccess={(user) => {
        navigate(user.role === "producer" ? "/producer-dashboard" : "/actor-dashboard");
      }}
    />
  );
}

// Dashboards require a signed-in session and enforce the matching role —
// an actor can't land on /producer-dashboard and vice versa.
function ProtectedDashboard({ role, children }) {
  const session = getSession();
  if (!session) return <Navigate to="/auth?tab=login" replace />;
  if (session.user.role !== role) {
    return (
      <Navigate
        to={session.user.role === "producer" ? "/producer-dashboard" : "/actor-dashboard"}
        replace
      />
    );
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"     element={<CastingHome />} />
        <Route path="/join" element={<RoleSelectionWrapper />} />
        <Route path="/auth" element={<AuthPageWrapper />} />
        <Route
          path="/actor-dashboard"
          element={<ProtectedDashboard role="actor"><ActorDashboard /></ProtectedDashboard>}
        />
        <Route
          path="/producer-dashboard"
          element={<ProtectedDashboard role="producer"><ProducerDashboard /></ProtectedDashboard>}
        />
      </Routes>
    </BrowserRouter>
  );
}
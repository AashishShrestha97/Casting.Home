import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CastingHome from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelection";
import AuthPage from "./pages/AuthPage";

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
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"     element={<CastingHome />} />
        <Route path="/join" element={<RoleSelectionWrapper />} />
        <Route path="/auth" element={<AuthPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
import React from "react";
import Auth from "../components/Auth";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  return <Auth type="signup" onSuccess={() => navigate("/dashboard")} />;
}

export default SignupPage;
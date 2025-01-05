import React from "react";
import Auth from "../components/Auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  return <Auth type="login" onSuccess={() => navigate("/dashboard")} />;
}

export default LoginPage;
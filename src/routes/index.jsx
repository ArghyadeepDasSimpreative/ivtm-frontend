// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { getUserRole, isAuth } from "../lib/auth";
import { showToast } from "../lib/toast";

export function PublicRoute({ children }) {
  if (isAuth()) {
    return <Navigate to="/roadmap-analysis" replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  if (!isAuth() || getUserRole() !== "admin") {
   showToast.error("Access denied for non-admins.")
    return <Navigate to="/" replace />;
  }
  return children;
}

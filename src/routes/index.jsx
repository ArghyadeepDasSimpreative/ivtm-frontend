// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuth } from "../lib/auth";

export default function PublicRoute({ children }) {
  if (isAuth()) {
    return <Navigate to="/roadmap-analysis" replace />;
  }
  return children;
}

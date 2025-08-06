// components/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "ADMIN") {
      return <Navigate to="/" />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/" />;
  }
}

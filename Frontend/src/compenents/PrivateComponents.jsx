import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateComponents({ allowedRoles }) {
    const role = localStorage.getItem("role") || "";
    return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateComponents;
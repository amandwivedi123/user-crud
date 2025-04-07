import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
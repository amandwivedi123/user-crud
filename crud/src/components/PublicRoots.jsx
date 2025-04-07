
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/" /> : element;
};

export default PublicRoute;
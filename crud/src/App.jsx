import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./components/Home";
import Update from "./components/Update";
import ViewUsers from "./components/ViewUsers";
import { Login } from "./components/Login";
import { AuthProvider, useAuth } from "./components/AuthContext";

// PrivateRoute Component
function PrivateRoute({ element }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" />;
}

    

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Private Routes */}
                    <Route path="/" element={<PrivateRoute element={<Home />} />} />
                    <Route path="/updateUser/:id" element={<PrivateRoute element={<Update />} />} />
                    <Route path="/addUser" element={<PrivateRoute element={<Update />} />} />
                    <Route path="/readData/:id" element={<PrivateRoute element={<ViewUsers />} />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
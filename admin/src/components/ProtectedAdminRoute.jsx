import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  // Not logged in → Go to login page
  if (!token) return <Navigate to="/" replace />;

  // Logged in but NOT admin → Redirect to client website
  if (admin.role !== "admin") {
    window.location.href = "https://sphereb.cloud/"; 
    return null;
  }

  // Allowed
  return children;
};

export default ProtectedAdminRoute;

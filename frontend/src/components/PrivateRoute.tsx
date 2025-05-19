import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then(setUser);
    }
  }, [token]);

  if (!token) return <Navigate to="/" replace />;
  if (isAdminPage && user && user.role !== "admin") return <Navigate to="/home" replace />;
  if (isAdminPage && user === null) return <p className="text-center mt-4">Loading...</p>;

  return <>{children}</>;
}

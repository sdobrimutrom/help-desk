import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser()
            .then(setUser)
            .catch(() => alert('Failed to load profile'));
    }, []);

    if (!user) return <p>Loading...</p>;

      return (
        <div>
            <h2>Your profile</h2>
            <p><b>Login:</b> {user.username}</p>
            <p><b>Email:</b> {user.email || "не указан"}</p>
            <p><b>Name:</b> {user.first_name || "—"}</p>
            <p><b>Last Name:</b> {user.last_name || "—"}</p>
            <p><b>Role:</b> {user.role}</p>
            <button onClick={() => navigate("/change-password")}>Change password</button>
        </div>
  );
}

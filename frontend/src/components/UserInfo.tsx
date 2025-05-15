import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/auth";

export default function UserInfo() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchCurrentUser()
            .then(data => setUser(data))
            .catch(() => alert('Auth Error'));
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h2>Hello, {user.username}! </h2>
            <p>Role: {user.role} </p>
        </div>
    );
}
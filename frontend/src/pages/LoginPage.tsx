import { useState } from "react";
import { loginUser } from "../api/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        const token = await loginUser(username, password);
        if (!token) {
            setError("Invalid login or password");
        } else {
            window.location.href = "/me";
        }
    }

    return (
        <div>
            <h2>Вход в систему</h2>
            <form onSubmit={handleLogin}>
                <input placeholder="Login" value={username} onChange={e => setUsername(e.target.value)}/>
                <input type = "password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                <button type="submit">Войти</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}
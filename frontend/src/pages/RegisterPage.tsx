import { useState } from "react";
import { registerUser, loginUser } from "../api/auth";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()

        const success = await registerUser(username, password, email);
        if (!success) {
            setError("Failed to sign up. Please try again");
            return;
        }

        const token = await loginUser(username, password);
        if (token) {
            window.location.href = "/me";
        }
    }

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <input placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <button type="submit">Зарегистрироваться</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}
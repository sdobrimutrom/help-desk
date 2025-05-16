import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        const token = await loginUser(username, password);
        if (!token) {
            setError("Invalid login or password");
        } else {
            window.location.href = "/home";
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h1 className="text-center mb-3">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Login</label>
                        <input className="form-control" value={username} onChange={e => setUsername(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button className="btn btn-primary w-100" type="submit">Login</button>
                </form>
                <hr/>
                <p className="text-center">No account?</p>
                <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/register")}>Create new account</button>
            </div>
        </div>
    );
}
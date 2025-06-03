import { useState } from "react";
import { registerUser, loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()

        if (password != confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const success = await registerUser(username, password, email);
        if (!success) {
            setError("Failed to sign up. Please try again");
            return;
        }

        const token = await loginUser(username, password);
        if (token) {
            window.location.href = "/home";
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh"}}>
            <div className="card p-4" style={{ width: "100%", maxWidth: "400px"}}>
                <h1 className="text-center mb-3">Registration</h1>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Login</label>
                        <input className="form-control" value={username} onChange={e => setUsername(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">E-mail</label>
                        <input className="form-control" value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input className="form-control" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button className="btn btn-primary w-100" type="submit">Sign Up</button>
                </form>
                <hr/>
                <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/")}>Back to Login page</button>
            </div>
        </div>
    );
}
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPasswordPage() {
    const { uid64, token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords are not matching");
            return;
        }

        const res = await fetch(`http://localhost:8000/api/reset/${uid64}/${token}/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ new_password1: password, new_password2: confirm }),
        });

        if (res.ok) {
            setSuccess(true);
            setTimeout(() => navigate("/"), 3000);
        } else {
            setError("Error: perhaps, link is invalid");
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className="text-center mb-3">Password reset</h2>
                {success ? (
                    <div className="alert alert-success">Password is changed. Redirecting..</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Repeat Password</label>
                            <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} required/>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button className="btn btn-primary w-100">Reset password</button>
                    </form>
                )}
            </div>
        </div>
    );
}
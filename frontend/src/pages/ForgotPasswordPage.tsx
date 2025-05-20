import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: React.FormEvent) {      
        e.preventDefault();

        const res = await fetch("http://localhost:8000/api/password-reset/", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (res.ok) setSent(true);
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card p-4 shadow" style={{ maxWidth: "500px", width: '"100%' }}>
                <h4 className="text-center mb-3">Password reset</h4>
                { sent ? (
                    <div className="alert alert-success">
                        Email is sent! Check your email
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required/>
                        </div>
                        <button className="btn btn-primary w-100" type="submit">Reset</button>
                    </form>
                )}
            </div>
        </div>
    );
}

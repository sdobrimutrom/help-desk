import { useState } from "react";
import { changePassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (newPass !== confirmPass) {
            setError("Passwords are not matching");
            return;
        }

        const success = await changePassword(oldPass, newPass);
        if (success) {
            alert("Password is changed. Please login again");
            localStorage.removeItem("access_token");
            navigate("/");
        } else {
            setError("Wrong password");
        }
    }

      return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
                <h4 className="text-center mb-4">Change password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Current password</label>
                        <input type="password" className="form-control" value={oldPass} onChange={e => setOldPass(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New password</label>
                        <input type="password" className="form-control" value={newPass} onChange={e => setNewPass(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm new password</label>
                        <input type="password" className="form-control" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required/>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button className="btn btn-primary w-100" type="submit">Change password</button>
                 </form>
            </div>
        </div>
  );
}
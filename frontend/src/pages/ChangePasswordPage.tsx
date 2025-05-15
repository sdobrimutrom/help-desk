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
        <div>
            <h2>Смена пароля</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="Старый пароль" value={oldPass} onChange={e => setOldPass(e.target.value)} required />
                <input type="password" placeholder="Новый пароль" value={newPass} onChange={e => setNewPass(e.target.value)} required />
                <input type="password" placeholder="Повторите новый пароль" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required />
                <button type="submit">Изменить</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
  );
}
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("access_token");
        navigate("/", { replace: true });
    }

    return (
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Log Out
        </button>
    );
}
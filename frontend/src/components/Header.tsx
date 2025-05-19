import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-dark px-3 mb-4">
            <span className="navbar-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
                HelpDesk
            </span>
            <div className="ms-auto d-flex gap-2">
                <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/home")}>Home</button>
                <LogoutButton/>
            </div>
        </header>
    );
}
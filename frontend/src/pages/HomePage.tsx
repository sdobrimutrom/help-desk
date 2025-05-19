import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function HomePage() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser()
            .then(setUser)
            .catch(() => {
                alert("Failed to load user's data");
                navigate("/");
            });
    }, [navigate]);

    if (!user) return <p className="text-center">Loading...</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Welcome, {user.username}!</h1>
            <div className="d-flex justify-content-end mb-3">
                <LogoutButton />
            </div>

            <div className="row g-4">
                {user.role === 'employee' && (
                    <>
                        <div className="col-md-4">
                            <div className="card p-3 h-100">
                                <h2>Create ticket</h2>
                                <p>Open ticket with your issue description</p>
                                <button className="btn btn-primary" onClick={() => navigate("/tickets/new")}>Create</button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card p-3 h-100">
                                <h2>My tickets</h2>
                                <p>See a list of your tickets and status of each</p>
                                <button className="btn btn-secondary" onClick={() => navigate("/tickets")}>Open</button>
                            </div>
                        </div>
                    </>
                )}

                {user.role === 'technician' && (
                    <div className="col-md-4">
                        <div className="card p-3 h-100">
                            <h2>Assigned tickets</h2>
                            <p>Work with tickets assigned to you</p>
                            <button className="btn btn-primary" onClick={() => navigate("/assigned")}>Show</button>
                        </div>
                    </div>
                )}

                {user.role === "admin" && (
                    <div className="col-md-4">
                        <div className="card p-3 h-100 bg-light border border-primary">
                            <h2>Admin panel</h2>
                            <p>Users, tickets and categories management</p>
                            <button className="btn btn-outline-primary" onClick={() => navigate("/admin")}>
                                Show
                            </button>
                        </div>
                    </div>
                )}

                <div className="col-md-4">
                    <div className="card p-3 h-100">
                        <h3>Profile</h3>
                        <p>See and change information about you</p>
                        <button className="btn btn-outline-dark" onClick={() => navigate("/profile")}>Go to profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
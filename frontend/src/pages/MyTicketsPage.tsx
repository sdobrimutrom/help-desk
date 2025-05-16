import { useEffect, useState } from "react";
import { fetchTickets } from "../api/tickets";
import { useNavigate } from "react-router-dom";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets()
            .then(setTickets)
            .catch(() => setError("Failed to load tickets"));
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-3">My tickets</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {tickets.length === 0 ? (
                <p>No tickets</p>
            ) : (
                <div className="row g-4">
                    {tickets.map(ticket => (
                        <div className="col-md-4" key={ticket.id}>
                            <div className="card p-3 h-100">
                                <h2>#{ticket.id}: {ticket.title}</h2>
                                <p><b>Status:</b> {ticket.status}</p>
                                <p><b>Created at:</b> {ticket.created_at.slice(0, 10)}</p>
                                <button className="btn btn-outline-primary mt-auto" onClick={() => navigate(`/tickets/${ticket.id}`)}>More</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
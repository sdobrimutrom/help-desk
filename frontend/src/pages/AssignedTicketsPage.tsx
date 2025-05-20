import { useEffect, useState } from "react";
import { fetchTickets } from "../api/tickets";
import { useNavigate } from "react-router-dom";

export default function AssignedTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets()
            .then(setTickets)
            .catch(() => setError("Failed to load tickets"));
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Tickets assigned to me</h2>
            <div className="mb-3">
                <label className="form-label">Filter for status:</label>
                <select
                    className="form-select w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In progress</option>
                        <option value="closed">Closed</option>
                    </select>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}

            {tickets.length === 0 ? (
                <p>Nothing assigned yet</p>
            ) : (
                <div className="row g-4">
                    {tickets
                        .filter(ticket => statusFilter === "all" || ticket.status === statusFilter)
                        .map(ticket => (
                        <div className="col-md-4" key={ticket.id}>
                            <div className="card p-3 h-100">
                                <h3>#{ticket.id}: {ticket.title}</h3>
                                <p><b>Status:</b> {ticket.status}</p>
                                <p><b>Created at:</b> {ticket.created_at.slice(0, 10)}</p>
                                <button className="btn btn-outline-primary mt-auto" onClick={() => navigate(`/tickets/${ticket.id}`)}>More</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
import { useEffect, useState } from "react";
import { fetchTickets } from "../api/tickets";
import { useNavigate } from "react-router-dom";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets()
            .then(setTickets)
            .catch(() => setError("Failed to load tickets"));
    }, []);

    function getStatusColor(status: string) {
        switch (status) {
            case "open": return "primary";
            case "in_progress": return "warning";
            case "closed": return "success";
            default: return "secondary";
        }
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-3">My tickets</h1>
            <div className="mb-4">
                <label className="form-label">Filter for status:</label>
                <select className="form-select w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value={"all"}>All</option>
                    <option value={"open"}>Open</option>
                    <option value={"in_progress"}>In progress</option>
                    <option value={"closed"}>Closed</option>
                </select>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}

            {tickets.length === 0 ? (
                <p>No tickets</p>
            ) : (
                <div className="row g-4">
                    {tickets
                        .filter(ticket => filterStatus === "all" || ticket.status === filterStatus)
                        .map(ticket => (
                        <div className="col-md-4" key={ticket.id}>
                            <div className="card p-3 h-100">
                                <h2>#{ticket.id}: {ticket.title}</h2>
                                <p><b>Status:</b> <span className={`badge bg-${getStatusColor(ticket.status)}`}>{ticket.status.replace("_", " ")}</span></p>
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
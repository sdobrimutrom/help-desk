import { useEffect, useState } from "react";

export default function TicketsTab() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const token = localStorage.getItem("access_token");
    
    async function fetchTickets() {
        const res = await fetch("http://localhost:8000/api/tickets/", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setTickets(await res.json());
    }

    async function fetchTechnicians() {
        const res = await fetch ("http://localhost:8000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const all = await res.json();
            setTechnicians(all.filter((u: any) => u.role === "technician"));
        }
    }

    useEffect(() => {
        fetchTickets();
        fetchTechnicians();
    }, []);

    async function handleDelete(id: number) {
        const res = await fetch(`http://localhost:8000/api/tickets/${id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) fetchTickets();
    }

    async function assignTechnician(ticketId: number, technicianId: string) {
        await fetch(`http://localhost:8000/api/tickets/${ticketId}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ assigned_to: technicianId }),
        });
        fetchTickets();
    }

    function getStatusColor(status: string) {
        switch (status) {
            case "open": return "primary";
            case "in_progress": return "warning";
            case "closed": return "success";
            default: return "secondary";
        }
    }

    return (
        <div>
            <h3>All tickets</h3>
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
            <ul className="list-group">
                {tickets
                    .filter(ticket => statusFilter === "all" || ticket.status === statusFilter)
                    .map((ticket) => (
                    <li className="list-group-item" key = {ticket.id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>
                                #{ticket.id}: {ticket.title} <span className={`badge bg-${getStatusColor(ticket.status)}`}>{ticket.status.replace("_", " ")}</span>
                            </span>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={ticket.assigned_to?.toString() || ""}
                                    onChange={(e) => assignTechnician(ticket.id, e.target.value)}
                                >
                                    <option value="">Not assigned</option>
                                    {technicians.map((t) => (
                                        <option key={t.id} value={t.id.toString()}>
                                            {t.username}
                                        </option>
                                    ))}
                                </select>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ticket.id)}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
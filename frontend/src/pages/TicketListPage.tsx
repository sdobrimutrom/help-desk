import { useEffect, useState } from "react";
import { fetchTickets } from "../api/tickets";

interface Ticket {
    id: number;
    title: string;
    status: string;
    category: number | null;
    created_at: string;
}

export default function TicketListPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTickets()
            .then(setTickets)
            .catch(() => setError("Failed to load tickets"));
    }, []);

    return (
        <div>
            <h2>My tickets</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {tickets.map((ticket) => (
                    <li key={ticket.id}>
                        #{ticket.id}: {ticket.title} - <b>{ticket.status}</b> - {ticket.created_at.slice(0,10)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTicket, fetchComments, addComment, updateTicketStatus } from "../api/tickets";
import { fetchCurrentUser } from "../api/auth";

export default function TicketDetailsPage() {
    const { id } = useParams();
    const ticketId = Number(id);

    const [ticket, setTicket] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("");

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchCurrentUser().then(setUser);
    }, []);

    useEffect(() => {
        fetchTicket(ticketId).then(setTicket).catch(() => setError("Failed to load ticket"));
        fetchComments(ticketId).then(setComments).catch(() => setError("Failed to load comments"));
    }, [ticketId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const success = await addComment(ticketId, content, image || undefined);
        if(success) {
            fetchComments(ticketId).then(setComments);
            setContent("");
            setImage(null);
        } else {
            alert("Failed to add a comment");
        }
    }

    async function handleStatusChange(newStatus: string) {
        const success = await updateTicketStatus(ticketId, newStatus);
        if (success) {
            setTicket({ ...ticket, status: newStatus });
        } else {
            alert("Failed to change status");
        }
    }

    if (!ticket) return <p>Loading...</p>;

    return (
        <div>
            <h2>Ticket #{ticket.id}</h2>
            <p><b>Status:</b> {ticket.status}</p>
            {user?.role === 'technician' && (
                <div className="mt-3">
                    <p><b>Change status:</b></p>
                    {ticket.status === "open" && (
                        <button className="btn btn-warning me-2" onClick={() => handleStatusChange("in_progress")}>
                            Take the ticket on work
                        </button>
                    )}
                    {ticket.status !== "closed" && (
                        <button className="btn btn-success" onClick={() => handleStatusChange("closed")}>
                            Close ticket
                        </button>
                    )}
                </div>
            )}
            <p><b>Category:</b> {ticket.category}</p>
            <p><b>Description:</b> {ticket.description}</p>
            {ticket.image_before && (
                <img
                src={`http://localhost:8000${ticket.image_before}`}
                alt="до"
                style={{ maxWidth: "300px", margin: "10px 0" }}
                />
            )}
            <hr />
            <h3>Comments</h3>
            <ul>
                {comments.map(c => (
                <li key={c.id}>
                    <b>{c.author_username}</b>: {c.content}
                    {c.image && (
                    <div>
                        <img src={`http://localhost:8000${c.image}`} alt="коммент" style={{ maxWidth: "200px" }} />
                    </div>
                    )}
                    <br /><small>{c.created_at.slice(0, 16).replace("T", " ")}</small>
                </li>
                ))}
            </ul>

            <hr />
            <form onSubmit={handleSubmit}>
                <textarea value={content} onChange={e => setContent(e.target.value)} required />
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
                <button type="submit">Add comment</button>
            </form>
        </div> 
    );
}
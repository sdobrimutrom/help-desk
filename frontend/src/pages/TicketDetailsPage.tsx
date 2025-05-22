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
        fetchCurrentUser().then(setUser).catch(() => setError("Failed to load user data"));
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

    if (!ticket || !user) return <p className="text-center mt-4">Loading...</p>;

    return (
        <div className="container my-4">
            <div className="card p-4 mb-4 shadow-sm">
                <h4 className="mb-3">Ticket #{ticket.id}: {ticket.title}</h4>
                <p><b>Category:</b> {ticket.category_name || "no category"}</p>
                <p><b>Technician:</b> {ticket.assigned_to_username || "not assigned yet"}</p>
                <p><b>Status:</b> {ticket.status}</p>
                <p><b>Description:</b> {ticket.description}</p>
                {ticket.image_before && (
                    <div className="mb-3">
                        <p><b>Image before:</b></p>
                        <img src={ticket.image_before} alt="before" className="img-fluid rounded"/>
                    </div>
                )}
                {user.role === "technician" && (
                    <div className="d-flex gap-2 mt-3">
                        {ticket.status === "open" && (
                            <button className="btn btn-warning" onClick={() => handleStatusChange("in_progress")}>Take to work</button>
                        )}
                        {ticket.status !== "closed" && (
                            <button className="btn btn-success" onClick={() => handleStatusChange("closed")}>Close ticket</button>
                        )}
                    </div>
                )}
            </div>

            <h5 className="mb-3">Comments</h5>
            <div className="mb-4">
                {comments.length === 0 ? (
                    <p>No comments yet</p>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className="card mb-3 p-3">
                            <p className="mb-1"><b>{c.author_username}</b> <span className="text-muted">({c.created_at.slice(0, 16).replace("T", " ")})</span></p>
                            <p>{c.content}</p>
                            {c.image && (
                                <img src={c.image} alt="comment" className="img-fluid rounded" style={{ maxWidth: "300px" }}/>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="card p-3 shadow-sm">
                <h6 className="mb-3">Add comment</h6>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Your comment..."
                            rows = {3}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input type="file" className="form-control" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)}/>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
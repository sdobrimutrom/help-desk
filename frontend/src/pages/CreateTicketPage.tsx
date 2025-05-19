import { useState, useEffect } from "react";
import { createTicket, fetchCategories } from "../api/tickets";
import { useNavigate } from "react-router-dom";

export default function CreateTicketPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => setError("Failed to load categories"));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        if (image) formData.append("image_before", image);

        const success = await createTicket(formData);
        if (success) {
            navigate('/tickets');
        } else {
            setError("Failed to create ticket");
        }
    }

    return (
      <div className="container d-flex justify-content-center align-items-start" style={{ minHeight: "80vh" }}>
        <div className="card p-4 shadow-sm mt-4" style={{ width: "100%", maxWidth: "600px" }}>
          <h1 className="text-center mb-3">Create ticket</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Attachments (optional)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={e => setImage(e.target.files?.[0] || null)}
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    );
}
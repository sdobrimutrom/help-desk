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
    <div>
      <h2>Create ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <select value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="">Choose Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />
        <button type="submit">Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
    );
}
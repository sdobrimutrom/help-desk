import { useEffect, useState } from "react";

export default function CategoriesTab() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const token = localStorage.getItem("access_token");

  async function fetchCategories() {
    const res = await fetch("http://localhost:8000/api/categories/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setCategories(await res.json());
  }

  async function handleCreate() {
    const res = await fetch("http://localhost:8000/api/categories/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName("");
      fetchCategories();
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleDelete(id: number) {
    const res = await fetch(`http://localhost:8000/api/categories/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchCategories();
  }

  return (
    <div>
      <h5>Categories</h5>
      <div className="mb-3 d-flex gap-2">
        <input className="form-control" placeholder="New category" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn btn-success" onClick={handleCreate}>Add</button>
      </div>
      <ul className="list-group">
        {categories.map(c => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={c.id}>
          {c.name}
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

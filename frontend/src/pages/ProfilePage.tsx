import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      fetchCurrentUser()
        .then((data) => {
          setUser(data);
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
          });
        })
        .catch(() => navigate("/"));
    }, [navigate])

    async function handleSave(e: React.FormEvent) {
      e.preventDefault();
      const res = await fetch("http://localhost:8000/api/user/", {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setEditMode(false);
        setMessage("Data is updated successfully");
        setTimeout(() => setMessage(""), 3000);
      }
    }

    if (!user) return <p>Loading...</p>;

    return (
      <div className="container d-flex justify-content-center mt-5">
        <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
          <h4 className="text-center mb-4">Profile</h4>

          {!editMode ? (
            <>
              <ul className="list-group mb-3">
                <li className="list-group-item"><b>Login:</b> {user.username}</li>
                <li className="list-group-item"><b>Email:</b> {user.email || "—"}</li>
                <li className="list-group-item"><b>First Name:</b> {user.first_name || "—"}</li>
                <li className="list-group-item"><b>Second Name:</b> {user.last_name || "—"}</li>
                <li className="list-group-item"><b>Role:</b> {user.role}</li>
              </ul>
              <button className="btn btn-outline-primary w-100 mb-2" onClick={() => setEditMode(true)}>
                Edit profile
              </button>
              <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/change-password")}>
                Сhange Password
              </button>
            </>
          ) : (
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label>First Name</label>
                <input className="form-control" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label>Second Name</label>
                <input className="form-control" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-success w-100" type="submit">Save</button>
                <button className="btn btn-outline-secondary w-100" type="button" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          )}

          {message && <div className="alert alert-success mt-3 text-center">{message}</div>}
        </div>
      </div>
    );
}

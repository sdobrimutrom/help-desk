import { useEffect, useState } from "react";

export default function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const token = localStorage.getItem("access_token");

    async function fetchUsers() {
        const res = await fetch("http://localhost:8000/api/users/", {
            headers: { Authorization: `Bearer ${token}`},
        });
        if (res.ok) {
            const data = await res.json();
            setUsers(data);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);
    
    async function handleDelete(id: number) {
        if (window.confirm("Delete user?")) {
            await fetch(`http://localhost:8000/api/users/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        }
    }

    async function handleCreate() {
        const res = await fetch("http://localhost:8000/api/users/create_technician/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ username, password, email }),
        });

        if (res.ok) {
            setUsername("");
            setPassword("");
            setEmail("");
            fetchUsers();
        } else {
            alert("Failed to create a technician");
        }
    }

    return (
        <div>
            <h3>Users list</h3>
            <ul className="list-group mb-4">
                {users.map(user => (
                    <li className="list-group-item d-flex justify-content-between" key={user.id}>
                        {user.username} ({user.role})
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h5>Create technician</h5>
            <div className="row g-2">
                <div className="col-md-3"><input className="form-control" placeholder="Login" value={username} onChange={e => setUsername(e.target.value)} /></div>
                <div className="col-md-3"><input className="form-control" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                <div className="col-md-3"><input className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="col-md-3"><button className="btn btn-success w-100" onClick={handleCreate}>Create</button></div>
            </div>
        </div>
    )
}
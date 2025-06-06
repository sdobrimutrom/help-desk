import { useEffect, useState } from "react";

export default function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [filter, setFilter] = useState("all");
    
    const filteredUsers = users.filter(user => filter === "all" || user.role === filter);

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
            <div className="mb-3">
                <select className="form-select w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">All Users</option>
                    <option value="employee">Employees</option>
                    <option value="technician">Technicians</option>
                    <option value="admin">Admins</option>
                </select>
            </div>
            <ul className="list-group mb-4">
                {filteredUsers.map(user => (
                    <li className="list-group-item" key={user.id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <b>{user.username}</b> ({user.role})<br/>
                                <small>Email: {user.email || "—"}</small> <br/>
                                <small>Name: {user.first_name || "—"} {user.last_name || "—"}</small>
                            </div>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                                Delete
                            </button>
                        </div>
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
            <br/>
        </div>
    )
}
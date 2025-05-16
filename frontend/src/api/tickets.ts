export async function fetchTickets(): Promise<any[]> {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/api/tickets", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load tickets");
    }

    return await response.json();
}

export async function createTicket(formData: FormData): Promise<boolean> {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/api/tickets/", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    return response.ok;
}

export async function fetchCategories(): Promise<any[]> {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/api/categories/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Failed to load categories");
    return await response.json();
}

export async function deleteTicket(id: number): Promise<boolean> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`http://localhost:8000/api/tickets/${id}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.ok;
}

export async function fetchTicket(id: number): Promise<any> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`http://localhost:8000/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to load ticket");
    return await response.json();
}

export async function fetchComments(ticketId: number): Promise<any[]> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`http://localhost:8000/api/comments/?ticket=${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to load comments");
    return await response.json();
}

export async function addComment(ticketId: number, content: string, image?: File): Promise<boolean> {
    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("ticket", String(ticketId));
    formData.append("content", content);
    if (image) formData.append("image", image);

    const response = await fetch(`http://localhost:8000/api/comments/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    return response.ok;
}
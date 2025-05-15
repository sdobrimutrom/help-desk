export async function fetchTickets(): Promise<any[]> {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/api/tickets", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Can't load tickets");
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
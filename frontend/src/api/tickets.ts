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
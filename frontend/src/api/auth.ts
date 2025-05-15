export async function loginUser(username: string, password: string): Promise<string | null> {
    const response = await fetch("http://localhost:8000/api/token/", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    return data.access;
}

export async function fetchCurrentUser(): Promise<any> {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/api/user/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Can't get user");
    }

    return await response.json();
}
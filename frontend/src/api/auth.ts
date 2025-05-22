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
    localStorage.setItem("refresh_token", data.refersh);
    return data.access;
}

export async function registerUser(username: string, password: string, email?: string): Promise<boolean> {
    const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username, password, email }),
    });

    return response.ok;
}

export async function fetchCurrentUser(): Promise<any> {
    const token = localStorage.getItem("access_token");

    let res = await fetch("http://localhost:8000/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Unauthorized");

    res = await fetch("http://localhost:8000/api/user/", {
      headers: { Authorization: `Bearer ${newToken}` },
    });
    }

    if (!res.ok) throw new Error("Unauthorized");
    return await res.json();
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8000/api/change-password/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
        }),
    });

    return response.ok;
}

export async function refreshAccessToken(): Promise<string | null> {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;

    const res = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    return data.access;
}
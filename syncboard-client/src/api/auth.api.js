const BASE = '/api/auth';

const handleResponse = async (res) => {
    const body = await res.json();
    if (!res.ok) {
        throw new Error(body.message || `Request failed (${res.status})`);
    }
    return body.data;
};

export const apiRegister = (username, email, password) =>
    fetch(`${BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    }).then(handleResponse);

export const apiLogin = (username, password) =>
    fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    }).then(handleResponse);

export const apiGetMe = (token) =>
    fetch(`${BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(handleResponse);

export const apiUpdateMe = (token, updates) =>
    fetch(`${BASE}/me`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    }).then(handleResponse);

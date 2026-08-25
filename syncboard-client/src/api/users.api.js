const BASE = '/api/users';

export const apiSearchUsers = async (query, token) => {
    if (!query?.trim()) return [];
    const res = await fetch(`${BASE}?search=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.message || 'Search failed');
    return body.data.users;
};

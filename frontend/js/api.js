const BASE = 'http://localhost:3000/api';

const req = async (path, options = {}) => {
    const res = await fetch(`${BASE}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
};

const api = {
    register: (email, password) => req('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
    login: (email, password) => req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () => req('/auth/logout', { method: 'POST' }),
    me: () => req('/auth/me'),
    embed: (content) => req('/embeddings', { method: 'POST', body: JSON.stringify({ content }) }),
    history: () => req('/embeddings/history'),
};
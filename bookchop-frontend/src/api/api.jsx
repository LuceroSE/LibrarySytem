const BASE_URL = 'http://localhost:8000';

async function api(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
        ...options.headers,
        },
    });

    if(response.status !== 401) {
        return response;
    }
    
    const refresh = localStorage.getItem('refresh');
    if(!refresh) {
        window.location.href = '/login';
        return;
    }

    const refreshResponse = await fetch(`${BASE_URL}/api/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ refresh }),
    });

    if (!refreshResponse.ok) {
        // Refresh token itself has expired — the user must log in again
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return;
    }

    const tokens = await refreshResponse.json();
    localStorage.setItem('access', tokens.access);    
    // DRF's ROTATE_REFRESH_TOKENS is enabled, so a new refresh token is also issued
    if (tokens.refresh) {
        localStorage.setItem('refresh', tokens.refresh);
    }

    return fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            ...options.headers,
        },
    });

}

export default api;
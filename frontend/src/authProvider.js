
const apiUrl = 'http://localhost:4000/api';

const authProvider = {
    login: ({ email, password }) =>  {
        const request = new Request(`${apiUrl}/users/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {
                const token = auth.token;
                localStorage.setItem('auth', JSON.stringify(auth));
                localStorage.setItem('token', JSON.stringify(token));
            })
            .catch(() => {
                throw new Error('Network error')
            });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    checkError: error => {
        // ...
        // return Promise.reject();
    },
    checkAuth: () => {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    getPermissions: () => Promise.reject('Unknown method'),
    getIdentity: () =>
        Promise.resolve({
            id: JSON.parse(localStorage.getItem('auth')).userId,
            fullName: JSON.parse(localStorage.getItem('auth')).name,
            avatar: JSON.parse(localStorage.getItem('auth')).pictures[0].src
        }),
};

export default authProvider;
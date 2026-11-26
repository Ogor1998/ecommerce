import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const url = err.config?.url || ''
        const isAuthCheck = url.includes('/check-auth') || url.includes('/login')
        const isAlreadyOnAuthPage = window.location.pathname === '/login' ||
            window.location.pathname === '/register';

        if (err.response?.status === 401 && !isAuthCheck && !isAlreadyOnAuthPage) {
            window.location.href = '/login?expired=1'
        }
        return Promise.reject(err)
    }
)

export default api;
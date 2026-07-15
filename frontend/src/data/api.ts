import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
    headers: {
        "ngrok-skip-browser-warning": "true",
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const response = await axios.post(`${api.defaults.baseURL}/api/token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    const newToken = response.data.access;
                    localStorage.setItem("token", newToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }
            } else {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
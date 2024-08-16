import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        (config) => {
            const authStore = useAuthStore();
            if (authStore.token) {
                config.headers['Authorization'] = `Bearer ${authStore.token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            const authStore = useAuthStore();

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axios(originalRequest);
                    }).catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    await authStore.refreshAuthToken();
                    const newToken = authStore.token;
                    processQueue(null, newToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    authStore.logout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            if (error.response?.status === 403) {
                console.error('Yetkisiz erişim');
                router.push('/unauthorized');
            }

            // Hata mesajını store'a kaydet
            authStore.setError(error.response?.data?.message || 'Bir hata oluştu');

            return Promise.reject(error);
        }
    );
};
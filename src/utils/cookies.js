import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';

export const setCookie = (key, value, options = {}) => {
    Cookies.set(key, value, { ...options, secure: true, sameSite: 'strict' });
};

export const getCookie = (key) => {
    return Cookies.get(key);
};

export const removeCookie = (key) => {
    Cookies.remove(key);
};

export const setAuthCookies = (token, refreshToken, user) => {
    setCookie(TOKEN_KEY, token, { expires: 1 }); // 1 gün
    setCookie(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 }); // 7 gün
    setCookie(USER_KEY, JSON.stringify(user), { expires: 7 });
};

export const getAuthCookies = () => {
    const token = getCookie(TOKEN_KEY);
    const refreshToken = getCookie(REFRESH_TOKEN_KEY);
    const user = JSON.parse(getCookie(USER_KEY) || '{}');
    return { token, refreshToken, user };
};

export const clearAuthCookies = () => {
    removeCookie(TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
    removeCookie(USER_KEY);
};
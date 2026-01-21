import axios from 'axios';

const $host = axios.create({
    withCredentials: false,
});

const authInterceptor = (config) => {
    config.headers.authorization = process.env.REACT_APP_WB_API_KEY;
    return config;
};

$host.interceptors.request.use(authInterceptor);

export { $host };
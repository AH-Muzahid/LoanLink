import axios from "axios";
import { useEffect } from "react";
import useAuth from "../useAuth/useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestId = axiosSecure.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const interceptorId = axiosSecure.interceptors.response.use(res => {
            return res;
        }, error => {
            console.log('error tracked in the interceptor', error.response);
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('logout the user');
                logOut()
                    .then(() => {
                        navigate('/login');
                    })
                    .catch(err => console.log(err));
            }
            return Promise.reject(error);
        });

        return () => {
            axiosSecure.interceptors.request.eject(requestId);
            axiosSecure.interceptors.response.eject(interceptorId);
        };
    }, [logOut, navigate])

    return axiosSecure;
};

export default useAxiosSecure;
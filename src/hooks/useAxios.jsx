import { useAuth } from "../contexts/AuthContext";
import { useMemo } from "react";
import api from "../services/axios";

export const useAxios = () => {
    const { accessToken } = useAuth();

    // useMemo ensures we don't recreate instance on every render unnecessarily
    const axiosInstance = useMemo(() => {
        const instance = api;

        instance.interceptors.request.use(
            (config) => {
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return instance;
    }, [accessToken]);

    return axiosInstance;
};

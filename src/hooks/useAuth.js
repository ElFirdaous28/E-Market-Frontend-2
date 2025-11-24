import { useQuery } from "@tanstack/react-query";
import axios from "../services/axios";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setUser, setLoading, logoutUser } from "../store/userSlice";
import { useMutation } from "@tanstack/react-query";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, accessToken } = useSelector(state => state.user);

    const initAuth = useQuery({
        queryKey: ["initAuth"],
        queryFn: async () => {
            try {
                const refreshRes = await axios.post("/auth/refresh", {}, { withCredentials: true });
                const token = refreshRes.data.accessToken;
                if (token) dispatch(setAccessToken(token));

                const profileRes = await axios.get("/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (profileRes.data?.user) dispatch(setUser(profileRes.data.user));
                return profileRes.data.user || null;
            } catch (err) {
                dispatch(setUser(null));
                dispatch(setAccessToken(null));
                return null;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const loading = initAuth.isLoading;

    const login = useMutation({
        mutationFn: async ({ email, password }) =>
            axios.post("/auth/login", { email, password }, { withCredentials: true }),
        onSuccess: (res) => {
            dispatch(setAccessToken(res.data.data.accessToken));
            dispatch(setUser(res.data.data.user));
        },
    });

    const register = useMutation({
        mutationFn: async ({ fullname, email, password }) =>
            axios.post("/auth/register", { fullname, email, password }, { withCredentials: true }),
        onSuccess: (res) => {
            dispatch(setAccessToken(res.data.data.accessToken));
            dispatch(setUser(res.data.data.user));
        },
    });

    const logout = useMutation({
        mutationFn: () => axios.post("/auth/logout", {}, { withCredentials: true }),
        onSuccess: () => {
            dispatch(logoutUser());
        },
    });

    return { user, accessToken, loading, initAuth, login, register, logout, };
};
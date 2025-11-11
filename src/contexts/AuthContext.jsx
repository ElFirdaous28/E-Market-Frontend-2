import { createContext, useContext, useState, useEffect } from "react";
import axios from "../services/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Refresh token on app start
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Step 1: Get new access token using refresh token cookie
                const res = await axios.post("/auth/refresh", {}, { withCredentials: true });
                const newAccessToken = res.data.accessToken;
                if (!newAccessToken) throw new Error("No access token returned");

                setAccessToken(newAccessToken);

                // Step 2: Fetch user profile with new access token
                const profile = await axios.get("/auth/profile", {
                    headers: { Authorization: `Bearer ${newAccessToken}` },
                });

                setUser(profile.data.user);
                
            } catch (err) {
                console.log("Not logged in", err.message);
                setUser(null);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);


    const login = async (email, password) => {
        const res = await axios.post("/auth/login", { email, password }, { withCredentials: true });
        setAccessToken(res.data.data.accessToken);
        setUser(res.data.data.user);
    };

    const register = async (fullname, email, password) => {
        const res = await axios.post("/auth/register", { fullname, email, password }, { withCredentials: true });
        setAccessToken(res.data.data.accessToken);
        setUser(res.data.data.user);
    };

    const logout = async () => {
        try {
            await axios.post("/auth/logout", {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            setAccessToken(null);
        }
    };


    return (
        <AuthContext.Provider value={{ user, accessToken, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import { useEffect, useState } from "react";
import axios from "../services/axios";

let cache = null;

export const useCategories = ({ forceRefresh = false } = {}) => {
    const [categories, setCategories] = useState(cache ?? []);
    const [loading, setLoading] = useState(!cache);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cache && !forceRefresh) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const res = await axios.get("/categories/product-number");
                setCategories(res.data.data);
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [forceRefresh]);

    return { categories, loading, error, refresh: () => { } };
};

import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

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
                const data = await getCategories();
                if (!cancelled) {
                    cache = data;
                    setCategories(data);
                }
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

    return { categories, loading, error, refresh: () => {} };
};

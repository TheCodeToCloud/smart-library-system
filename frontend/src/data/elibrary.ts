import { useEffect, useState } from "react";
import api from "./api";

export type ELibraryResource = {
    id: number;
    title: string;
    author: string | null;
    category: string;
    file_url: string | null;
    resource_file: string | null;
    uploaded_by_name: string;
    uploaded_at: string;
};

export function useELibrary() {
    const [resources, setResources] = useState<ELibraryResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/books/elibrary/");
            setResources(res.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load e-library resources.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    return { resources, loading, error, refreshResources: fetchResources };
}

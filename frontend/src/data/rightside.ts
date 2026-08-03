import { useEffect, useState, useCallback } from "react";
import api from "./books";

type Announcement = {
    id: number;
    text: string;
    date: string;
    color: string;
    icon: string;
    type: string;
};

type ApiNotification = {
    type: string;
    message: string;
    date: string;
};

const typeStyles: Record<string, { color: string; icon: string }> = {
    issued: { color: "bg-green-50 border-green-200", icon: "📗" },
    overdue: { color: "bg-red-50 border-red-200", icon: "⚠️" },
};

export type NewArrivalBook = {
    title: string;
    author: string;
    category: string;
    cover_image: string | null;
};

export function useNewArrivals() {
    const [books, setBooks] = useState<NewArrivalBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/books/")
            .then(res => {
                const allBooks = Array.isArray(res.data) ? res.data : [];
                // Sort by ID descending (newest first) and take top 10
                const newestBooks = [...allBooks].reverse().slice(0, 10);
                setBooks(newestBooks);
            })
            .catch(() => setBooks([]))
            .finally(() => setLoading(false));
    }, []);

    return { books, loading };
}

const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff <= 0) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
};

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = () => {
            api.get("/api/dashboard/notifications/")
                .then((res) => {
                    const data = res.data.map((item: ApiNotification, i: number) => ({
                        id: i + 1,
                        text: item.message,
                        date: timeAgo(item.date),
                        color: typeStyles[item.type]?.color ?? "bg-blue-50 border-blue-200",
                        icon: typeStyles[item.type]?.icon ?? "🔔",
                        type: item.type,
                    }));
                    setAnnouncements(data);
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        };

        fetchAnnouncements();
        
        // Auto refresh every 15 seconds
        const timer = setInterval(fetchAnnouncements, 15000);
        return () => clearInterval(timer);
    }, []);

    return { announcements, loading };
}

export type RealAnnouncement = {
    id: number;
    message: string;
    created_at: string;
    created_by_name: string;
    created_by_role: string;
};

export function useRealAnnouncements() {
    const [realAnnouncements, setRealAnnouncements] = useState<RealAnnouncement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = useCallback(() => {
        api.get("/api/dashboard/real-announcements/")
            .then((res) => {
                setRealAnnouncements(res.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const addAnnouncement = async (message: string) => {
        await api.post("/api/dashboard/real-announcements/", { message });
        fetchAnnouncements();
    };

    const deleteAnnouncement = async (id: number) => {
        await api.delete(`/api/dashboard/real-announcements/${id}/`);
        fetchAnnouncements();
    };

    return { realAnnouncements, loading, addAnnouncement, deleteAnnouncement, timeAgo };
}
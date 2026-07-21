import { useEffect, useState } from "react";
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

export type PopularBook = {
    title: string;
    author: string;
    times_issued: number;
    cover_image: string | null;
};

export function usePopularBooks() {
    const [books, setBooks] = useState<PopularBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/popular-books/")
            .then(res => setBooks(Array.isArray(res.data) ? res.data : []))
            .catch(() => setBooks([]))
            .finally(() => setLoading(false));
    }, []);

    return { books, loading };
}

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/notifications/")
            .then((res) => {
                const data = res.data.map((item: ApiNotification, i: number) => ({
                    id: i + 1,
                    text: item.message,
                    date: new Date(item.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
                    color: typeStyles[item.type]?.color ?? "bg-blue-50 border-blue-200",
                    icon: typeStyles[item.type]?.icon ?? "🔔",
                    type: item.type,
                }));
                setAnnouncements(data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return { announcements, loading };
}
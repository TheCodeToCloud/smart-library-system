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
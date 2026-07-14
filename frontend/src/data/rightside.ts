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

export const popularBooks = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", copies: 12, img: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg" },
    { id: 2, title: "Atomic Habits", author: "James Clear", copies: 10, img: "https://prh.imgix.net/articles/atomichabits-1600x800-05.jpg" },
    { id: 3, title: "Think and Grow Rich", author: "Napoleon Hill", copies: 8, img: "https://covers.openlibrary.org/b/id/7898836-M.jpg" },
    { id: 4, title: "The Power of Habit", author: "Charles Duhigg", copies: 6, img: "https://books.google.com/books/content?vid=ISBN9780812981605&printsec=frontcover&img=1&zoom=1" },
    { id: 5, title: "The Psychology of Money", author: "Morgan Housel", copies: 3, img: "https://media.thuprai.com/front_covers/psychology-of-money.jpg" },
    { id: 6, title: "Think and Grow Rich", author: "Napoleon Hill", copies: 5, img: "https://books.google.com/books/content?vid=ISBN9781640951287&printsec=frontcover&img=1&zoom=1" },
    { id: 7, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", copies: 2, img: "https://covers.openlibrary.org/b/id/15129456-L.jpg" },
];

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
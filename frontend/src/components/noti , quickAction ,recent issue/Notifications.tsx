import { useEffect, useState } from "react";
import api from "../../data/api";

interface NotifItem {
    type: "issued" | "returned" | "overdue" | "low_stock";
    message: string;
    date?: string;
}

const iconMap: Record<string, { icon: string; color: string }> = {
    issued:    { icon: "📤", color: "bg-green-100" },
    returned:  { icon: "📥", color: "bg-blue-100" },
    overdue:   { icon: "⏰", color: "bg-red-100" },
    low_stock: { icon: "📦", color: "bg-orange-100" },
};

const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
};

export default function Notification() {
    const [items, setItems] = useState<NotifItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/notifications/")
            .then(res => setItems(Array.isArray(res.data) ? res.data.slice(0, 6) : []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm p-3 mt-2 w-full">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-3">
                <h2 className="font-semibold text-gray-800">Notifications</h2>
                <button className="text-xs cursor-pointer text-blue-500 hover:underline absolute right-0">View all</button>
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No notifications yet.</p>
                ) : (
                    items.map((item, idx) => {
                        const { icon, color } = iconMap[item.type] ?? { icon: "🔔", color: "bg-gray-100" };
                        return (
                            <div key={idx} className="flex items-center gap-3">
                                <div className={`${color} h-9 w-9 items-center flex pl-1.5 rounded-lg`}>
                                    <p>{icon}</p>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{item.message}</p>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">{timeAgo(item.date)}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
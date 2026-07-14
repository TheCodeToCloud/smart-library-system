import { useEffect, useState } from "react";
import api from "./books";  // ← reuse the same axios instance

type Stat = {
    id: number;
    title: string;
    img: string;
    value: string | number;
    col: string;
    par: string;
    parVal: string;
    parCol: string;
    font: string;
    icon: string;
};

// Static config — UI stuff that never changes
const statConfig = [
    { id: 1, title: "Total Books", img: "../books3.svg", col: "bg-amber-200", parCol: "text-blue-500", font: "font-nav", icon: "" },
    { id: 2, title: "Total Members", img: "../mem.svg", col: "bg-green-100", parCol: "text-green-400", font: "font-nav", icon: "↑" },
    { id: 3, title: "Books Issued", img: "../book2.svg", col: "bg-orange-100", parCol: "text-green-400", font: "font-nav", icon: "↑" },
    { id: 4, title: "Overdue Books", img: "../overdue.svg", col: "bg-red-100", parCol: "text-orange-500", font: "font-nav", icon: "" },
];

export function useStats() {
    const [stats, setStats] = useState<Stat[]>(
        // Default to zeros until API loads
        statConfig.map((s) => ({ ...s, value: 0, par: "this month", parVal: "..." }))
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/stats/")
            .then((res) => {
                const d = res.data;
                setStats([
                    { ...statConfig[0], value: d.total_books ?? 0, par: "this month", parVal: `+${d.new_books_this_month ?? 0}` },
                    { ...statConfig[1], value: d.total_members ?? 0, par: "this month", parVal: `+${d.new_members_this_month ?? 0}` },
                    { ...statConfig[2], value: d.books_issued ?? 0, par: "this month", parVal: `+${d.issued_this_month ?? 0}` }, // ← changed
                    { ...statConfig[3], value: d.overdue_books ?? 0, par: "this month", parVal: `+${d.overdue_this_month ?? 0}` }, // ← changed
                ]);
            })
            .catch(() => { }) // keeps zeros on error
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading };
}
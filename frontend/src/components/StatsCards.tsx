import { useEffect, useState } from "react";
import { useAuth } from "../data/useAuth";
import api from "../data/api";
import { useStats } from "../data/statCard";

// ── Admin / Librarian stats (existing) ──────────────────────────────────────

function AdminStatsCards() {
    const { stats, loading } = useStats();
    if (loading) return <p className="p-5 text-gray-400">Loading stats...</p>;
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 pt-5 pl-5 pr-5">
            {stats.map((stat) => (
                <div key={stat.id} className="bg-gray-300 p-3 rounded-xl shadow font-nav">
                    <div className="flex items-center gap-3">
                        <div className={`${stat.col} rounded-xl flex items-center justify-center w-12 h-12 shrink-0`}>
                            <img src={stat.img} alt={stat.title} />
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-800 font-semibold">{stat.title}</h3>
                            <p className="text-xl font-bold mt-1">{stat.value}</p>
                            <p className="text-sm text-gray-500 flex gap-1">
                                <span className={`${stat.parCol} font-nav font-bold`}>{stat.parVal}</span>
                                <span>{stat.par}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Student personalised stats ───────────────────────────────────────────────

interface StudentStats {
    currently_borrowed: number;
    overdue: number;
    due_soon: number;
    total_fine: number;
}

const studentStatConfig = [
    { key: "currently_borrowed", title: "My Borrowed Books", img: "../book2.svg",  col: "bg-violet-100", parCol: "text-violet-500", par: "currently issued" },
    { key: "overdue",            title: "Overdue Books",      img: "../overdue.svg", col: "bg-red-100",    parCol: "text-red-500",    par: "need returning" },
    { key: "due_soon",           title: "Due Soon",           img: "../books3.svg",  col: "bg-amber-100",  parCol: "text-amber-500",  par: "within 3 days" },
    { key: "total_fine",         title: "My Fines",           img: "../mem.svg",     col: "bg-orange-100", parCol: "text-orange-500", par: "total (Rs.)" },
];

function StudentStatsCards() {
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/circulation/my-stats/")
            .then((res) => setStats(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-5 text-gray-400">Loading your stats...</p>;
    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 pt-5 pl-5 pr-5">
            {studentStatConfig.map((cfg) => {
                const val = stats[cfg.key as keyof StudentStats];
                return (
                    <div key={cfg.key} className="bg-gray-300 p-3 rounded-xl shadow font-nav">
                        <div className="flex items-center gap-3">
                            <div className={`${cfg.col} rounded-xl flex items-center justify-center w-12 h-12 shrink-0`}>
                                <img src={cfg.img} alt={cfg.title} />
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-800 font-semibold">{cfg.title}</h3>
                                <p className="text-xl font-bold mt-1">
                                    {cfg.key === "total_fine" ? `Rs. ${val}` : val}
                                </p>
                                <p className={`text-xs ${cfg.parCol} font-semibold mt-0.5`}>{cfg.par}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Exported component ───────────────────────────────────────────────────────

export default function StatsCards() {
    const { user } = useAuth();
    if (!user) return null;
    return user.role === "student" ? <StudentStatsCards /> : <AdminStatsCards />;
}
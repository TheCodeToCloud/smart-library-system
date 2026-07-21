import { useEffect, useState } from "react";
import api from "../../data/api";

interface RecentIssue {
    book: string;
    book_cover: string | null;
    member: string;
    issue_date: string;
    due_date: string;
}

export default function RecentIssues() {
    const [issues, setIssues] = useState<RecentIssue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/recent-issues/")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setIssues(data);
            })
            .catch(() => setIssues([]))
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (d: string | null) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    };

    const getDueLabel = (dueDate: string | null) => {
        if (!dueDate) return { label: "—", color: "text-gray-400" };
        const today = new Date();
        const due = new Date(dueDate);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { label: `${Math.abs(diff)} days overdue`, color: "text-red-500" };
        if (diff === 0) return { label: "Due today", color: "text-red-500" };
        return { label: `Due in ${diff} days`, color: diff <= 3 ? "text-orange-500" : "text-green-500" };
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 mt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 text-base">Recent Issues</h2>
                <button className="text-xs text-blue-500 hover:underline">View all</button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
                {loading ? (
                    <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
                ) : issues.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No recent issues found.</p>
                ) : (
                    issues.map((issue, idx) => {
                        const { label, color } = getDueLabel(issue.due_date);
                        return (
                            <div key={idx} className="flex items-center gap-4">
                                {/* Book cover */}
                                <div className="w-10 h-14 bg-gray-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                                    {issue.book_cover ? (
                                        <img src={issue.book_cover} alt={issue.book} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">📚</span>
                                    )}
                                </div>

                                {/* Book info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{issue.book}</p>
                                    <p className="text-xs text-gray-400">Issued to <span className="text-gray-600 font-medium">{issue.member}</span></p>
                                </div>

                                {/* Date + due */}
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-gray-400">{formatDate(issue.issue_date)}</p>
                                    <p className={`text-xs font-semibold ${color}`}>{label}</p>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Footer */}
                <div className="mt-2 text-center">
                    <button className="text-sm text-blue-500 hover:underline cursor-pointer">View all issues →</button>
                </div>
            </div>
        </div>
    );
}
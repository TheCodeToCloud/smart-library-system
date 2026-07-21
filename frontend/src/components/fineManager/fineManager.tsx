import { useState, useMemo } from "react";
import { Download, Search, Filter } from "lucide-react";
import { useFines, useMyFines, payFine, waiveFine, type FineRecord } from "../../data/fines";
import { useAuth } from "../../data/useAuth";
import { toast } from "react-toastify";

const statusStyles: Record<string, string> = {
    "unpaid": "bg-red-100 text-red-500",
    "paid": "bg-green-100 text-green-600",
    "waived": "bg-orange-100 text-orange-500",
};

const ITEMS_PER_PAGE = 10;

function fmt(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const avatarColors = [
    "bg-violet-400", "bg-blue-400", "bg-green-500", "bg-amber-400",
    "bg-rose-400", "bg-teal-500", "bg-cyan-500", "bg-pink-500",
];
function avatarColor(id: number) { return avatarColors[id % avatarColors.length]; }

function SummaryCard({ label, value, icon, iconBg }: { label: string; value: string; icon: string; iconBg: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 font-sans">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800 text-sm">{label}</h2>
            </div>
            <div className="flex items-center gap-3">
                <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0`}>
                    {icon}
                </div>
                <span className="font-bold text-gray-800 text-xl">{value}</span>
            </div>
        </div>
    );
}

function ActionButtons({ row, onDone }: { row: FineRecord; onDone: () => void }) {
    const [busy, setBusy] = useState(false);

    async function act(fn: () => Promise<any>, label: string) {
        if (!confirm(`${label}?`)) return;
        setBusy(true);
        try { await fn(); onDone(); }
        catch (e: any) { toast.error(e.response?.data?.error || `${label} failed`); }
        finally { setBusy(false); }
    }

    if (row.fine_status === "unpaid") {
        return (
            <div className="flex flex-col gap-1">
                <button disabled={busy} onClick={() => act(() => payFine(row.id), "Mark this fine as paid")}
                    className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition">
                    Mark Paid
                </button>
                <button disabled={busy} onClick={() => act(() => waiveFine(row.id), "Waive this fine")}
                    className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50 transition">
                    Waive
                </button>
            </div>
        );
    }

    return <span className="text-xs text-gray-400">—</span>;
}


function FineTable({ data, loading, showActions, onDone }: { data: FineRecord[], loading: boolean, showActions: boolean, onDone: () => void }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = useMemo(() => {
        return data.filter((f) => {
            const matchSearch =
                search === "" ||
                (f.member.full_name || f.member.username).toLowerCase().includes(search.toLowerCase()) ||
                f.member.email.toLowerCase().includes(search.toLowerCase()) ||
                f.id.toString().includes(search) ||
                f.book.title.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "All Status" || f.fine_status === statusFilter.toLowerCase();
            return matchSearch && matchStatus;
        });
    }, [data, search, statusFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Compute Summaries
    const totalAmount = data.reduce((acc, f) => acc + parseFloat(f.fine_amount), 0);
    const unpaidAmount = data.filter(f => f.fine_status === 'unpaid').reduce((acc, f) => acc + parseFloat(f.fine_amount), 0);
    const paidAmount = data.filter(f => f.fine_status === 'paid').reduce((acc, f) => acc + parseFloat(f.fine_amount), 0);
    const waivedAmount = data.filter(f => f.fine_status === 'waived').reduce((acc, f) => acc + parseFloat(f.fine_amount), 0);

    return (
        <div className="flex-1 min-w-0">
             {/* Summary Cards */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <SummaryCard label="Total Fines" value={`Rs. ${totalAmount.toFixed(2)}`} icon="💰" iconBg="bg-purple-100" />
                <SummaryCard label="Unpaid Fines" value={`Rs. ${unpaidAmount.toFixed(2)}`} icon="❌" iconBg="bg-red-100" />
                <SummaryCard label="Paid Fines" value={`Rs. ${paidAmount.toFixed(2)}`} icon="✅" iconBg="bg-green-100" />
                <SummaryCard label="Waived Fines" value={`Rs. ${waivedAmount.toFixed(2)}`} icon="⚡" iconBg="bg-orange-100" />
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[250px] max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        placeholder="Search by member, email, book or ID..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                    <option>All Status</option>
                    <option>Unpaid</option>
                    <option>Paid</option>
                    <option>Waived</option>
                </select>
                <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50">
                    <Filter size={14} />
                    Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm font-sans">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3 w-8">#</th>
                            <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3 w-20">ID</th>
                            {showActions && <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Member</th>}
                            <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Book</th>
                            <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Amount</th>
                            <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Status</th>
                            <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Issue Date</th>
                            <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Due Date</th>
                            {showActions && <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={showActions ? 9 : 8} className="text-center text-gray-400 text-sm py-10">Loading fines...</td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={showActions ? 9 : 8} className="text-center text-gray-400 text-sm py-10">No fines found.</td></tr>
                        ) : paginated.map((f, i) => (
                            <tr key={f.id} className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                                <td className="px-4 py-3 text-gray-400 text-xs">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                                <td className="px-4 py-3 text-xs text-gray-500 font-mono">#{f.id}</td>

                                {showActions && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`${avatarColor(f.member.id)} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                                {getInitials(f.member.full_name || f.member.username)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-xs">{f.member.full_name || f.member.username}</p>
                                                <p className="text-gray-400 text-xs">{f.member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                )}

                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800 text-xs leading-tight">{f.book.title}</p>
                                    <p className="text-gray-400 text-xs">{f.book.author}</p>
                                </td>

                                <td className="px-4 py-3 font-bold text-red-500">
                                    Rs. {parseFloat(f.fine_amount).toFixed(2)}
                                </td>

                                <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${statusStyles[f.fine_status] || "bg-gray-100 text-gray-600"}`}>
                                        {f.fine_status}
                                    </span>
                                    {f.fine_paid_date && <p className="text-[10px] text-gray-400 mt-0.5">{fmt(f.fine_paid_date)}</p>}
                                </td>

                                <td className="px-4 py-3 text-gray-500 text-xs">{fmt(f.issue_date)}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{fmt(f.due_date)}</td>

                                {showActions && (
                                    <td className="px-4 py-3">
                                        <ActionButtons row={f} onDone={onDone} />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 font-sans">
                    <p className="text-xs text-gray-400">
                        Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} fines
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40">‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 text-xs rounded-lg border font-medium ${page === currentPage ? "bg-purple-600 text-white border-purple-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                                {page}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
                            className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminFineView() {
    const { data, loading, refresh } = useFines();

    return (
        <div className="flex flex-col min-h-screen font-nav2 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-purple-600">Fine Manager</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage and track library fines and payments</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm">
                        <Download size={15} />
                        Export
                    </button>
                </div>
            </div>
            <FineTable data={data} loading={loading} showActions={true} onDone={refresh} />
        </div>
    );
}

function StudentFineView() {
    const { data, loading, refresh } = useMyFines();

    return (
        <div className="flex flex-col min-h-screen font-nav2 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-purple-600">My Fines</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Track your unpaid and paid library fines</p>
                </div>
                <button onClick={refresh} className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm">
                    ↻ Refresh
                </button>
            </div>
            <FineTable data={data} loading={loading} showActions={false} onDone={refresh} />
        </div>
    );
}

export default function FineManager() {
    const { user } = useAuth();
    if (!user) return null;
    return user.role === "student" ? <StudentFineView /> : <AdminFineView />;
}

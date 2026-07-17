import { useState, useMemo } from "react";
import {
    useIssuedBooks,
    usePendingRequests,
    useOverdueBooks,
    useMyBorrowHistory,
    approveRequest,
    rejectRequest,
    returnBook,
    type IssueBookRecord,
} from "../../data/circulation";
import { useAuth } from "../../data/useAuth";
import IssueBookModal from "./IssueBookModal";

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
    pending:  "bg-yellow-100 text-yellow-700",
    issued:   "bg-blue-100 text-blue-600",
    returned: "bg-green-100 text-green-600",
    rejected: "bg-gray-100 text-gray-500",
};

const TAB_ALL       = "All";
const TAB_ISSUED    = "Issued";
const TAB_PENDING   = "Pending";
const TAB_OVERDUE   = "Overdue";
const TAB_RETURNED  = "Returned";

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

// ── Row Actions (admin/librarian) ─────────────────────────────────────────────

function ActionButtons({ row, onDone }: { row: IssueBookRecord; onDone: () => void }) {
    const [busy, setBusy] = useState(false);

    async function act(fn: () => Promise<any>, label: string) {
        if (!confirm(`${label}?`)) return;
        setBusy(true);
        try { await fn(); onDone(); }
        catch (e: any) { alert(e.response?.data?.error || `${label} failed`); }
        finally { setBusy(false); }
    }

    if (row.status === "pending") return (
        <div className="flex gap-1">
            <button disabled={busy} onClick={() => act(() => approveRequest(row.id), "Approve this request")}
                className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition">
                ✓ Approve
            </button>
            <button disabled={busy} onClick={() => act(() => rejectRequest(row.id), "Reject this request")}
                className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition">
                ✗ Reject
            </button>
        </div>
    );

    if (row.status === "issued") return (
        <button disabled={busy} onClick={() => act(() => returnBook(row.id), "Mark this book as returned")}
            className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition">
            ↩ Return
        </button>
    );

    return <span className="text-xs text-gray-400">—</span>;
}

// ── Shared Table ──────────────────────────────────────────────────────────────

function IssueTable({ rows, showActions, onDone }: {
    rows: IssueBookRecord[];
    showActions: boolean;
    onDone: () => void;
}) {
    if (rows.length === 0)
        return <p className="text-sm text-gray-400 text-center py-10">No records found.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3 w-8">#</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Member</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Book</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Requested</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Issue Date</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Due Date</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Return Date</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Last Reminder</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Fine</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Status</th>
                        {showActions && <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={row.id} className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                            <td className="px-4 py-3 text-gray-400">{idx + 1}</td>

                            {/* Member */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className={`${avatarColor(row.member.id)} w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                        {getInitials(row.member.full_name || row.member.username)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-xs leading-tight">{row.member.full_name || row.member.username}</p>
                                        <p className="text-xs text-gray-400">{row.member.email}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Book */}
                            <td className="px-4 py-3">
                                <p className="font-semibold text-gray-800 text-xs">{row.book.title}</p>
                                <p className="text-xs text-gray-400">{row.book.author}</p>
                            </td>

                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmt(row.request_date)}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmt(row.issue_date)}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmt(row.due_date)}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmt(row.return_date)}</td>

                            {/* Last Reminder */}
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                {row.last_reminder_sent ? fmt(row.last_reminder_sent) : "—"}
                            </td>

                            {/* Fine */}
                            <td className="px-4 py-3 text-xs font-semibold">
                                {parseFloat(row.fine_amount) > 0
                                    ? <span className="text-red-500">Rs. {row.fine_amount}</span>
                                    : <span className="text-gray-400">—</span>}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                <span className={`${statusColor[row.status]} px-2 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                                    {row.status}
                                </span>
                            </td>

                            {showActions && (
                                <td className="px-4 py-3">
                                    <ActionButtons row={row} onDone={onDone} />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
    return (
        <div className={`${bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
    );
}

// ── Admin / Librarian view ────────────────────────────────────────────────────

function AdminIssueView() {
    const issued   = useIssuedBooks();
    const pending  = usePendingRequests();
    const overdue  = useOverdueBooks();

    const [activeTab, setActiveTab] = useState(TAB_ALL);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshAll = () => {
        issued.refresh();
        pending.refresh();
        overdue.refresh();
    };

    // Merge all unique records (by id) across the three lists
    const allRecords = useMemo<IssueBookRecord[]>(() => {
        const map = new Map<number, IssueBookRecord>();
        [...issued.data, ...pending.data, ...overdue.data].forEach(r => map.set(r.id, r));
        return Array.from(map.values()).sort((a, b) => b.id - a.id);
    }, [issued.data, pending.data, overdue.data]);

    const returnedRecords = useMemo(
        () => allRecords.filter(r => r.status === "returned"),
        [allRecords]
    );

    const filtered = useMemo(() => {
        let source: IssueBookRecord[];
        switch (activeTab) {
            case TAB_ISSUED:   source = issued.data; break;
            case TAB_PENDING:  source = pending.data; break;
            case TAB_OVERDUE:  source = overdue.data; break;
            case TAB_RETURNED: source = returnedRecords; break;
            default:           source = allRecords;
        }
        if (!search) return source;
        const q = search.toLowerCase();
        return source.filter(r =>
            (r.member.full_name || r.member.username).toLowerCase().includes(q) ||
            r.book.title.toLowerCase().includes(q) ||
            r.member.email.toLowerCase().includes(q)
        );
    }, [activeTab, search, allRecords, issued.data, pending.data, overdue.data, returnedRecords]);

    const isLoading = issued.loading || pending.loading || overdue.loading;
    const TABS = [TAB_ALL, TAB_ISSUED, TAB_PENDING, TAB_OVERDUE, TAB_RETURNED];

    const tabCount: Record<string, number> = {
        [TAB_ALL]:      allRecords.length,
        [TAB_ISSUED]:   issued.data.length,
        [TAB_PENDING]:  pending.data.length,
        [TAB_OVERDUE]:  overdue.data.length,
        [TAB_RETURNED]: returnedRecords.length,
    };

    return (
        <div className="flex gap-5 p-5 font-nav2">
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-purple-600">Issue / Return</h1>
                        <p className="text-sm text-gray-400">Manage book issues, returns and due dates</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                        >
                            + Issue Book
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
                            ↓ Export
                        </button>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <SummaryCard label="Issued"   value={issued.data.length}   color="text-blue-600"   bg="bg-blue-50" />
                    <SummaryCard label="Pending"  value={pending.data.length}  color="text-yellow-600" bg="bg-yellow-50" />
                    <SummaryCard label="Overdue"  value={overdue.data.length}  color="text-red-600"    bg="bg-red-50" />
                    <SummaryCard label="Returned" value={returnedRecords.length} color="text-green-600" bg="bg-green-50" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors
                                ${activeTab === tab
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                            {tab}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-purple-500" : "bg-gray-100 text-gray-500"}`}>
                                {tabCount[tab]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by member name, email or book title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-96 outline-none focus:border-purple-300"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <p className="text-center text-sm text-gray-400 py-12">Loading records...</p>
                    ) : (
                        <IssueTable rows={filtered} showActions={true} onDone={refreshAll} />
                    )}
                    <div className="px-5 py-3 text-xs text-gray-400 border-t border-gray-50">
                        Showing {filtered.length} of {allRecords.length} records
                    </div>
                </div>
            </div>

            <IssueBookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refreshAll}
            />
        </div>
    );
}

// ── Student view ──────────────────────────────────────────────────────────────

function StudentIssueView() {
    const { data, loading, refresh } = useMyBorrowHistory();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search) return data;
        const q = search.toLowerCase();
        return data.filter(r => r.book.title.toLowerCase().includes(q) || r.book.author.toLowerCase().includes(q));
    }, [data, search]);

    return (
        <div className="p-5 font-nav2">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-purple-600">My Borrowed Books</h1>
                    <p className="text-sm text-gray-400">Your full borrow history</p>
                </div>
                <button onClick={refresh} className="border border-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
                    ↻ Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <SummaryCard label="Total Borrowed" value={data.length}                                          color="text-purple-600" bg="bg-purple-50" />
                <SummaryCard label="Currently Issued" value={data.filter(r => r.status === "issued").length}    color="text-blue-600"   bg="bg-blue-50" />
                <SummaryCard label="Pending Approval" value={data.filter(r => r.status === "pending").length}   color="text-yellow-600" bg="bg-yellow-50" />
                <SummaryCard label="Returned" value={data.filter(r => r.status === "returned").length}          color="text-green-600"  bg="bg-green-50" />
            </div>

            {/* Search */}
            <div className="relative mb-5 max-w-sm">
                <input
                    type="text"
                    placeholder="Search by book title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-full outline-none focus:border-purple-300"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>

            {/* Table — student read-only, no Actions column */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <p className="text-center text-sm text-gray-400 py-12">Loading your history...</p>
                ) : (
                    <IssueTable rows={filtered} showActions={false} onDone={refresh} />
                )}
                <div className="px-5 py-3 text-xs text-gray-400 border-t border-gray-50">
                    Showing {filtered.length} of {data.length} records
                </div>
            </div>
        </div>
    );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function IssueReturn() {
    const { user } = useAuth();
    if (!user) return null;
    return user.role === "student" ? <StudentIssueView /> : <AdminIssueView />;
}
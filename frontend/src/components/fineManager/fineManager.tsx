import { useState, useMemo } from "react";
import { Download, Search, Filter } from "lucide-react";
import { fines, type Fine } from "../../data/fineManager";

const statusStyles: Record<Fine["status"], string> = {
    "Unpaid": "bg-red-100 text-red-500",
    "Paid": "bg-green-100 text-green-600",
    "Partially Paid": "bg-orange-100 text-orange-500",
};

const fineTypeStyles: Record<Fine["fineType"], string> = {
    Overdue: "bg-red-100 text-red-500",
    Damaged: "bg-purple-100 text-purple-500",
    Lost: "bg-gray-100 text-gray-600",
};

const ITEMS_PER_PAGE = 10;

export default function FineManager() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = useMemo(() => {
        return fines.filter((f) => {
            const matchSearch =
                search === "" ||
                f.member.name.toLowerCase().includes(search.toLowerCase()) ||
                f.member.email.toLowerCase().includes(search.toLowerCase()) ||
                f.fineId.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "All Status" || f.status === statusFilter;
            const matchType = typeFilter === "All Types" || f.fineType === typeFilter;
            return matchSearch && matchStatus && matchType;
        });
    }, [search, statusFilter, typeFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // const recentFines = fines.slice(0, 5);

    return (
        <div className="flex gap-0 min-h-screen font-sans">

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">

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
                        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors">
                            💳 Record Payment
                        </button>
                    </div>
                </div>

                {/* Search + Filters */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            placeholder="Search by member name, email or fine ID..."
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
                        <option>Partially Paid</option>
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    >
                        <option>All Types</option>
                        <option>Overdue</option>
                        <option>Damaged</option>
                        <option>Lost</option>
                    </select>
                    <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50">
                        <Filter size={14} />
                        Filters
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">

                    {/* Table Header */}
                    <div className="grid px-4 py-3 text-xs text-gray-400 border-b border-gray-100"
                        style={{ gridTemplateColumns: "36px 100px 2fr 1.5fr 90px 80px 90px 1fr 1fr 90px" }}>
                        <span>#</span>
                        <span>Fine ID</span>
                        <span>Member</span>
                        <span>Book</span>
                        <span>Fine Type</span>
                        <span>Amount</span>
                        <span>Status</span>
                        <span>Issue Date</span>
                        <span>Due Date</span>
                        <span>Actions</span>
                    </div>

                    {/* Rows */}
                    {paginated.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-10">No fines found.</p>
                    ) : paginated.map((f, i) => (
                        <div key={f.id}
                            className="grid px-4 py-3 items-center border-b border-gray-50 hover:bg-purple-50/20 transition-colors text-sm"
                            style={{ gridTemplateColumns: "36px 100px 2fr 1.5fr 90px 80px 90px 1fr 1fr 90px" }}>

                            <span className="text-gray-400 text-xs">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</span>
                            <span className="text-xs text-gray-500 font-mono">{f.fineId}</span>

                            {/* Member */}
                            <div className="flex items-center gap-2">
                                <div className={`${f.member.avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                    {f.member.initials}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-xs">{f.member.name}</p>
                                    <p className="text-gray-400 text-xs">{f.member.email}</p>
                                </div>
                            </div>

                            {/* Book */}
                            <div className="flex items-center gap-2">
                                <img src={f.book.img} alt={f.book.title}
                                    className="w-7 h-9 object-cover rounded shrink-0 bg-gray-100"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/28x36?text=📚"; }}
                                />
                                <div>
                                    <p className="font-medium text-gray-800 text-xs leading-tight">{f.book.title}</p>
                                    <p className="text-gray-400 text-xs">{f.book.author}</p>
                                </div>
                            </div>

                            {/* Fine Type */}
                            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold w-fit ${fineTypeStyles[f.fineType]}`}>
                                {f.fineType}
                            </span>

                            {/* Amount */}
                            <span className="font-bold text-red-500">${f.amount.toFixed(2)}</span>

                            {/* Status */}
                            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold w-fit ${statusStyles[f.status]}`}>
                                {f.status}
                            </span>

                            {/* Issue Date */}
                            <span className="text-gray-500 text-xs">{f.issueDate}</span>

                            {/* Due Date */}
                            <div>
                                <p className="text-gray-500 text-xs">{f.dueDate}</p>
                                {f.daysOverdue > 0 && (
                                    <p className="text-red-400 text-xs">({f.daysOverdue} days overdue)</p>
                                )}
                                {f.paidDate && (
                                    <p className="text-green-500 text-xs">{f.paidDate}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 text-xs" title="View">👁️</button>
                                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 text-xs" title="Info">ℹ️</button>
                                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 text-xs" title="More">•••</button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
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

            {/* Right Sidebar */}
            {/* Fine Overview */}
            {/* <div className="w-72 shrink-0 p-4 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-800 text-sm">Fine Overview</h2>
                        <button className="text-xs text-blue-500 hover:underline">View all</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {fineOverview.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`${item.iconBg} w-7 h-7 rounded-lg flex items-center justify-center text-sm`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Recent Fines */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-800 text-sm">Recent Fines</h2>
                        <button className="text-xs text-blue-500 hover:underline">View all</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {recentFines.map((f) => (
                            <div key={f.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`${f.member.avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                        {f.member.initials}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-800">{f.member.name}</p>
                                        <p className="text-xs text-gray-400">{f.fineId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-800">${f.amount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">{f.daysOverdue > 0 ? `${f.daysOverdue} days ago` : "—"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}
        </div>
    );
}

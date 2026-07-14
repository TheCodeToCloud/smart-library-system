import { useState } from "react";
import { issues, issueSummary, overdueBooks, recentReturns } from "../../data/issues";

const statusColor: Record<string, string> = {
    "Issued": "bg-blue-100 text-blue-600",
    "Returned": "bg-green-100 text-green-600",
    "Overdue": "bg-red-100 text-red-600",
    "Lost / Damaged": "bg-orange-100 text-orange-600",
};

const tabs = ["All Transactions", "Issued", "Returned", "Overdue", "Lost / Damaged"];

export default function IssueReturn() {
    const [activeTab, setActiveTab] = useState("All Transactions");
    const [search, setSearch] = useState("");

    const filtered = issues.filter(i => {
        const matchTab = activeTab === "All Transactions" || i.status === activeTab;
        const matchSearch = i.memberName.toLowerCase().includes(search.toLowerCase()) ||
            i.book.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    return (
        <div className="flex gap-5 p-5 font-nav2">

            {/* Main Content */}
            <div className="flex-1 min-w-0">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-purple-600">Issues / Returns</h1>
                        <p className="text-sm text-gray-400">Manage book issues, returns and due dates</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700">
                            + Issue Book
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
                            ↓ Export
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors
                                ${activeTab === tab
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search + Filters */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by member name, book title or ISBN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-80 outline-none"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                    </div>
                    <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                        <option>All Members</option>
                    </select>
                    <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                        <option>All Status</option>
                        <option>Issued</option>
                        <option>Returned</option>
                        <option>Overdue</option>
                        <option>Lost / Damaged</option>
                    </select>
                    <button className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
                        📅 Date Range
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-8 px-5 py-3 text-xs text-gray-400 border-b border-gray-100">
                        <span>#</span>
                        <span className="col-span-2">Member</span>
                        <span className="col-span-2">Book</span>
                        <span>Issue Date</span>
                        <span>Due Date</span>
                        <span>Status</span>
                    </div>

                    {/* Rows */}
                    {filtered.map(item => (
                        <div key={item.id} className="grid grid-cols-8 px-5 py-3 items-center border-b border-gray-50 hover:bg-gray-50 text-sm">
                            <span className="text-gray-400">{item.id}</span>

                            {/* Member */}
                            <div className="col-span-2 flex items-center gap-2">
                                <div className={`${item.avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                    {item.initials}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-xs">{item.memberName}</p>
                                    <p className="text-xs text-gray-400">{item.memberId}</p>
                                </div>
                            </div>

                            {/* Book */}
                            <div className="col-span-2">
                                <p className="font-semibold text-gray-800 text-xs">{item.book}</p>
                                <p className="text-xs text-gray-400">{item.bookAuthor}</p>
                            </div>

                            <span className="text-xs text-gray-500">{item.issueDate}</span>
                            <span className="text-xs text-gray-500">{item.dueDate}</span>

                            {/* Status */}
                            <span className={`${statusColor[item.status]} px-2 py-1 rounded-full text-xs font-semibold w-fit`}>
                                {item.status}
                            </span>
                        </div>
                    ))}

                    {/* Footer */}
                    <div className="px-5 py-3 text-xs text-gray-400">
                        Showing 1 to {filtered.length} of {issues.length} entries
                    </div>
                </div>

                {/* Bottom issue,return */}

                <div className="shrink-0 flex w-full justify-center items-center pt-10 flex-row gap-10">
                    {/* Issue Summary */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-800">Issue Summary</h2>
                            <button className="text-xs text-blue-500 hover:underline">View all</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {issueSummary.map(s => (
                                <div key={s.id} className={`${s.bg} rounded-xl p-3 text-center`}>
                                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overdue Books */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-800">Overdue Books</h2>
                            <button className="text-xs text-blue-500 hover:underline">View all</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {overdueBooks.map(b => (
                                <div key={b.id} className="flex items-center gap-3">
                                    <img src={b.img} alt={b.title} className="w-10 h-12 object-cover rounded-md shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 truncate">{b.title}</p>
                                        <p className="text-xs text-gray-400">{b.author}</p>
                                        <p className="text-xs text-gray-400">{b.due}</p>
                                    </div>
                                    <span className={`text-xs font-bold ${b.fineColor} shrink-0`}>{b.fine}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Returns */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-800">Recent Returns</h2>
                            <button className="text-xs text-blue-500 hover:underline">View all</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {recentReturns.map(b => (
                                <div key={b.id} className="flex items-center gap-3">
                                    <img src={b.img} alt={b.title} className="w-10 h-12 object-cover rounded-md shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 truncate">{b.title}</p>
                                        <p className="text-xs text-gray-400">{b.author}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">{b.returnDate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
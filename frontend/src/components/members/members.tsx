import { useMembers, getAvatarColor, getInitialsFromName } from "../../data/members";
import BooksPagination from "../books/BooksPagination";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function Members() {
    const { members, loading, error } = useMembers();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [currentPage, setCurrentPage] = useState(1);  // ← added

    const filtered = members.filter(m => {
        const matchSearch =
            m.full_name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            statusFilter === "All Status" ||
            (statusFilter === "Active" && m.kyc_status === "approved") ||
            (statusFilter === "Inactive" && m.kyc_status === "pending");
        return matchSearch && matchStatus;
    });

    // ← added
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
    const handleStatus = (value: string) => { setStatusFilter(value); setCurrentPage(1); };

    if (loading) return <p className="p-5 text-gray-400">Loading members...</p>;
    if (error) return <p className="p-5 text-red-400">Error: {error}</p>;

    return (
        <div className="p-5 font-nav2">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-purple-600">Members</h1>
                    <p className="text-sm text-gray-400">Manage and organize library members</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700">
                        + Add New Member
                    </button>
                    <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
                        ↓ Export
                    </button>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search members by name or email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}  // ← updated
                        className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-72 outline-none"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => handleStatus(e.target.value)}  // ← updated
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Table Header */}
            <div className="grid px-5 py-3 text-xs text-gray-400 border-b border-gray-100"
                style={{ gridTemplateColumns: "40px 2fr 2fr 1.5fr 1.2fr 1fr" }}>
                <span>#</span>
                <span>Member</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Department</span>
                <span>Joined On</span>
            </div>

            {/* Table Rows */}
            {paginated.map((m, index) => (  // ← changed filtered to paginated
                <div key={m.id} className="grid px-5 py-3 items-center border-b border-gray-50 hover:bg-gray-50 text-sm"
                    style={{ gridTemplateColumns: "40px 2fr 2fr 1.5fr 1.2fr 1fr" }}>
                    <span className="text-gray-400">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3">
                        <div className={`${getAvatarColor(m.id)} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {getInitialsFromName(m.full_name)}
                        </div>
                        <span className="font-semibold text-gray-800">{m.full_name}</span>
                    </div>

                    <span className="text-gray-500">{m.email}</span>
                    <span className="text-gray-500">{m.phone}</span>

                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold w-fit">
                        {m.department}
                    </span>

                    <span className="text-gray-500">
                        {new Date(m.joined_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                </div>
            ))}

            {/* Pagination */}  
            <BooksPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
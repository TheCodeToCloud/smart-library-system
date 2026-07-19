import { useState } from "react";
import { useMembers, getAvatarColor, getInitialsFromName } from "../../data/members";
import BooksPagination from "../books/BooksPagination";
import api from "../../data/api";
import AddMemberModal from "./AddMemberModal";

const ITEMS_PER_PAGE = 10;

const kycStyles: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    pending:  "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-600",
    "N/A":    "bg-gray-100 text-gray-500",
};

const kycLabel: Record<string, string> = {
    approved: "✓ Approved",
    pending:  "⏳ Pending",
    rejected: "✗ Rejected",
    "N/A":    "— N/A",
};

export default function Members() {
    const { members, loading, error, refreshMembers } = useMembers();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [currentPage, setCurrentPage] = useState(1);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = members.filter(m => {
        const matchSearch =
            m.full_name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            statusFilter === "All Status" ||
            (statusFilter === "Active"   && m.kyc_status === "approved") ||
            (statusFilter === "Pending"  && m.kyc_status === "pending") ||
            (statusFilter === "Rejected" && m.kyc_status === "rejected") ||
            (statusFilter === "Inactive" && m.kyc_status === "pending");
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
    const handleStatus = (value: string) => { setStatusFilter(value); setCurrentPage(1); };

    const handleExport = () => {
        if (filtered.length === 0) {
            alert("No members available to export.");
            return;
        }

        const headers = ["ID,Name,Email,Phone,Department,Role,KYC Status,Joined On"];
        const rows = filtered.map(m => 
            `"${m.id}","${m.full_name || m.username}","${m.email}","${m.phone || ''}","${m.department || ''}","${m.role}","${m.kyc_status}","${m.date_joined || ''}"`
        );
        const csvContent = headers.concat(rows).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `members_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    async function handleKYC(userId: number, action: "approve" | "reject") {
        if (!confirm(`${action === "approve" ? "Approve" : "Reject"} this student's KYC?`)) return;
        setBusyId(userId);
        try {
            await api.post(`/api/accounts/kyc/${userId}/${action}/`);
            refreshMembers();
        } catch (e: any) {
            alert(e.response?.data?.error || "KYC action failed.");
        } finally {
            setBusyId(null);
        }
    }

    if (loading) return <p className="p-5 text-gray-400">Loading members...</p>;
    if (error)   return <p className="p-5 text-red-400">Error: {error}</p>;

    return (
        <div className="p-5 font-nav2">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-purple-600">Members</h1>
                    <p className="text-sm text-gray-400">Manage and organize library members</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700">
                        + Add New Member
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
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
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-72 outline-none"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => handleStatus(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                </select>
            </div>

            {/* Table Header */}
            <div className="grid px-5 py-3 text-xs text-gray-400 border-b border-gray-100"
                style={{ gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr 1fr 1.5fr" }}>
                <span>#</span>
                <span>Member</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Department</span>
                <span>KYC Status</span>
                <span>ID Proof</span>
                <span>Actions</span>
            </div>

            {/* Table Rows */}
            {paginated.map((m, index) => (
                <div key={m.id} className="grid px-5 py-3 items-center border-b border-gray-50 hover:bg-gray-50 text-sm"
                    style={{ gridTemplateColumns: "40px 2fr 2fr 1fr 1fr 1fr 1fr 1.5fr" }}>
                    <span className="text-gray-400">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3">
                        <div className={`${getAvatarColor(m.id)} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {getInitialsFromName(m.full_name)}
                        </div>
                        <span className="font-semibold text-gray-800">{m.full_name}</span>
                    </div>

                    <span className="text-gray-500 truncate">{m.email}</span>
                    <span className="text-gray-500">{m.phone || "—"}</span>

                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold w-fit">
                        {m.department || "—"}
                    </span>

                    {/* KYC Status Badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${kycStyles[m.kyc_status] ?? kycStyles["N/A"]}`}>
                        {kycLabel[m.kyc_status] ?? m.kyc_status}
                    </span>

                    {/* ID Proof Link */}
                    <div>
                        {(m as any).id_proof ? (
                            <a
                                href={(m as any).id_proof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 hover:text-purple-800 underline font-semibold"
                            >
                                View ID
                            </a>
                        ) : (
                            <span className="text-xs text-gray-400">None</span>
                        )}
                    </div>

                    {/* KYC Actions (students only, pending only shows both buttons) */}
                    <div className="flex gap-1 flex-wrap">
                        {m.role === "student" && m.kyc_status === "pending" && (
                            <>
                                <button
                                    disabled={busyId === m.id}
                                    onClick={() => handleKYC(m.id, "approve")}
                                    className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition"
                                >
                                    ✓ Approve
                                </button>
                                <button
                                    disabled={busyId === m.id}
                                    onClick={() => handleKYC(m.id, "reject")}
                                    className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition"
                                >
                                    ✗ Reject
                                </button>
                            </>
                        )}
                        {m.role === "student" && m.kyc_status === "approved" && (
                            <button
                                disabled={busyId === m.id}
                                onClick={() => handleKYC(m.id, "reject")}
                                className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition"
                            >
                                ✗ Revoke
                            </button>
                        )}
                        {m.role === "student" && m.kyc_status === "rejected" && (
                            <button
                                disabled={busyId === m.id}
                                onClick={() => handleKYC(m.id, "approve")}
                                className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition"
                            >
                                ✓ Re-approve
                            </button>
                        )}
                        {m.role !== "student" && (
                            <span className="text-xs text-gray-400">—</span>
                        )}
                    </div>
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

            <AddMemberModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refreshMembers}
            />
        </div>
    );
}
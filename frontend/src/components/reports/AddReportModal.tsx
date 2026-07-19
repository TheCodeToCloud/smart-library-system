import React, { useState } from "react";
import { generateReport } from "../../data/reportsAPI";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddReportModal({ isOpen, onClose, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [reportType, setReportType] = useState("Members");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Report Name is required.");
            return;
        }
        
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setError("Start Date cannot be after End Date.");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            await generateReport({
                name,
                report_type: reportType,
                start_date: startDate,
                end_date: endDate,
            });
            onSuccess();
            onClose();
            // Reset form
            setName("");
            setReportType("Members");
            setStartDate("");
            setEndDate("");
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || "Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800">Generate New Report</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Report Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Monthly Finance Report"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Report Type
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 bg-white"
                        >
                            <option value="Members">Members</option>
                            <option value="Books">Books</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Start Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                End Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 text-gray-600"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                        Leave dates empty to include all historical records up to today.
                    </p>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate CSV"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import api from "../../data/api";
import { useBooks } from "../../data/books";
import QRScanner from "./QRScanner";

interface Member {
    id: number;
    username: string;
    full_name?: string;
    email: string;
    role: string;
}

interface IssueBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function IssueBookModal({ isOpen, onClose, onSuccess }: IssueBookModalProps) {
    const { books, loading: booksLoading } = useBooks();
    const [members, setMembers] = useState<Member[]>([]);
    const [membersLoading, setMembersLoading] = useState(true);

    const [selectedMember, setSelectedMember] = useState("");
    const [selectedBook, setSelectedBook] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setMembersLoading(true);
        api.get("/api/accounts/members/")
            .then((res) => setMembers(res.data))
            .catch(() => {})
            .finally(() => setMembersLoading(false));
    }, [isOpen]);

    const [isScanning, setIsScanning] = useState(false);

    if (!isOpen) return null;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember || !selectedBook) {
            setError("Please select both a member and a book.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await api.post("/api/circulation/issue-direct/", {
                member: parseInt(selectedMember),
                book: parseInt(selectedBook),
            });
            onSuccess();
            onClose();
            setSelectedMember("");
            setSelectedBook("");
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.detail || "Failed to issue book.");
        } finally {
            setLoading(false);
        }
    };



    const handleScan = async (text: string) => {
        setIsScanning(false);
        try {
            // Expected format: "Book ID: X / Title: Y" or similar containing "Book ID: X"
            const match = text.match(/Book ID:\s*(\d+)/i);
            if (!match) {
                setError(`Could not parse Book ID from QR code: "${text}"`);
                return;
            }
            const scannedId = match[1];

            // Verify with backend
            setLoading(true);
            await api.get(`/api/books/${scannedId}/`);
            setSelectedBook(scannedId);
            setLoading(false);
            setError("");
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.detail || "Scanned book not found on server.");
        }
    };

    const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-300 outline-none transition bg-white";
    const labelCls = "block text-sm font-semibold text-gray-800 mb-1.5";

    return (
        <>
            {isScanning && (
                <QRScanner onScan={handleScan} onClose={() => setIsScanning(false)} />
            )}
            
            <div className="fixed inset-0 z-[40] flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-sans">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Issue a Book</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Directly issue a book to a member</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-xl">✕</button>
                    </div>

                    {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelCls}>Member</label>
                            {membersLoading ? (
                                <p className="text-sm text-gray-400">Loading members...</p>
                            ) : (
                                <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} className={inputCls} required>
                                    <option value="">Select a member</option>
                                    {(Array.isArray(members) ? members : [])
                                        .map((m) => (
                                            <option key={m?.id} value={m?.id}>
                                                {m?.full_name || m?.username} — {m?.email}
                                            </option>
                                        ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-gray-800">Book</label>
                                <button type="button" onClick={() => setIsScanning(true)} className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                    📷 Scan QR
                                </button>
                            </div>
                            {booksLoading ? (
                                <p className="text-sm text-gray-400">Loading books...</p>
                            ) : (
                                <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} className={inputCls} required>
                                    <option value="">Select a book</option>
                                    {(Array.isArray(books) ? books : [])
                                        .filter((b) => b?.available_copies > 0 || (b?.id && b.id.toString() === selectedBook)) // Keep visible if selected
                                        .map((b) => (
                                            <option key={b?.id} value={b?.id}>
                                                {b?.title} — {b?.author} ({b?.available_copies} left)
                                            </option>
                                        ))}
                                </select>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-60 transition">
                                {loading ? "Working..." : "Issue Book"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

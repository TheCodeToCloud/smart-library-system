import { useAnnouncements, useNewArrivals, useRealAnnouncements } from "../../data/rightside";
import MiniCalendar from "./miniCalendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../data/useAuth";
import QuickAction from "../noti , quickAction ,recent issue/quickAction";
import { toast } from "react-toastify";

export default function RightSidebar() {
    const { user } = useAuth();
    const { announcements, loading: activityLoading } = useAnnouncements();
    const { realAnnouncements, loading: announcementsLoading, addAnnouncement, deleteAnnouncement, timeAgo } = useRealAnnouncements();
    const { books: newArrivals, loading: booksLoading } = useNewArrivals();
    
    const [showAll, setShowAll] = useState(false);
    const [showAllBooks, setShowAllBooks] = useState(false);
    const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMsg, setNewMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddAnnouncement = async () => {
        if (!newMsg.trim()) return;
        setIsSubmitting(true);
        try {
            await addAnnouncement(newMsg);
            setNewMsg("");
            setIsModalOpen(false);
            toast.success("Announcement posted!");
        } catch (e) {
            toast.error("Failed to post announcement");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this announcement?")) {
            await deleteAnnouncement(id);
            toast.success("Announcement deleted");
        }
    };

    const visibleActivity = showAll ? announcements : announcements.slice(0, 2);
    const visibleBooks = showAllBooks ? newArrivals : newArrivals.slice(0, 4);
    const visibleRealAnnouncements = showAllAnnouncements ? realAnnouncements : realAnnouncements.slice(0, 2);



    return (
        <div className="w-96 shrink-0 flex flex-col gap-5 py-5 overflow-y-auto">

            {/* Calendar */}
            <MiniCalendar />

            {/* Real Announcements */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-purple-800 flex items-center gap-2">
                        📢 Announcements
                    </h2>
                    <div className="flex items-center gap-2">
                        {(user?.role === 'admin' || user?.role === 'librarian') && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-xs bg-purple-600 text-white px-2 py-1 rounded-md hover:bg-purple-700 transition"
                            >
                                + New
                            </button>
                        )}
                        {realAnnouncements.length > 2 && (
                            <button
                                onClick={() => setShowAllAnnouncements(!showAllAnnouncements)}
                                className="text-xs text-purple-600 hover:underline cursor-pointer"
                            >
                                {showAllAnnouncements ? "Show less" : "View all"}
                            </button>
                        )}
                    </div>
                </div>

                {announcementsLoading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : realAnnouncements.length === 0 ? (
                    <p className="text-sm text-gray-400">No announcements yet.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {visibleRealAnnouncements.map(a => (
                            <div key={a.id} className="border border-purple-50 rounded-xl p-3 bg-purple-50/50">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {a.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-full text-purple-600 border border-purple-100">
                                                {a.created_by_name}
                                            </span>
                                            <span className="text-xs text-gray-400">{timeAgo(a.created_at)}</span>
                                        </div>
                                    </div>
                                    {(user?.role === 'admin' || user?.role === 'librarian') && (
                                        <button onClick={() => handleDelete(a.id)}
                                            className="text-xs text-red-400 hover:text-red-600 shrink-0 mt-0.5">
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        ⚡ Recent Activity
                    </h2>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                        {showAll ? "Show less" : "View all"}
                    </button>
                </div>

                {activityLoading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {visibleActivity.map(a => (
                            <div key={a.id} className={`border rounded-xl p-3 ${a.color}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {a.text}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New Arrivals */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">✨ New Arrivals</h2>
                    <button onClick={() => setShowAllBooks(!showAllBooks)} className="text-xs text-blue-500 hover:underline cursor-pointer">
                        {showAllBooks ? "Show less" : "View all"}
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {booksLoading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : newArrivals.length === 0 ? (
                        <p className="text-sm text-gray-400">No books found.</p>
                    ) : (
                        visibleBooks.map((book, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-10 h-14 bg-gray-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                                    {book.cover_image ? (
                                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">📚</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{book.title}</p>
                                    <p className="text-xs text-gray-400">{book.author}</p>
                                </div>
                                <span className="text-[10px] font-medium bg-purple-100 text-purple-600 px-2 py-1 rounded-full shrink-0">
                                    {book.category}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal for new announcement */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-900">Post Announcement</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
                        </div>
                        <textarea
                            value={newMsg}
                            onChange={e => setNewMsg(e.target.value)}
                            placeholder="Type your announcement here... It will be visible to everyone."
                            className="w-full border border-gray-200 rounded-xl p-3 h-32 resize-none outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                        ></textarea>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAnnouncement}
                                disabled={!newMsg.trim() || isSubmitting}
                                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition"
                            >
                                {isSubmitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {user?.role !== 'student' && (
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-auto"><QuickAction /></div>
                </div>
            )}
        </div>
    );
}
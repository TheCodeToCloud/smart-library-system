import { useAnnouncements, usePopularBooks } from "../../data/rightside";
import MiniCalendar from "./miniCalendar";
import { useState } from "react";

export default function RightSidebar() {
    const { announcements, loading } = useAnnouncements();
    const { books: popularBooks, loading: booksLoading } = usePopularBooks();
    const [editedItems, setEditedItems] = useState<Record<number, string>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [showAll, setShowAll] = useState(false);  // ← added

    const startEdit = (id: number, text: string) => {
        setEditingId(id);
        setEditText(text);
    };

    const saveEdit = (id: number) => {
        setEditedItems(prev => ({ ...prev, [id]: editText }));
        setEditingId(null);
    };

    const visibleAnnouncements = showAll ? announcements : announcements.slice(0, 2);  // ← added

    return (
        <div className="w-96 shrink-0 flex flex-col gap-5 py-5 overflow-y-auto">

            {/* Calendar */}
            <MiniCalendar />

            {/* Announcements */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        📢 Announcements
                    </h2>
                    <button
                        onClick={() => setShowAll(!showAll)}  // ← updated
                        className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                        {showAll ? "Show less" : "View all"}  {/* ← updated */}
                    </button>
                </div>

                {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {visibleAnnouncements.map(a => (  // ← changed announcements to visibleAnnouncements
                            <div key={a.id} className={`border rounded-xl p-3 ${a.color}`}>
                                {editingId === a.id ? (
                                    <div className="flex flex-col gap-2 cursor-pointer">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="text-sm border rounded p-1 w-full outline-none bg-white"
                                            rows={2}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => saveEdit(a.id)}
                                                className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                                Save
                                            </button>
                                            <button onClick={() => setEditingId(null)}
                                                className="text-xs bg-gray-300 px-2 py-1 rounded">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {editedItems[a.id] ?? a.text}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                                        </div>
                                        <button onClick={() => startEdit(a.id, editedItems[a.id] ?? a.text)}
                                            className="text-xs text-blue-400 hover:text-blue-600 ml-2 shrink-0">
                                            ✏️
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Popular Books */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800">Popular Books</h2>
                    <button className="text-xs text-blue-500 hover:underline">View all</button>
                </div>
                <div className="flex flex-col gap-3">
                    {booksLoading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : popularBooks.length === 0 ? (
                        <p className="text-sm text-gray-400">No books found.</p>
                    ) : (
                        popularBooks.map((book, idx) => (
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
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0">
                                    {book.times_issued} Issues
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
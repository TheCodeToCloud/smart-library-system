import { useEffect, useState } from "react";
import api from "../data/api";
import { useRecommendations } from "../data/circulation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Recommendation {
    id: number;
    title: string;
    author: string;
    cover_image: string | null;
    reason: string;
}

interface TrendingBook {
    title: string;
    author: string;
    times_issued: number;
    cover_image: string | null;
}

// ── Shared skeleton ───────────────────────────────────────────────────────────

function BookCardSkeleton() {
    return (
        <div className="flex flex-col gap-2 animate-pulse">
            <div className="w-full aspect-[2/3] rounded-xl bg-gray-200" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-1/2" />
        </div>
    );
}

// ── Recommended For You (Student) ─────────────────────────────────────────────

export function RecommendedBooks() {
    const { data, loading } = useRecommendations();

    return (
        <div className="px-5 pt-5 pb-2 font-nav2">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        ✨ Recommended for You
                    </h2>
                    <p className="text-xs text-gray-400">Based on your reading history</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => <BookCardSkeleton key={i} />)}
                </div>
            ) : data.length === 0 ? (
                <p className="text-sm text-gray-400">No recommendations yet — borrow a book to get started!</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {data.map((rec: Recommendation) => (
                        <div key={rec.id} className="flex flex-col gap-1.5 group cursor-pointer">
                            <div className="relative overflow-hidden rounded-xl shadow-sm bg-gray-100 aspect-[2/3]">
                                <img
                                    src={rec.cover_image ?? "https://placehold.co/120x180?text=📚"}
                                    alt={rec.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/120x180?text=📚"; }}
                                />
                                {/* Overlay reason badge */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] text-white font-medium leading-tight">{rec.reason}</p>
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{rec.title}</p>
                            <p className="text-[10px] text-purple-500 font-medium">{rec.reason}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Trending This Month (Admin / Librarian) ───────────────────────────────────

export function TrendingBooks() {
    const [data, setData] = useState<TrendingBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/popular-books/?period=30d")
            .then((res) => setData(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="px-5 pt-5 pb-2 font-nav2">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        🔥 Trending This Month
                    </h2>
                    <p className="text-xs text-gray-400">Most borrowed books in the last 30 days</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => <BookCardSkeleton key={i} />)}
                </div>
            ) : data.length === 0 ? (
                <p className="text-sm text-gray-400">No books have been issued in the last 30 days.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {data.map((book, idx) => (
                        <div key={book.title} className="flex flex-col gap-1.5 group cursor-pointer">
                            <div className="relative overflow-hidden rounded-xl shadow-sm bg-gray-100 aspect-[2/3]">
                                <img
                                    src={book.cover_image ?? "https://placehold.co/120x180?text=📚"}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/120x180?text=📚"; }}
                                />
                                {/* Rank badge */}
                                <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                                    {idx + 1}
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{book.title}</p>
                            <p className="text-[10px] text-gray-400">{book.author}</p>
                            <p className="text-[10px] font-semibold text-purple-500">{book.times_issued} issues this month</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

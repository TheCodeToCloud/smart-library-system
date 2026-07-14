import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Book } from "../../data/books";

// Derive status from available_copies since API has no status field
function getStatus(book: Book): "Available" | "Issued" | "Overdue" {
    if (book.available_copies === 0) return "Overdue";
    if (book.available_copies < book.total_copies) return "Issued";
    return "Available";
}

const statusStyles = {
    Available: "bg-green-100 text-green-600",
    Issued: "bg-orange-100 text-orange-500",
    Overdue: "bg-red-100 text-red-500",
};

const categoryColors: Record<string, string> = {
    "Computer Science": "bg-cyan-100 text-cyan-600",
    "Education": "bg-purple-100 text-purple-600",
    "Technology": "bg-pink-100 text-pink-600",
    "Fiction": "bg-green-100 text-green-600",
    "Self Help": "bg-orange-100 text-orange-600",
    "Finance": "bg-yellow-100 text-yellow-600",
    "Science": "bg-blue-100 text-blue-600",
};

type Props = {
    book: Book;
    index: number;
};

export default function BookRow({ book, index }: Props) {
    const status = getStatus(book);
    const categoryColor = categoryColors[book.category] ?? "bg-gray-100 text-gray-600";

    return (
        <tr className="border-b border-gray-50 hover:bg-violet-50/30 transition-colors group">
            {/* Row Number */}
            <td className="px-4 py-3 text-gray-400 font-medium">{index}</td>

            {/* Book Details */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <img
                        src={book.cover_image}   // ← only this line changed
                        alt={book.title}
                        loading="lazy"
                        className="w-9 h-12 object-cover rounded shadow-sm flex-shrink-0 bg-gray-100"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/36x48?text=📚";
                        }}
                    />
                    <div>
                        <p className="font-semibold text-gray-800 leading-tight">{book.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{book.isbn}</p>  {/* ← was book.edition (not in API) */}
                    </div>
                </div>
            </td>

            {/* Author */}
            <td className="px-4 py-3 text-gray-600">{book.author}</td>

            {/* Category */}
            <td className="px-4 py-3">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${categoryColor}`}>  {/* ← was book.categoryColor */}
                    {book.category}
                </span>
            </td>

            {/* ISBN */}
            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{book.isbn}</td>

            {/* Copies */}
            <td className="px-4 py-3 text-gray-700 font-medium">
                {book.available_copies} / {book.total_copies}   {/* ← was book.copies */}
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${statusStyles[status]}`}>
                    {status}   {/* ← derived from available_copies */}
                </span>
            </td>

            {/* Added On */}
            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                {new Date(book.created_at).toLocaleDateString()}   {/* ← was book.addedOn */}
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 transition-colors" title="View">
                        <Eye size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-50 transition-colors" title="Edit">
                        <Pencil size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
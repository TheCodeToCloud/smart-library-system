import { Eye, Pencil, Trash2, LibraryBig, QrCode } from "lucide-react";
import type { Book } from "../../data/books";
import { useAuth } from "../../data/useAuth";
import api from "../../data/api";
import { toast } from "react-toastify";

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
    onKycRequired: () => void;
    onView: (book: Book) => void;
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
};

export default function BookRow({ book, index, onKycRequired, onView, onEdit, onDelete }: Props) {
    const status = getStatus(book);
    const categoryColor = categoryColors[book.category] ?? "bg-gray-100 text-gray-600";
    const { user } = useAuth();
    const isAdminOrLibrarian = user?.role === 'admin' || user?.role === 'librarian';

    const handleBorrow = async () => {
        try {
            await api.post("/api/circulation/borrow/", { book: book.id });
            toast.success("Book borrowed successfully!");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Failed to borrow book";
            if (msg.includes("not submitted") || msg.includes("rejected")) {
                onKycRequired();
            } else {
                toast.error(msg);
            }
        }
    };

    const handlePrintQR = () => {
        const qrData = `Book ID: ${book.id}\nTitle: ${book.title}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
        
        const printWindow = window.open('', '_blank', 'width=400,height=500');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print QR Code - ${book.title}</title>
                        <style>
                            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; margin: 0; text-align: center; }
                            img { width: 250px; height: 250px; margin-bottom: 20px; border: 10px solid white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                            button { padding: 10px 20px; font-size: 16px; cursor: pointer; background: #7c3aed; color: white; border: none; border-radius: 8px; font-weight: bold; }
                            @media print { button { display: none; } body { justify-content: flex-start; margin-top: 50px; } }
                        </style>
                    </head>
                    <body>
                        <h2 style="color: #1f2937; margin-bottom: 5px;">${book.title}</h2>
                        <p style="color: #6b7280; margin-top: 0; margin-bottom: 20px;">ID: ${book.id} | ISBN: ${book.isbn}</p>
                        <img src="${qrUrl}" alt="QR Code" onload="setTimeout(() => window.print(), 500)" />
                        <br/>
                        <button onclick="window.print()">Print QR Code</button>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <tr className="border-b border-gray-50 hover:bg-violet-50/30 transition-colors group">
            {/* Row Number */}
            <td className="px-4 py-3 text-gray-400 font-medium">{index}</td>

            {/* Book Details */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <img
                        src={book.best_cover || book.cover_image || "https://placehold.co/36x48?text=📚"}
                        alt={book.title}
                        loading="lazy"
                        className="w-9 h-12 object-cover rounded shadow-sm flex-shrink-0 bg-gray-100"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/36x48?text=📚";
                        }}
                    />
                    <div>
                        <p className="font-semibold text-gray-800 leading-tight">{book.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{book.isbn}</p>
                    </div>
                </div>
            </td>

            {/* Author */}
            <td className="hidden md:table-cell px-4 py-3 text-gray-600">{book.author}</td>

            {/* Category */}
            <td className="hidden sm:table-cell px-4 py-3">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${categoryColor}`}>
                    {book.category}
                </span>
            </td>

            {/* ISBN */}
            <td className="hidden lg:table-cell px-4 py-3 text-gray-500 font-mono text-xs">{book.isbn}</td>

            {/* Copies */}
            <td className="px-4 py-3 text-gray-700 font-medium">
                {book.available_copies} / {book.total_copies}
            </td>

            {/* Status */}
            <td className="hidden sm:table-cell px-4 py-3">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${statusStyles[status]}`}>
                    {status}
                </span>
            </td>

            {/* Added On */}
            <td className="hidden lg:table-cell px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                {new Date(book.created_at).toLocaleDateString()}
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    {isAdminOrLibrarian ? (
                        <>
                            <button onClick={handlePrintQR} className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors" title="Print QR">
                                <QrCode size={15} />
                            </button>
                            <button onClick={() => onView(book)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-50 transition-colors" title="View">
                                <Eye size={15} />
                            </button>
                            <button onClick={() => onEdit(book)} className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-50 transition-colors" title="Edit">
                                <Pencil size={15} />
                            </button>
                            <button onClick={() => onDelete(book)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                                <Trash2 size={15} />
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleBorrow} 
                            className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors flex items-center gap-1 text-xs font-semibold" 
                            title="Borrow this book"
                        >
                            <LibraryBig size={15} />
                            Borrow
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}
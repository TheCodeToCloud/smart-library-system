import { useState, useMemo, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import { useAuth } from "../../data/useAuth";
import { useBooks } from "../../data/books";  // ← changed
import { useSearchParams } from "react-router-dom";
import BooksFilters from "./BooksFilters";
import BooksTable from "./BooksTable";
import BooksPagination from "./BooksPagination";
import BookModal from "./BookModal";

const ITEMS_PER_PAGE = 14;

export default function Books() {
    const { user } = useAuth();
    const { books, loading, error, refreshBooks } = useBooks();  // ← changed
    const [searchParams, setSearchParams] = useSearchParams();
    const categories = useMemo(() => {
        return ["All Categories", ...Array.from(new Set(books.map((b) => b.category)))];
    }, [books]);
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(searchParams.get("action") === "add");

    // Clear search params after reading action so it doesn't stick around unnecessarily
    useEffect(() => {
        if (searchParams.has("action")) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("action");
            // @ts-ignore
            setSearchParams(newParams);
        }
    }, [searchParams, setSearchParams]);

    // Sync search with URL param when it changes (e.g., nav search)
    useEffect(() => {
        const q = searchParams.get("q") || "";
        setSearch(q);
        setCurrentPage(1);
    }, [searchParams]);

    const filtered = useMemo(() => {
        return books.filter((b) => {
            const matchSearch =
                search === "" ||
                b.title.toLowerCase().includes(search.toLowerCase()) ||
                b.author.toLowerCase().includes(search.toLowerCase()) ||
                b.isbn.includes(search);
            const matchCat = selectedCategory === "All Categories" || b.category === selectedCategory;
            return matchSearch && matchCat;  // ← removed status filter (API has no status field)
        });
    }, [books, search, selectedCategory]);  // ← added books as dependency

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
    const handleCategory = (value: string) => { setSelectedCategory(value); setCurrentPage(1); };
    const handleStatus = (value: string) => { setSelectedStatus(value); setCurrentPage(1); };

    const handleExport = () => {
        if (filtered.length === 0) {
            alert("No books available to export.");
            return;
        }

        const headers = ["ID,Title,Author,Category,ISBN,Total Copies,Available Copies,Added On"];
        const rows = filtered.map(b => 
            `"${b.id}","${b.title.replace(/"/g, '""')}","${b.author.replace(/"/g, '""')}","${b.category}","${b.isbn}","${b.total_copies}","${b.available_copies}","${b.created_at}"`
        );
        const csvContent = headers.concat(rows).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `books_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <p className="p-6 text-gray-400">Loading books...</p>;
    if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

    return (
        <div className="p-6 min-h-screen font-sans">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-violet-600 tracking-tight">Books</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage and organize all library books</p>
                </div>
                <div className="flex gap-2">
                    {(user?.role === 'admin' || user?.role === 'librarian') && (
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                            <Plus size={16} />
                            Add New Book
                        </button>
                    )}
                    <button onClick={handleExport} className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <BooksFilters
                    search={search}
                    onSearch={handleSearch}
                    selectedCategory={selectedCategory}
                    onCategory={handleCategory}
                    selectedStatus={selectedStatus}
                    onStatus={handleStatus}
                    categories={categories}   // ← add this line
                />
                <BooksTable
                    books={paginated}
                    currentPage={currentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
                <BooksPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>
            
            <BookModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={refreshBooks} 
            />
        </div>
    );
}
import { useEffect, useState } from "react";
import api from "./api";


export type Book = {
    id: number;
    title: string;
    author: string;
    category: string;
    isbn: string;
    total_copies: number;
    available_copies: number;
    cover_image: string;
    created_at: string;
    qr_code: string;
    // Keep these for UI compatibility
    categoryColor?: string;
    status?: "Available" | "Issued" | "Overdue";
};

export function useBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = () => {
        setLoading(true);
        api.get("/api/books/")
            .then((res) => setBooks(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return { books, loading, error, refreshBooks: fetchBooks };
}

export const booksStats = [
    { id: 1, title: "Total Books", value: 500, par: "+12 this month", col: "bg-blue-100", img: "../books3.svg" },
    { id: 2, title: "Available Books", value: 432, par: "+8 this month", col: "bg-green-100", img: "../books3.svg" },
    { id: 3, title: "Issued Books", value: 450, par: "+12 this month", col: "bg-orange-100", img: "../book2.svg" },
    { id: 4, title: "Overdue Books", value: 2, par: "+8 this month", col: "bg-red-100", img: "../overdue.svg" },
];

export default api;  // ← add this line at the very bottom
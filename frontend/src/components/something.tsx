import axios from "axios";
import { useState, useEffect } from "react";

type Book = {
    id: number;
    title: string;
    author: string;
    category: string;
    isbn: string;
    total_copies: number;
    available_copies: number;
    cover_image: string;
    created_at: string;
};

export default function Something() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("https://dumpster-dragonfly-gratitude.ngrok-free.dev/api/books/", {
                headers: {
                    "ngrok-skip-browser-warning": "true",  // 👈 Add this
                },
            })
            .then((res) => {
                console.log(res.data);
                setBooks(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Books</h1>

            {books.map((book) => (
                <div key={book.id}>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>{book.category}</p>
                </div>
            ))}
        </div>
    );
}
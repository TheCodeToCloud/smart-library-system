import type { Book } from "../../data/books";
import BookRow from "./BookRow";

type Props = {
    books: Book[];
    currentPage: number;
    itemsPerPage: number;
};

export default function BooksTable({ books, currentPage, itemsPerPage }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                        <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3 w-8">#</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Book Details</th>
                        <th className="hidden md:table-cell text-left text-xs font-semibold text-gray-400 px-4 py-3">Author</th>
                        <th className="hidden sm:table-cell text-left text-xs font-semibold text-gray-400 px-4 py-3">Category</th>
                        <th className="hidden lg:table-cell text-left text-xs font-semibold text-gray-400 px-4 py-3">ISBN</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Copies</th>
                        <th className="hidden sm:table-cell text-left text-xs font-semibold text-gray-400 px-4 py-3">Status</th>
                        <th className="hidden lg:table-cell text-left text-xs font-semibold text-gray-400 px-4 py-3">Added On</th>
                        <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center text-gray-400 py-12 text-sm">
                                No books found.
                            </td>
                        </tr>
                    ) : (
                        books.map((book, idx) => (
                            <BookRow
                                key={book.id}
                                book={book}
                                index={(currentPage - 1) * itemsPerPage + idx + 1}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
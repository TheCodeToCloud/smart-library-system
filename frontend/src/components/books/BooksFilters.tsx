import { Search, Filter } from "lucide-react";
// ← removed: import { books } from "../../data/books";

const statuses = ["All Status", "Available", "Issued", "Overdue"];

type Props = {
    search: string;
    onSearch: (value: string) => void;
    selectedCategory: string;
    onCategory: (value: string) => void;
    selectedStatus: string;
    onStatus: (value: string) => void;
    categories: string[];  // ← added: receive from parent
};

export default function BooksFilters({
    search,
    onSearch,
    selectedCategory,
    onCategory,
    selectedStatus,
    onStatus,
    categories,  // ← added
}: Props) {
    return (
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search books by title, author or ISBN..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 bg-gray-50 placeholder:text-gray-400"
                />
            </div>

            <div className="ml-auto flex items-center gap-2 ">
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategory(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                >
                    {categories.map((c) => <option key={c}>{c}</option>)}
                </select>

                <select
                    value={selectedStatus}
                    onChange={(e) => onStatus(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                >
                    {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>

                <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                    <Filter size={14} />
                    Filters
                </button>
            </div>
        </div>
    );
}
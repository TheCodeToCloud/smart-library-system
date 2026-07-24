import { useState, useMemo, useEffect } from "react";
import { Plus, Download, FileText, Search, ExternalLink, Trash2 } from "lucide-react";
import { useAuth } from "../../data/useAuth";
import { useELibrary } from "../../data/elibrary";
import type { ELibraryResource } from "../../data/elibrary";
import { useSearchParams } from "react-router-dom";
import ConfirmModal from "../ConfirmModal";
import UploadResourceModal from "./UploadResourceModal";
import api from "../../data/api";
import { toast } from "react-toastify";

export default function ELibraryPage() {
    const { user } = useAuth();
    const { resources, loading, error, refreshResources } = useELibrary();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<ELibraryResource | null>(null);

    // Sync search with URL param
    useEffect(() => {
        const q = searchParams.get("q") || "";
        setSearch(q);
    }, [searchParams]);

    const categories = useMemo(() => {
        return ["All", ...Array.from(new Set(resources.map((r) => r.category)))];
    }, [resources]);

    const filtered = useMemo(() => {
        return resources.filter((r) => {
            const matchSearch =
                search === "" ||
                r.title.toLowerCase().includes(search.toLowerCase()) ||
                (r.author && r.author.toLowerCase().includes(search.toLowerCase()));
            const matchCat = selectedCategory === "All" || r.category === selectedCategory;
            return matchSearch && matchCat;
        });
    }, [resources, search, selectedCategory]);

    const handleDelete = async () => {
        if (!resourceToDelete) return;
        try {
            await api.delete(`/api/books/elibrary/${resourceToDelete.id}/`);
            toast.success("Resource deleted successfully!");
            refreshResources();
        } catch (e: any) {
            toast.error(e.response?.data?.error || "Failed to delete resource.");
        } finally {
            setIsConfirmOpen(false);
            setResourceToDelete(null);
        }
    };

    if (loading) return <p className="p-5 text-gray-400">Loading E-Library...</p>;
    if (error) return <p className="p-5 text-red-400">Error: {error}</p>;

    return (
        <div className="p-5 font-nav2">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-purple-600">E-Library</h1>
                    <p className="text-sm text-gray-400 mt-1">Browse and download digital study materials</p>
                </div>
                {user?.role !== "student" && (
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" /> Upload Resource
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                selectedCategory === cat 
                                ? "bg-purple-100 text-purple-700 border border-purple-200" 
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-gray-500 font-medium text-lg">No resources found</h3>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or category filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(resource => (
                        <div key={resource.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 flex gap-2">
                                <span className="bg-purple-50 text-purple-600 text-xs px-2.5 py-1 rounded-md font-medium border border-purple-100">
                                    {resource.category}
                                </span>
                                {user?.role !== "student" && (
                                    <button 
                                        onClick={() => {
                                            setResourceToDelete(resource);
                                            setIsConfirmOpen(true);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-red-600 p-1 rounded-md hover:bg-red-100 border border-red-100"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex-1 mt-6">
                                <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 pr-14">{resource.title}</h3>
                                {resource.author && <p className="text-sm text-gray-500 font-medium mb-3">{resource.author}</p>}
                                
                                <div className="text-xs text-gray-400 flex flex-col gap-1 mt-4">
                                    <span>Added by: {resource.uploaded_by_name}</span>
                                    <span>Date: {new Date(resource.uploaded_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-50 flex gap-2">
                                {(resource.has_file || resource.file_url) ? (
                                    <a 
                                        href={resource.has_file ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/books/elibrary/${resource.id}/download/` : resource.file_url!} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-xl text-sm font-semibold transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Open / Read
                                    </a>
                                ) : (
                                    <button disabled className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-400 py-2 rounded-xl text-sm font-semibold cursor-not-allowed">
                                        No file attached
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <UploadResourceModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                onSuccess={refreshResources} 
            />
            
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message={`Are you sure you want to delete "${resourceToDelete?.title}"?`}
                onConfirm={handleDelete}
                onCancel={() => {
                    setIsConfirmOpen(false);
                    setResourceToDelete(null);
                }}
            />
        </div>
    );
}

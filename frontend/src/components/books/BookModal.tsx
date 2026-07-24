import React, { useState, useRef } from "react";
import { Upload, Link, X } from "lucide-react";
import api from "../../data/api";

import type { Book } from "../../data/books";

type BookModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode?: "add" | "edit" | "view";
    initialData?: Book | null;
};

export default function BookModal({ isOpen, onClose, onSuccess, mode = "add", initialData }: BookModalProps) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [isbn, setIsbn] = useState("");
    const [totalCopies, setTotalCopies] = useState(1);
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isViewOnly = mode === "view";

    React.useEffect(() => {
        if (isOpen && initialData && (mode === "edit" || mode === "view")) {
            setTitle(initialData.title || "");
            setAuthor(initialData.author || "");
            setCategory(initialData.category || "");
            setIsbn(initialData.isbn || "");
            setTotalCopies(initialData.total_copies || 1);
            setCoverImageUrl(initialData.cover_image || "");
            if (initialData.best_cover) {
                setImagePreview(initialData.best_cover);
                setImageMode(initialData.cover_image ? "url" : "upload");
            } else {
                setImagePreview(null);
            }
        } else if (isOpen && mode === "add") {
            // Reset for add
            setTitle(""); setAuthor(""); setCategory(""); setIsbn("");
            setTotalCopies(1);
            clearImage();
        }
    }, [isOpen, initialData, mode]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        setCoverImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setCoverImageFile(null);
        setImagePreview(null);
        setCoverImageUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        setTitle(""); setAuthor(""); setCategory(""); setIsbn("");
        setTotalCopies(1);
        clearImage(); setError(""); setLoading(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("author", author);
            formData.append("category", category);
            formData.append("isbn", isbn);
            formData.append("total_copies", String(totalCopies));
            // available_copies auto-set to total_copies for new books; backend keeps track on issue/return
            if (mode === "add") {
                formData.append("available_copies", String(totalCopies));
            }

            if (imageMode === "upload" && coverImageFile) {
                formData.append("cover_image_file", coverImageFile);
            } else if (imageMode === "url" && coverImageUrl) {
                formData.append("cover_image", coverImageUrl);
            }

            if (mode === "edit" && initialData) {
                await api.patch(`/api/books/${initialData.id}/`, formData);
            } else {
                await api.post("/api/books/", formData);
            }
            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || `Failed to ${mode} book`);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">
                        {mode === "add" ? "Add New Book" : mode === "edit" ? "Edit Book" : "Book Details"}
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Title + Author */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Title *</label>
                            <input type="text" required disabled={isViewOnly} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Book title" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Author *</label>
                            <input type="text" required disabled={isViewOnly} value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} placeholder="Author name" />
                        </div>
                    </div>

                    {/* Category + ISBN */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Category *</label>
                            <input type="text" required disabled={isViewOnly} list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="e.g. Fiction" />
                            <datalist id="category-options">
                                <option value="Fiction" />
                                <option value="Non-Fiction" />
                                <option value="Technology" />
                                <option value="Computer Science" />
                                <option value="Science" />
                                <option value="Mathematics" />
                                <option value="History" />
                                <option value="Biography" />
                                <option value="Self-Help" />
                                <option value="Finance" />
                                <option value="Literature" />
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">ISBN *</label>
                            <input type="text" required disabled={isViewOnly} value={isbn} onChange={(e) => setIsbn(e.target.value)} className={inputClass} placeholder="978-..." />
                        </div>
                    </div>

                    {/* Copies - only Total Copies; available auto-set */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Copies *</label>
                        <input type="number" required disabled={isViewOnly} min="1" value={totalCopies} onChange={(e) => setTotalCopies(Number(e.target.value))} className={inputClass} />
                        {!isViewOnly && mode === "add" && (
                            <p className="text-xs text-gray-400 mt-1">Available copies will be set to total copies automatically.</p>
                        )}
                        {isViewOnly && (
                            <p className="text-xs text-gray-400 mt-1">Available: {(initialData as any)?.available_copies ?? totalCopies}</p>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Cover Image (Optional)</label>
                            {/* Toggle */}
                            {!isViewOnly && (
                                <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs gap-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setImageMode("upload")}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${imageMode === "upload" ? "bg-white text-violet-600 shadow-sm" : "text-gray-500"}`}
                                    >
                                        <Upload size={12} /> Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode("url")}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${imageMode === "url" ? "bg-white text-violet-600 shadow-sm" : "text-gray-500"}`}
                                    >
                                        <Link size={12} /> URL
                                    </button>
                                </div>
                            )}
                        </div>

                        {imageMode === "upload" ? (
                            <div>
                                {imagePreview ? (
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 group">
                                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                        {!isViewOnly && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
                                                >
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className={`border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center gap-2 transition-all ${!isViewOnly ? 'cursor-pointer hover:border-violet-400 hover:bg-violet-50' : ''}`}
                                        onClick={() => !isViewOnly && fileInputRef.current?.click()}
                                        onDrop={(e) => !isViewOnly && handleDrop(e)}
                                        onDragOver={(e) => !isViewOnly && e.preventDefault()}
                                    >
                                        <Upload size={24} className="text-gray-400" />
                                        <p className="text-sm text-gray-500">
                                            {isViewOnly ? "No cover image" : <><span className="text-violet-600 font-medium">Click to upload</span> or drag & drop</>}
                                        </p>
                                        {!isViewOnly && <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>}
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isViewOnly} />
                            </div>
                        ) : (
                            <input
                                type="url"
                                disabled={isViewOnly}
                                value={coverImageUrl}
                                onChange={(e) => setCoverImageUrl(e.target.value)}
                                className={inputClass}
                                placeholder="https://example.com/book-cover.jpg"
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            {isViewOnly ? "Close" : "Cancel"}
                        </button>
                        {!isViewOnly && (
                            <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-sm">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {mode === "edit" ? "Saving..." : "Adding..."}
                                    </span>
                                ) : mode === "edit" ? "Save Changes" : "Add Book"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

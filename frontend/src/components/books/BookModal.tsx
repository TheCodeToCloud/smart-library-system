import React, { useState, useRef } from "react";
import { Upload, Link, X } from "lucide-react";
import api from "../../data/api";

type BookModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function BookModal({ isOpen, onClose, onSuccess }: BookModalProps) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [isbn, setIsbn] = useState("");
    const [totalCopies, setTotalCopies] = useState(1);
    const [availableCopies, setAvailableCopies] = useState(1);
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        setTotalCopies(1); setAvailableCopies(1);
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
            formData.append("available_copies", String(availableCopies));

            if (imageMode === "upload" && coverImageFile) {
                formData.append("cover_image_file", coverImageFile);
            } else if (imageMode === "url" && coverImageUrl) {
                formData.append("cover_image", coverImageUrl);
            }

            await api.post("/api/books/", formData);
            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to add book");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-gray-50";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Add New Book</h2>
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
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Book title" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Author *</label>
                            <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} placeholder="Author name" />
                        </div>
                    </div>

                    {/* Category + ISBN */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Category *</label>
                            <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="e.g. Fiction" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">ISBN *</label>
                            <input type="text" required value={isbn} onChange={(e) => setIsbn(e.target.value)} className={inputClass} placeholder="978-..." />
                        </div>
                    </div>

                    {/* Copies */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Copies *</label>
                            <input type="number" required min="1" value={totalCopies} onChange={(e) => setTotalCopies(Number(e.target.value))} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Available *</label>
                            <input type="number" required min="0" max={totalCopies} value={availableCopies} onChange={(e) => setAvailableCopies(Number(e.target.value))} className={inputClass} />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Cover Image (Optional)</label>
                            {/* Toggle */}
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
                        </div>

                        {imageMode === "upload" ? (
                            <div>
                                {imagePreview ? (
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 group">
                                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
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
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all"
                                        onClick={() => fileInputRef.current?.click()}
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <Upload size={24} className="text-gray-400" />
                                        <p className="text-sm text-gray-500">
                                            <span className="text-violet-600 font-medium">Click to upload</span> or drag & drop
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        ) : (
                            <input
                                type="url"
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
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-sm">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Adding...
                                </span>
                            ) : "Add Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { useState, useRef } from "react";
import { X, UploadCloud } from "lucide-react";
import api from "../../data/api";
import { toast } from "react-toastify";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function UploadResourceModal({ isOpen, onClose, onSuccess }: Props) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("Notes");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ["Notes", "Past Questions", "Syllabus", "Journal", "Other"];

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !category) {
            toast.error("Title and category are required.");
            return;
        }
        if (!file) {
            toast.error("Please upload a file.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("category", category);
        formData.append("resource_file", file);

        try {
            await api.post("/api/books/elibrary/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Resource uploaded successfully!");
            onSuccess();
            handleClose();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to upload resource.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setTitle("");
        setAuthor("");
        setCategory("Notes");
        setFile(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-nav2">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Resource</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all text-sm"
                            placeholder="E.g., Operating Systems Chapter 1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author / Publisher</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all text-sm"
                            placeholder="E.g., John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all text-sm"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/Doc) *</label>
                        <div 
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${file ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 bg-gray-50'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                            />
                            <UploadCloud className={`h-8 w-8 mx-auto mb-2 ${file ? 'text-purple-500' : 'text-gray-400'}`} />
                            <p className="text-sm font-medium text-gray-700">
                                {file ? file.name : "Click to select a file"}
                            </p>
                            {!file && <p className="text-xs text-gray-400 mt-1">PDF, DOC, PPT up to 10MB</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-purple-600 text-white font-semibold py-2.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Uploading..." : "Upload Resource"}
                    </button>
                </form>
            </div>
        </div>
    );
}

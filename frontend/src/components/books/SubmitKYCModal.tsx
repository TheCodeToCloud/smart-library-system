import { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle2, UserCheck } from "lucide-react";
import api from "../../data/api";
import { useAuth } from "../../data/useAuth";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function SubmitKYCModal({ isOpen, onClose }: Props) {
    const { fetchUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        roll_no: "",
        department: "",
        phone: "",
        address: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                roll_no: "",
                department: "",
                phone: "",
                address: "",
            });
            setFile(null);
            setPreview(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file) {
            toast.warning("Please upload your ID Card photo.");
            return;
        }

        setIsSubmitting(true);
        const data = new FormData();
        data.append("roll_no", formData.roll_no);
        data.append("department", formData.department);
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        data.append("id_proof", file);

        try {
            await api.post("/api/accounts/submit-kyc/", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            toast.success("Details submitted successfully! Please wait for admin approval.");
            await fetchUser();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to submit details");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                <UserCheck size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Submit Details</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        You need to submit your ID Card and details to get approval from the librarian before borrowing books.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Roll No *</label>
                                <input
                                    required
                                    name="roll_no"
                                    value={formData.roll_no}
                                    onChange={handleChange}
                                    placeholder="e.g. 101"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <select
                                    required
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="">Select Dept</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Civil">Civil</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Your phone number"
                                pattern="^\d{10}$"
                                title="Phone number must be exactly 10 digits"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <textarea
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Your full address"
                                rows={2}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>

                        {/* ID Card Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">College ID Card (Photo) *</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${preview ? 'border-purple-300 bg-purple-50/50' : 'border-gray-200 hover:border-purple-400 hover:bg-gray-50'}`}
                            >
                                {preview ? (
                                    <div className="relative w-full h-32 flex items-center justify-center">
                                        <img src={preview} alt="ID Preview" className="max-h-full max-w-full rounded shadow-sm object-contain" />
                                        <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                                            <CheckCircle2 size={16} className="text-green-500" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 font-medium">Click to upload ID Card</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit for Approval"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

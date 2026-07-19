import { useState } from "react";
import api from "../../data/api";

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddMemberModal({ isOpen, onClose, onSuccess }: AddMemberModalProps) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        role: "student",
        roll_no: "",
        department: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (form.role !== "student" && (key === "roll_no" || key === "department")) {
                    return; // Skip student-specific fields if not student
                }
                formData.append(key, value);
            });

            await api.post("/api/accounts/register/", formData);
            
            // Auto-approve KYC if the admin adds them directly? We can let the admin approve them manually later.
            // Wait, an admin adding a user could automatically approve them. 
            // But let's just stick to the standard flow and let the admin click "Approve" after.

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.data) {
                setError(Object.values(err.response.data).flat().join('\n'));
            } else {
                setError("Failed to add member.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]">
                
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Add New Member</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto p-5">
                    {error && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Role *</label>
                                <select name="role" value={form.role} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300">
                                    <option value="student">Student</option>
                                    <option value="librarian">Librarian</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Username *</label>
                                <input type="text" name="username" value={form.username} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
                                <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name *</label>
                                <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
                                <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
                                <input type="text" name="phone" value={form.phone} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Address *</label>
                                <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                            </div>
                            
                            {form.role === "student" && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Roll No *</label>
                                        <input type="text" name="roll_no" value={form.roll_no} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Department *</label>
                                        <select name="department" value={form.department} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-300">
                                            <option value="" disabled>Select</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Electrical Engineering">Electrical Engineering</option>
                                            <option value="Civil Engineering">Civil Engineering</option>
                                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                                            <option value="Business Administration">Business Administration</option>
                                            <option value="Information Technology">Information Technology</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
                    <button onClick={onClose} disabled={loading} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
                        Cancel
                    </button>
                    <button form="add-member-form" type="submit" disabled={loading} className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors">
                        {loading ? "Adding..." : "Add Member"}
                    </button>
                </div>

            </div>
        </div>
    );
}

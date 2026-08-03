import React, { useState } from "react";
import api from "../../data/api";
import { toast } from "react-toastify";
import { sendEmailJS } from "../../utils/emailjs";

export default function AddMemberModal({ isOpen, onClose, onAdded }: { isOpen: boolean, onClose: () => void, onAdded: () => void }) {
    const [busy, setBusy] = useState(false);
    
    // Form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);

        const payload = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: email.split("@")[0],
            phone: phone,
            department: department,
            roll_no: rollNo,
            password: password
        };

        try {
            await api.post("/api/accounts/admin-create-member/", payload);
            
            // Send welcome email via EmailJS using the existing template
            sendEmailJS(
                `${firstName} ${lastName}`,
                email,
                "Welcome to the Library System",
                `Your library account has been successfully created by the librarian! You are already verified and can start borrowing books immediately. \n\nYour Username: ${email}\nYour Password: ${password}`
            );

            toast.success("Member added and approved successfully! Welcome email sent.");
            onAdded();
            onClose();
        } catch (error: any) {
            console.error("Add member error:", error);
            const errData = error.response?.data;
            if (errData && typeof errData === 'object') {
                const firstError = Object.values(errData)[0];
                toast.error(Array.isArray(firstError) ? firstError[0] : String(firstError));
            } else {
                toast.error("Failed to add member.");
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800">Add New Member</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg">✕</button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">First Name</label>
                                <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Last Name</label>
                                <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email (Gmail Required)</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                                placeholder="student@gmail.com"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone (10 Digits)</label>
                                <input required type="text" minLength={10} maxLength={10} value={phone} onChange={e => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Roll Number</label>
                                <input required type="text" value={rollNo} onChange={e => setRollNo(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Department</label>
                                <input required type="text" value={department} onChange={e => setDepartment(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Initial Password</label>
                                <input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button type="button" onClick={onClose} disabled={busy}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={busy}
                                className="flex-1 py-2.5 bg-purple-600 text-white font-semibold rounded-xl text-sm hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                {busy ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                {busy ? "Adding..." : "Add & Verify Member"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

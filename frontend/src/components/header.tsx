import { Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/useAuth";
import api from "../data/api";
import { toast } from "react-toastify";

type NavProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
};

export default function Header({ isOpen, setIsOpen }: NavProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', phone: '' });
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();
    const { user, setUser, logout, fetchUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Notifications state
    const [notifications, setNotifications] = useState<any[]>([]);
    const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifs = () => {
            api.get("/api/dashboard/notifications/")
                .then(res => {
                    // Filter only overdue and low_stock as requested by user
                    const alerts = res.data.filter((n: any) => n.type === "overdue" || n.type === "low_stock");
                    setNotifications(alerts);
                })
                .catch(err => console.error("Failed to fetch notifications", err));
        };

        fetchNotifs();
        const timer = setInterval(fetchNotifs, 15000);
        return () => clearInterval(timer);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
            if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
                setNotiDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        setIsUploading(true);
        const formData = new FormData();
        formData.append("profile_picture", file);

        try {
            const res = await api.post("/api/accounts/profile-picture/", formData);
            const newImageUrl = res.data.profile_picture + "?t=" + new Date().getTime();
            if (user) {
                setUser({ ...user, profile_picture: newImageUrl });
            }
        } catch (err: any) {
            const backendError = err.response?.data?.error || err.message;
            toast.error(`Upload Failed: ${backendError}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await api.patch("/api/accounts/me/", editForm);
            setUser(res.data);
            setIsEditingProfile(false);
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            const backendError = err.response?.data?.error || err.response?.data?.phone?.[0] || "Update failed";
            toast.error(backendError);
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <Fragment>
            <header className="flex items-center w-full border-b-2 border-gray-200 shadow-sm pb-2 gap-2 px-2">
                {/* Menu toggle */}
                <div className="shrink-0">
                    <button onClick={() => setIsOpen(true)} className="cursor-pointer pl-2 mt-3">
                        <img src="bmenu.svg" alt="open menu" className="h-6 w-6" />
                    </button>
                </div>



                <div className="flex-1 sm:hidden" />

                {/* Right icons */}
                <div className="flex items-center justify-end gap-3 md:gap-5 ml-auto">
                    {/* Notification Bell */}
                    <div ref={notiRef} className="relative hidden sm:block mt-1">
                        <button 
                            className="cursor-pointer relative"
                            onClick={() => setNotiDropdownOpen(!notiDropdownOpen)}
                        >
                            <img src="../bnoti.svg" alt="notification-icon" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </button>

                        {notiDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                                <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                        {notifications.length} New
                                    </span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map((noti, index) => (
                                            <div 
                                                key={index} 
                                                className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition ${noti.type === 'overdue' ? 'bg-red-50/50' : noti.type === 'low_stock' ? 'bg-orange-50/50' : ''}`}
                                            >
                                                <div className="flex gap-3 items-start">
                                                    <div className="mt-0.5">
                                                        {noti.type === 'overdue' && <span className="text-red-500 text-lg">⚠️</span>}
                                                        {noti.type === 'low_stock' && <span className="text-orange-500 text-lg">📉</span>}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm ${noti.type === 'overdue' ? 'text-red-700 font-medium' : noti.type === 'low_stock' ? 'text-orange-700 font-medium' : 'text-gray-700'}`}>
                                                            {noti.message}
                                                        </p>
                                                        {noti.date && (
                                                            <span className="text-xs text-gray-400 block mt-1">
                                                                {new Date(noti.date).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <div
                            className="flex cursor-pointer mt-2 hover:bg-gray-50 duration-300 items-center gap-2 bg-white px-3 mr-2 py-2 rounded-xl shadow-sm border border-gray-100"
                            onClick={() => setDropdownOpen(prev => !prev)}
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full shrink-0 overflow-hidden relative border-2 border-green-500">
                                <img
                                    src={user?.profile_picture || "card.webp"}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="font-nav2 font-semibold hidden md:block capitalize text-gray-700">
                                {user?.full_name || user?.username || "User"}
                            </span>
                            {/* Chevron */}
                            <svg className={`w-4 h-4 text-gray-500 transition-transform hidden md:block ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-2 top-14 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                                {/* Profile info */}
                                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                    <p className="text-xs font-semibold text-gray-800 capitalize">{user?.full_name || user?.username}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>

                                {/* My Profile */}
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        setEditForm({
                                            first_name: user?.first_name || '',
                                            last_name: user?.last_name || '',
                                            phone: user?.phone || ''
                                        });
                                        setIsEditingProfile(false);
                                        setProfileModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                >
                                    <span>👤</span>
                                    My Profile
                                </button>

                                {/* Settings */}
                                {user?.role !== 'student' && (
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                    >
                                        <span>⚙️</span>
                                        Settings
                                    </button>
                                )}

                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <span>🚪</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ─── My Profile Modal ─── */}
            {profileModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-900">{isEditingProfile ? "Edit Profile" : "My Profile"}</h2>
                            <button onClick={() => setProfileModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        {/* Avatar + upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-24 h-24">
                                <img
                                    src={user?.profile_picture || "card.webp"}
                                    alt="profile"
                                    className={`w-24 h-24 rounded-full object-cover border-4 border-purple-200 ${isUploading ? "opacity-50" : ""}`}
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                {/* Camera overlay button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                                    title="Change profile picture"
                                >
                                    📷
                                </button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                            />

                            {isEditingProfile ? (
                                <form onSubmit={handleProfileSave} className="w-full flex flex-col gap-3 mt-2">
                                    <div>
                                        <label className="text-xs text-gray-500 font-semibold mb-1 block">First Name</label>
                                        <input
                                            type="text"
                                            value={editForm.first_name}
                                            onChange={e => setEditForm({...editForm, first_name: e.target.value})}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-semibold mb-1 block">Last Name</label>
                                        <input
                                            type="text"
                                            value={editForm.last_name}
                                            onChange={e => setEditForm({...editForm, last_name: e.target.value})}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-semibold mb-1 block">Phone Number</label>
                                        <input
                                            type="text"
                                            value={editForm.phone}
                                            onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                            pattern="^\d{10}$"
                                            title="Phone number must be exactly 10 digits"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(false)}
                                            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center w-full">
                                    <p className="font-bold text-gray-800 text-lg capitalize">{user?.full_name || user?.username}</p>
                                    <p className="text-sm text-gray-400">{user?.email}</p>
                                    {user?.phone && <p className="text-sm text-gray-500 mt-1">📞 {user.phone}</p>}
                                    <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">{user?.role}</span>
                                    
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm border border-gray-200"
                                    >
                                        ✏️ Edit Profile Details
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
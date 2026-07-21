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
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
    const { user, setUser, logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
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

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <Fragment>
            <header className="flex items-center w-full border-b-2 border-gray-200 shadow-sm pb-2 gap-2 px-2">
                {/* Menu toggle */}
                <div className="shrink-0">
                    {!isOpen && (
                        <button onClick={() => setIsOpen(true)} className="cursor-pointer pl-2 mt-3">
                            <img src="bmenu.svg" alt="open menu" className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Search bar */}
                <div className="hidden sm:flex flex-1 justify-center">
                    <div className="relative w-full max-w-xs md:max-w-sm">
                        <span
                            className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
                            onClick={() => { if (searchQuery.trim()) navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`); }}
                        >
                            <img src="search.svg" alt="search" className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search books, members...."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full px-4 py-2 pr-10 pl-5 rounded-xl border bg-white font-nav2 text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 sm:hidden" />

                {/* Right icons */}
                <div className="flex items-center justify-end gap-3 md:gap-5 ml-auto">
                    {/* Notification Bell */}
                    <button className="cursor-pointer hidden sm:block mt-1">
                        <img src="../bnoti.svg" alt="notification-icon" />
                    </button>

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
                                    onClick={() => { setDropdownOpen(false); setProfileModalOpen(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                >
                                    <span>👤</span>
                                    My Profile
                                </button>

                                {/* Settings */}
                                <button
                                    onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                >
                                    <span>⚙️</span>
                                    Settings
                                </button>

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
                            <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
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

                            <div className="text-center">
                                <p className="font-bold text-gray-800 text-lg capitalize">{user?.full_name || user?.username}</p>
                                <p className="text-sm text-gray-400">{user?.email}</p>
                                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">{user?.role}</span>
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full mt-2 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
                            >
                                {isUploading ? "Uploading..." : "📷 Change Profile Picture"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
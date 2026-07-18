import { Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/useAuth";
import api from "../data/api";


type NavProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => (void);
}
// import Nav from "./nav";

export default function Header({ isOpen, setIsOpen }: NavProps) {

    const [isShow, setIsShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { user, fetchUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            await api.post('/api/accounts/profile-picture/', formData);
            await fetchUser(); // refresh user info
        } catch (err) {
            console.error("Failed to upload profile picture", err);
            alert("Failed to upload profile picture.");
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

                {/* Search bar - hidden on very small screens */}
                <div className="hidden sm:flex flex-1 justify-center">
                    <div className="relative w-full max-w-xs md:max-w-sm">
                        <span className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2" onClick={() => { if (searchQuery.trim()) navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`); }}>
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

                {/* Col 3 - Right (buttons + profile) */}
                <div className="flex items-center justify-end gap-2 md:gap-6 ml-auto">
                    <button className="cursor-pointer hidden sm:block">
                        <img src="../bnoti.svg" alt="notification-icon" />
                    </button>
                    <div className="relative pt-1 hidden sm:block">
                        <button onClick={() => setIsShow(!isShow)} className="cursor-pointer rounded-full">
                            <img src="../qmarks.svg" alt="questionMark-icon" />
                        </button>
                        {isShow && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-100 text-center rounded-xl w-max max-w-48 absolute top-8 right-0 p-3 shadow-md border border-orange-200 text-orange-900 text-sm font-medium tracking-wide z-50">
                                <span className="text-purple-800 tracking-wide">This page is something cool and this is me yogesh</span>
                            </div>
                        )}
                    </div>
                    <div 
                        className="flex cursor-pointer mt-2 hover:bg-gray-50 duration-300 items-center gap-2 bg-white px-3 mr-2 py-2 rounded-xl shadow-sm border border-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                        title="Click to change profile picture"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleProfilePicChange}
                        />
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full shrink-0 overflow-hidden relative border-2 border-green-500">
                            <img 
                                src={user?.profile_picture || "card.webp"} 
                                alt="profile" 
                                className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`} 
                            />
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <span className="font-nav2 font-semibold hidden md:block capitalize text-gray-700">
                            {user?.full_name || user?.username || "User"}
                        </span>
                    </div>
                </div>
            </header>
        </Fragment>
    );
}
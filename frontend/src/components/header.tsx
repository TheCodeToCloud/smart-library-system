import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


type NavProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => (void);
}
// import Nav from "./nav";

export default function Header({ isOpen, setIsOpen }: NavProps) {

    const [isShow, setIsShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

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
                    <div className="flex cursor-pointer mt-2 hover:text-green-500 duration-[1.5s] items-center gap-2 bg-white px-3 mr-2 py-2 rounded-xl shadow-sm">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-200 rounded-full shrink-0">
                            <img src="card.webp" alt="profile-2" className="rounded-full" />
                        </div>
                        <span className="font-nav2 font-semibold hidden md:block">Librarian</span>
                    </div>
                </div>
            </header>
        </Fragment>
    );
}
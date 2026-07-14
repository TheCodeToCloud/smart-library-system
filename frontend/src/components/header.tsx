import { Fragment } from "react/jsx-runtime";
import { useState } from "react";


type NavProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => (void);
}
// import Nav from "./nav";

export default function Header({ isOpen, setIsOpen }: NavProps) {

    const [isShow, setIsShow] = useState(false);

    return (
        <Fragment>
            <header className="grid grid-cols-3 items-center w-full border-b-2 border-gray-200 shadow-sm pb-2">
                {/* Col 1 - Left (empty for now) */}
                {/* Col 1 - Left (menu toggle) */}
                {/* Col 1 - Left (menu toggle) */}
                <div>
                    {!isOpen && (
                        <button onClick={() => setIsOpen(true)} className="cursor-pointer pl-4 mt-3">
                            <img src="bmenu.svg" alt="open menu" className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Col 2 - Center (search bar) */}
                <div className="flex justify-center">
                    <div className="relative">
                        <span className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2">
                            <img src="search.svg" alt="search" className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search books, members...."
                            className="w-80 px-4 py-3 pr-10 pl-5 rounded-xl border bg-white font-nav2"
                        />
                    </div>
                </div>

                {/* Col 3 - Right (buttons + profile) */}
                <div className="flex items-center justify-end gap-8">
                    <button className="cursor-pointer">
                        <img src="../bnoti.svg" alt="notification-icon" />
                    </button>
                    <div className="relative pt-1">
                        <button onClick={() => setIsShow(!isShow)} className="cursor-pointer rounded-full">
                            <img src="../qmarks.svg" alt="questionMark-icon" />
                        </button>
                        {isShow && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-100 text-center rounded-xl w-max max-w-48 absolute top-8 right-0 p-3 shadow-md border border-orange-200 text-orange-900 text-sm font-medium tracking-wide">
                                <span className="text-purple-800 tracking-wide">This page is something cool and this is me yogesh</span>
                            </div>
                        )}
                    </div>
                    <div className="flex cursor-pointer mt-2 hover:text-green-500 duration-[1.5s] items-center gap-3 bg-white px-4 mr-5 py-2 rounded-xl shadow-sm">
                        <div className="w-10 h-10 bg-blue-200 rounded-full">
                            <img src="card.webp" alt="profile-2" />
                        </div>
                        <span className="font-nav2 font-semibold">Librarian</span>
                    </div>
                </div>
            </header>
        </Fragment>
    );
}
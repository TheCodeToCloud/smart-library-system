import { Link } from "react-router-dom";
import { BookOpen, Users, Clock, ChevronRight } from "lucide-react";
import { useAuth } from "../data/useAuth";

export default function Landing() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-blue-300 bg-[length:400%_400%] [animation:gradientShift_5s_ease_infinite] sub-font text-gray-800">
            {/* Navbar */}
            <nav className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-2 rounded-full shadow-xl/10">
                            <BookOpen className="text-white h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight head text-gray-900 bg-gradient-to-r from-indigo-700 to-pink-500 bg-clip-text text-transparent cursor-pointer">Uni_Library</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {user ? (
                            <Link to="/dashboard" className="text-xs sub-font sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-xs sub-font sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</Link>
                                <Link to="/register" className="text-xs sub-font sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md hover:shadow-lg">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-semibold mb-6 animate-fade-in-up whitespace-normal text-left sm:text-center leading-tight">
                        <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-700 sub-font shrink-0"></span>
                        Smart Library Management System
                    </div>
                    <h1 className="text-3xl sub-head1 sm:text-3xl md:text-3xl lg:text-6xl font-bold text-gray-700 tracking-tight mb-8 leading-tight break-words">
                        Manage your library <br className="hidden md:block" />
                        <span className="text-transparent head2 bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500 bg-[length:200%_auto] [animation:gradientShift_3s_ease_infinite] drop-shadow-sm">
                            Smarter & Faster
                        </span>
                    </h1>
                    <p className="text-md md:text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-semibold sub-head1 leading-relaxed">
                        A modern, digital platform to organize books, track issues and returns, manage members, and streamline library operations effortlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {user ? (
                            <Link to="/dashboard" className="flex items-center gap-2 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 px-8 py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto justify-center sub-head">
                                Go to Dashboard <ChevronRight className="h-5 w-5" />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="flex items-center gap-2 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 px-8 py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto justify-center">
                                    Join Now <ChevronRight className="h-5 w-5" />
                                </Link>
                                <Link to="/login" className="flex items-center gap-2 text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-8 py-3.5 rounded-2xl transition-all w-full sm:w-auto justify-center">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Hero's bottom curve — matches Features' solid background exactly */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg viewBox="0 0 1440 120" className="w-full h-16 md:h-24" preserveAspectRatio="none">
                        <path
                            d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z"
                            fill="#faf5ff"
                        />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 bg-purple-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-semibold mb-4 head2 text-gray-600">
                            Everything you need <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 sub-head font-bold underline">in one place</span>
                        </h2>
                        <p className="text-gray-500 text-md sub-font">Our system is designed to simplify library administration while providing a seamless experience for students and staff.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <BookOpen className="text-blue-600 h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Extensive Catalog</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">Easily search, filter, and discover books across multiple categories. Real-time availability tracking.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                                <Clock className="text-purple-600 h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Issue & Return</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">Automated tracking of borrowed books, due dates, and fine calculations for overdue returns.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="text-green-600 h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Member Management</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">Organize student and staff records securely. Review and approve digital details instantly.</p>
                        </div>
                    </div>
                </div>

                {/* curve divider at the bottom of Features, into Footer */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        viewBox="0 0 1440 120"
                        className="w-full h-16 md:h-24"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,64 C360,0 1080,120 1440,64 L1440,120 L0,120 Z"
                            fill="#111827"
                        />
                    </svg>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-12 text-center text-gray-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <BookOpen className="text-gray-500 h-5 w-5" />
                        <span className="font-bold text-lg text-gray-200">Uni_Library</span>
                    </div>
                    <p className="mb-6 max-w-md mx-auto">Modernizing academic libraries with smart digital solutions.</p>
                    <div className="border-t border-gray-800 pt-8 text-sm">
                        © {new Date().getFullYear()} Uni_Library Management System. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

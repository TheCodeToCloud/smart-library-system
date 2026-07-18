import { useAuth } from "../data/useAuth";
import { RecommendedBooks, TrendingBooks } from "./SmartInsights";

export default function Dashboard() {
    const { user } = useAuth();

    const displayName = user?.full_name || user?.username || "there";

    const subtitle =
        user?.role === "student"
            ? "Here's a summary of your library activity."
            : "Here's what's happening in the library today.";

    return (
        <div>
            {/* Welcome — only here, not in Header */}
            <div className="pl-8 py-2">
                <h1 className="text-3xl font-semibold font-nav2 text-fuchsia-600 pb-1">
                    Welcome, {displayName} ✌️
                </h1>
                <p className="font-nav2 font-semibold text-sm text-gray-500">{subtitle}</p>
            </div>

            {/* Smart insights section — role-aware */}
            {user?.role === "student" ? (
                <RecommendedBooks />
            ) : (
                <TrendingBooks />
            )}
        </div>
    );
}
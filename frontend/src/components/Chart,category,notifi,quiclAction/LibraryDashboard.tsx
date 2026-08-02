import IssueReturnCard from "./IssueReturnCard";
import CategoryCard from "./CategoryCard";
import RecentIssues from "../noti , quickAction ,recent issue/recentissue";
import QuickAction from "../noti , quickAction ,recent issue/quickAction";
import { useAuth } from "../../data/useAuth";

export default function LibraryDashboard() {
    const { user } = useAuth();
    return (
        <div className="p-2 sm:p-5 font-nav2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <IssueReturnCard />
                <CategoryCard />
            </div>
            <RecentIssues />
            {user?.role === 'librarian' && (
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-auto"><QuickAction /></div>
                </div>
            )}
        </div>
    );
}
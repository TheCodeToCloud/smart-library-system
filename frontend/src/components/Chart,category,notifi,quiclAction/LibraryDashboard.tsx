import IssueReturnCard from "./IssueReturnCard";
import CategoryCard from "./CategoryCard";
import RecentIssues from "../noti , quickAction ,recent issue/recentissue";
import QuickAction from "../noti , quickAction ,recent issue/quickAction";
import Notification from "../noti , quickAction ,recent issue/Notifications";
import { useAuth } from "../../data/useAuth";

export default function LibraryDashboard() {
    const { user } = useAuth();
    return (
        <div className="p-5 font-nav2 ">
            <div className="grid grid-cols-2 gap-4 w-full">  {/* add max-w-3xl */}
                <IssueReturnCard />
                <CategoryCard />
            </div>
            <RecentIssues />
            <div className="flex gap-5">
                {user?.role === 'librarian' && <QuickAction />}
                <Notification />
            </div>
        </div>
    );
}
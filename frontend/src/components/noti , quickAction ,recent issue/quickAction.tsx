import { Link } from "react-router-dom";
import { quickActions, studentQuickActions } from "../../data/quickAction";
import { useAuth } from "../../data/useAuth";

export default function QuickAction() {
    const { user } = useAuth();
    
    // Choose which actions to show based on role
    const actionsToShow = user?.role === "student" ? studentQuickActions : quickActions;

    return (
        <div className="bg-white rounded-2xl w-full md:max-w-sm shadow-sm p-3">
            <div className="relative flex items-center justify-center mb-4">
                <h2 className="font-semibold text-gray-800">Quick Actions</h2>
            </div>

            <div className={`grid gap-3 ${user?.role === 'student' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {actionsToShow.map(item => (
                    <Link to={item.path} key={item.id} className="flex flex-col items-center py-3 justify-center text-center gap-2 border rounded-xl p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                        <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                        <span className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
import { Link } from "react-router-dom";
import { quickActions } from "../../data/quickAction";

export default function QuickAction() {
    return (
        <div className="bg-white rounded-2xl max-w-sm shadow-sm p-3 mt-5">
            <div className="relative flex items-center justify-center mb-4">
                <h2 className="font-semibold text-gray-800">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {quickActions.map(item => (
                    <Link to={item.path} key={item.id} className="flex flex-col items-center py-3 justify-center gap-2 border rounded-xl p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                        <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                        <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
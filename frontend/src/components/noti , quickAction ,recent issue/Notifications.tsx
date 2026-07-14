import { notifications } from "../../data/notification";

export default function Notification() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-3 mt-2 w-full">

            {/* yo chai center banau nu khojako vayana  */}
            {/* <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800 mb-4">Notifications</h2>
                <button className="text-xs cursor-pointer text-blue-500 hover:underline">View all</button>
            </div> */}

            {/* yo chai center ma hunxa H1 */}
            <div className="relative flex items-center justify-center mb-3">
                <h2 className="font-semibold text-gray-800">Notifications</h2>
                <button className="text-xs cursor-pointer text-blue-500 hover:underline absolute right-0">View all</button>
            </div>

            <div className="flex flex-col gap-3">
                {notifications.map(item => (
                    <div key={item.id} className={`flex items-center gap-3`}>
                        <div className={`${item.iconColor} h-9 w-9 items-center flex pl-1.5 rounded-lg`}>
                            <p className="">{item.icon}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold text-gray-800 truncate`}>{item.text}</p>
                            <p className="text-xs text-gray-600">{item.sub}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
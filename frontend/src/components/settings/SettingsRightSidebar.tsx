import { quickInfo } from "../../data/Settingsdata";

export default function SettingsRightSidebar() {
    return (
        <div className="w-full justify-center shrink-0 p-4 flex flex-rows gap-4 overflow-y-auto">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="font-semibold text-gray-800 text-sm mb-3">Quick Info</h2>
                <div className="flex flex-col gap-4 px-5">
                    {quickInfo.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-base">{item.icon}</span>
                                <span className="text-sm text-gray-600">{item.label}</span>
                            </div>
                            <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="font-semibold text-gray-800 text-sm mb-3">System Status</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-green-600">System Online</p>
                            <p className="text-xs text-gray-400">Everything is working properly</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">💾</span>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Last Backup</p>
                            <p className="text-xs text-gray-400">27 May 2026, 02:30 PM</p>
                            <p className="text-xs text-gray-400">Backup completed successfully</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

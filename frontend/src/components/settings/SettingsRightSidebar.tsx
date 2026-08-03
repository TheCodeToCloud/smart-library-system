import { useStats } from "../../data/statCard";

export default function SettingsRightSidebar() {
    const { stats, loading } = useStats();

    const getStat = (title: string) => stats.find(s => s.title === title)?.value || 0;

    const realQuickInfo = [
        { icon: "📘", label: "Total Books",   value: getStat("Total Books"), color: "text-purple-600" },
        { icon: "👤", label: "Total Members", value: getStat("Total Members"), color: "text-blue-600" },
        { icon: "📤", label: "Issued Books",  value: getStat("Books Issued"), color: "text-green-600" },
        { icon: "⏰", label: "Overdue Books", value: getStat("Overdue Books"), color: "text-red-500" },
    ];

    return (
        <div className="w-full justify-center shrink-0 p-4 flex flex-rows gap-4 overflow-y-auto">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="font-semibold text-gray-800 text-sm mb-3">Quick Info</h2>
                <div className="flex flex-col gap-4 px-5">
                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : (
                        realQuickInfo.map((item) => (
                            <div key={item.label} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{item.icon}</span>
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                </div>
                                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}

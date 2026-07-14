import { Settings2, Building2, Bell, HardDrive, Save } from "lucide-react";
import type {
    Tab, GeneralSettings, LibraryInfoSettings,
    NotificationSettings, BackupSettings
} from "../../data/Settingsdata";

// ── Reusable Toggle Switch ─────────────────────────────────
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle}
            className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? "bg-purple-600" : "bg-gray-200"}`}>
            <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );
}

// ── Tab Navigation ─────────────────────────────────────────
const tabs: { label: Tab; icon: React.ReactNode }[] = [
    { label: "General",       icon: <Settings2 size={16} /> },
    { label: "Library Info",  icon: <Building2 size={16} /> },
    { label: "Notifications", icon: <Bell size={16} /> },
    { label: "Backup",        icon: <HardDrive size={16} /> },
];

type PanelProps = {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    saved: boolean;
    onSave: () => void;
    general: GeneralSettings;
    setGeneral: (d: GeneralSettings) => void;
    libraryInfo: LibraryInfoSettings;
    setLibraryInfo: (d: LibraryInfoSettings) => void;
    notifications: NotificationSettings;
    setNotifications: (d: NotificationSettings) => void;
    backup: BackupSettings;
    setBackup: (d: BackupSettings) => void;
};

export default function SettingsPanel({
    activeTab, onTabChange, saved, onSave,
    general, setGeneral,
    libraryInfo, setLibraryInfo,
    notifications, setNotifications,
    backup, setBackup,
}: PanelProps) {
    return (
        <div className="flex gap-5">

            {/* Left Tab Nav */}
            <div className="w-52 shrink-0 flex flex-col gap-1">
                {tabs.map((tab) => (
                    <button key={tab.label} onClick={() => onTabChange(tab.label)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                            activeTab === tab.label
                                ? "bg-purple-100 text-purple-600"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}>
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Right Content Panel */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {/* Panel Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{activeTab} Settings</h2>
                        <p className="text-sm text-gray-400">Configure {activeTab.toLowerCase()} system preferences</p>
                    </div>
                    <button onClick={onSave}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors">
                        <Save size={15} />
                        {saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>

                {/* General Tab */}
                {activeTab === "General" && (
                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { label: "Library Name", key: "libraryName", type: "input", placeholder: "Library name" },
                            { label: "Library Code", key: "libraryCode", type: "input", placeholder: "e.g. CCL-2026" },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{f.label}</label>
                                <input value={general[f.key as keyof GeneralSettings]}
                                    onChange={(e) => setGeneral({ ...general, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200" />
                            </div>
                        ))}
                        {[
                            { label: "Default Language", key: "language",   options: ["English", "Nepali", "Hindi"] },
                            { label: "Timezone",         key: "timezone",   options: ["(GMT+05:30) Asia/Kolkata", "(GMT+05:45) Asia/Kathmandu", "(GMT+00:00) UTC"] },
                            { label: "Date Format",      key: "dateFormat", options: ["DD MMM YYYY (e.g. 27 May 2026)", "MM/DD/YYYY", "YYYY-MM-DD"] },
                            { label: "Currency",         key: "currency",   options: ["USD - US Dollar ($)", "NPR - Nepali Rupee (₨)", "INR - Indian Rupee (₹)"] },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{f.label}</label>
                                <select value={general[f.key as keyof GeneralSettings]}
                                    onChange={(e) => setGeneral({ ...general, [f.key]: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                                    {f.options.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                )}

                {/* Library Info Tab */}
                {activeTab === "Library Info" && (
                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { label: "Address",      key: "address",     placeholder: "Library address"   },
                            { label: "Phone",        key: "phone",       placeholder: "+977 ..."          },
                            { label: "Email",        key: "email",       placeholder: "library@email.com" },
                            { label: "Website",      key: "website",     placeholder: "https://..."       },
                            { label: "Established",  key: "established", placeholder: "Year established"  },
                            { label: "Total Floors", key: "totalFloors", placeholder: "Number of floors"  },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{f.label}</label>
                                <input value={libraryInfo[f.key as keyof LibraryInfoSettings]}
                                    onChange={(e) => setLibraryInfo({ ...libraryInfo, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "Notifications" && (
                    <div className="flex flex-col gap-5">
                        {[
                            { label: "Email on Book Issue",  key: "emailOnIssue"   },
                            { label: "Email on Book Return", key: "emailOnReturn"  },
                            { label: "Email on Overdue",     key: "emailOnOverdue" },
                            { label: "SMS on Overdue",       key: "smsOnOverdue"   },
                        ].map((f) => (
                            <div key={f.key} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                                <span className="text-sm font-medium text-gray-700">{f.label}</span>
                                <Toggle
                                    enabled={notifications[f.key as keyof NotificationSettings] as boolean}
                                    onToggle={() => setNotifications({ ...notifications, [f.key]: !notifications[f.key as keyof NotificationSettings] })}
                                />
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-5 mt-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Reminder Days Before Due</label>
                                <input type="number" value={notifications.reminderDaysBefore}
                                    onChange={(e) => setNotifications({ ...notifications, reminderDaysBefore: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Overdue Alert Frequency</label>
                                <select value={notifications.overdueAlertFrequency}
                                    onChange={(e) => setNotifications({ ...notifications, overdueAlertFrequency: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                                    {["Daily", "Weekly", "Monthly"].map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Backup Tab */}
                {activeTab === "Backup" && (
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Auto Backup</p>
                                <p className="text-xs text-gray-400">Automatically backup your data</p>
                            </div>
                            <Toggle enabled={backup.autoBackup} onToggle={() => setBackup({ ...backup, autoBackup: !backup.autoBackup })} />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Backup Frequency</label>
                                <select value={backup.backupFrequency}
                                    onChange={(e) => setBackup({ ...backup, backupFrequency: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                                    {["Daily", "Weekly", "Monthly"].map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Backup Location</label>
                                <select value={backup.backupLocation}
                                    onChange={(e) => setBackup({ ...backup, backupLocation: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                                    {["Cloud Storage", "Local Storage", "Both"].map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                            <span className="text-green-500 text-xl">✅</span>
                            <div>
                                <p className="text-sm font-semibold text-green-700">Last Backup</p>
                                <p className="text-xs text-green-600">{backup.lastBackup} — Backup completed successfully</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 border border-purple-200 text-purple-600 bg-purple-50 hover:bg-purple-100 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-fit">
                            <HardDrive size={15} />
                            Run Manual Backup Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

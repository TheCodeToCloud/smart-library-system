import { useState } from "react";
import type { Tab } from "../../data/Settingsdata";
import { defaultGeneral, defaultLibraryInfo, defaultNotifications, defaultBackup } from "../../data/Settingsdata";
import SettingsPanel from "./SettingsPanel";
import SettingsRightSidebar from "./SettingsRightSidebar";

export default function Settings() {
    const [activeTab, setActiveTab] = useState<Tab>("General");
    const [saved, setSaved] = useState(false);
    const [general, setGeneral] = useState(defaultGeneral);
    const [libraryInfo, setLibraryInfo] = useState(defaultLibraryInfo);
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [backup, setBackup] = useState(defaultBackup);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <div className="flex-1 p-6 overflow-auto">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-purple-600">Settings</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage your library system preferences</p>
                </div>

                {/* All tabs + content */}
                <SettingsPanel
                    activeTab={activeTab} onTabChange={setActiveTab}
                    saved={saved} onSave={handleSave}
                    general={general} setGeneral={setGeneral}
                    libraryInfo={libraryInfo} setLibraryInfo={setLibraryInfo}
                    notifications={notifications} setNotifications={setNotifications}
                    backup={backup} setBackup={setBackup}
                />
                {/* Right sidebar */}
                <SettingsRightSidebar />
            </div>

        </div>
    );
}

import { useState, useEffect } from "react";
import type { Tab } from "../../data/Settingsdata";
import { defaultGeneral, defaultLibraryInfo, defaultNotifications, defaultBackup } from "../../data/Settingsdata";
import { useSettings } from "../../data/settingsAPI";
import SettingsPanel from "./SettingsPanel";
import SettingsRightSidebar from "./SettingsRightSidebar";

export default function Settings() {
    const [activeTab, setActiveTab] = useState<Tab>("General");
    const [saved, setSaved] = useState(false);
    const [general, setGeneral] = useState(defaultGeneral);
    const [libraryInfo, setLibraryInfo] = useState(defaultLibraryInfo);
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [backup, setBackup] = useState(defaultBackup);

    const { data: serverSettings, loading, updateSettings } = useSettings();

    // Sync server data to local state
    useEffect(() => {
        if (serverSettings) {
            setGeneral({
                libraryName: serverSettings.library_name,
                libraryCode: serverSettings.library_code,
                language: serverSettings.language,
                timezone: serverSettings.timezone,
                dateFormat: serverSettings.date_format,
                currency: serverSettings.currency,
            });
            setLibraryInfo({
                address: serverSettings.address,
                phone: serverSettings.phone,
                email: serverSettings.email,
                website: serverSettings.website,
                established: serverSettings.established,
                totalFloors: serverSettings.total_floors,
            });
            setNotifications({
                emailOnIssue: serverSettings.email_on_issue,
                emailOnReturn: serverSettings.email_on_return,
                emailOnOverdue: serverSettings.email_on_overdue,
                smsOnOverdue: serverSettings.sms_on_overdue,
                reminderDaysBefore: serverSettings.reminder_days_before,
                overdueAlertFrequency: serverSettings.overdue_alert_frequency,
            });
            setBackup({
                autoBackup: serverSettings.auto_backup,
                backupFrequency: serverSettings.backup_frequency,
                lastBackup: serverSettings.last_backup,
                backupLocation: serverSettings.backup_location,
            });
        }
    }, [serverSettings]);

    const handleSave = async () => {
        const payload = {
            library_name: general.libraryName,
            library_code: general.libraryCode,
            language: general.language,
            timezone: general.timezone,
            date_format: general.dateFormat,
            currency: general.currency,
            
            address: libraryInfo.address,
            phone: libraryInfo.phone,
            email: libraryInfo.email,
            website: libraryInfo.website,
            established: libraryInfo.established,
            total_floors: libraryInfo.totalFloors,
            
            email_on_issue: notifications.emailOnIssue,
            email_on_return: notifications.emailOnReturn,
            email_on_overdue: notifications.emailOnOverdue,
            sms_on_overdue: notifications.smsOnOverdue,
            reminder_days_before: notifications.reminderDaysBefore,
            overdue_alert_frequency: notifications.overdueAlertFrequency,
            
            auto_backup: backup.autoBackup,
            backup_frequency: backup.backupFrequency,
            last_backup: backup.lastBackup,
            backup_location: backup.backupLocation,
        };

        try {
            await updateSettings(payload);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error("Failed to save settings", err);
            alert("Failed to save settings.");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading settings...</div>;

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

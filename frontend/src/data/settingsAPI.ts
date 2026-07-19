import { useState, useEffect, useCallback } from "react";
import api from "./api";
import { GeneralSettings, LibraryInfoSettings, NotificationSettings, BackupSettings } from "./Settingsdata";

// Unified interface representing the Django model
export interface SystemSettings {
    // General
    library_name: string;
    library_code: string;
    language: string;
    timezone: string;
    date_format: string;
    currency: string;
    // Library Info
    address: string;
    phone: string;
    email: string;
    website: string;
    established: string;
    total_floors: string;
    // Notifications
    email_on_issue: boolean;
    email_on_return: boolean;
    email_on_overdue: boolean;
    sms_on_overdue: boolean;
    reminder_days_before: string;
    overdue_alert_frequency: string;
    // Backup
    auto_backup: boolean;
    backup_frequency: string;
    last_backup: string;
    backup_location: string;
}

export function useSettings() {
    const [data, setData] = useState<SystemSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(() => {
        setLoading(true);
        setError(null);
        api.get("/api/dashboard/settings/")
            .then(res => setData(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const updateSettings = async (payload: Partial<SystemSettings>) => {
        const res = await api.put("/api/dashboard/settings/", payload);
        setData(res.data);
        return res.data;
    };

    return { data, loading, error, refresh: fetch, updateSettings };
}

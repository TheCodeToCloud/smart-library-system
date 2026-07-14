// All types and mock data for Settings page

export type Tab = "General" | "Library Info" | "Notifications" | "Backup";

export type GeneralSettings = {
    libraryName: string;
    libraryCode: string;
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
};

export type LibraryInfoSettings = {
    address: string;
    phone: string;
    email: string;
    website: string;
    established: string;
    totalFloors: string;
};

export type NotificationSettings = {
    emailOnIssue: boolean;
    emailOnReturn: boolean;
    emailOnOverdue: boolean;
    smsOnOverdue: boolean;
    reminderDaysBefore: string;
    overdueAlertFrequency: string;
};

export type BackupSettings = {
    autoBackup: boolean;
    backupFrequency: string;
    lastBackup: string;
    backupLocation: string;
};

export const defaultGeneral: GeneralSettings = {
    libraryName: "City Central Library",
    libraryCode: "CCL-2026",
    language: "English",
    timezone: "(GMT+05:30) Asia/Kolkata",
    dateFormat: "DD MMM YYYY (e.g. 27 May 2026)",
    currency: "USD - US Dollar ($)",
};

export const defaultLibraryInfo: LibraryInfoSettings = {
    address: "123 Library Street, Kathmandu",
    phone: "+977 9800000000",
    email: "library@uni.edu.np",
    website: "https://library.uni.edu.np",
    established: "2010",
    totalFloors: "3",
};

export const defaultNotifications: NotificationSettings = {
    emailOnIssue: true,
    emailOnReturn: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    reminderDaysBefore: "2",
    overdueAlertFrequency: "Daily",
};

export const defaultBackup: BackupSettings = {
    autoBackup: true,
    backupFrequency: "Weekly",
    lastBackup: "27 May 2026, 02:30 PM",
    backupLocation: "Cloud Storage",
};

export const quickInfo = [
    { icon: "📘", label: "Total Books",   value: "1,245", color: "text-purple-600" },
    { icon: "👤", label: "Total Members", value: "48",    color: "text-blue-600"   },
    { icon: "📤", label: "Issued Books",  value: "23",    color: "text-green-600"  },
    { icon: "⏰", label: "Overdue Books", value: "12",    color: "text-red-500"    },
];

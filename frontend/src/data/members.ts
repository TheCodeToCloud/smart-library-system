import { useEffect, useState } from "react";
import api from "./books";

export type Member = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    photo: string | null;
    kyc_status: string;
    created_at: string;
    department: string;
    roll_no: string;
    joined_at: string;
};

const avatarColors = [
    "bg-red-400", "bg-blue-400", "bg-green-400", "bg-orange-400",
    "bg-pink-400", "bg-teal-400", "bg-violet-400", "bg-amber-500",
    "bg-cyan-500", "bg-lime-400",
];

function getInitials(name: string): string {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function useMembers() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get("/api/members/")
            .then((res) => setMembers(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { members, loading, error };
}

// Helper to get avatar color per member
export function getAvatarColor(id: number): string {
    return avatarColors[id % avatarColors.length];
}

export function getInitialsFromName(name: string): string {
    return getInitials(name);
}

export const membershipOverview = [
    { id: 1, label: "Total Members", value: 48, color: "text-blue-500", bg: "bg-blue-100" },
    { id: 2, label: "Active Members", value: 42, color: "text-green-500", bg: "bg-green-100" },
    { id: 3, label: "Inactive Members", value: 6, color: "text-red-500", bg: "bg-red-100" },
    { id: 4, label: "New This Month", value: 8, color: "text-purple-500", bg: "bg-purple-100" },
];
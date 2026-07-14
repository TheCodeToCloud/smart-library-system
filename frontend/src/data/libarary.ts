import { useEffect, useState } from "react";
import api from "./books";

export const weeklyData = [
    { day: "Mon", Issued: 20, Returned: 10 },
    { day: "Tue", Issued: 30, Returned: 20 },
    { day: "Wed", Issued: 40, Returned: 30 },
    { day: "Thu", Issued: 55, Returned: 35 },
    { day: "Fri", Issued: 65, Returned: 45 },
    { day: "Sat", Issued: 75, Returned: 60 },
    { day: "Sun", Issued: 85, Returned: 80 },
];

const COLORS = [
    "#4B8EF1", "#34C98A", "#A855F7", "#EC4899",
    "#F59E0B", "#EF4444", "#10B981", "#6366F1",
    "#F97316", "#D1D5DB",
];

type CategoryItem = {
    label: string;
    pct: number;
    color: string;
};

type ApiCategory = {
    category: string;
    total: number;
};

export function useCategoryData() {
    const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/category-distribution/")
            .then((res) => {
                const data = res.data;

                // Calculate total
                const sum = data.reduce((acc: number, item: ApiCategory) => acc + item.total, 0);
                setTotal(sum);

                // Map to chart format
                const mapped = data.map((item: ApiCategory, i: number) => ({
                    label: item.category,
                    pct: Math.round((item.total / sum) * 100),
                    color: COLORS[i % COLORS.length],
                }));

                setCategoryData(mapped);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { categoryData, total, loading };
}
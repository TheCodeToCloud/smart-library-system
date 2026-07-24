import { useEffect, useState } from "react";
import api from "./books";

type WeeklyDataItem = {
    day: string;
    Issued: number;
    Returned: number;
};

export function useWeeklyData() {
    const [weeklyData, setWeeklyData] = useState<WeeklyDataItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/dashboard/issue-return-chart/")
            .then(res => setWeeklyData(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { weeklyData, loading };
}

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
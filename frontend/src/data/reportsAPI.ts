import { useState, useEffect, useCallback } from "react";
import api from "./api";

export interface ReportRecord {
    id: number;
    name: string;
    type: string;
    dateRange: string;
    generatedOn: string;
    generatedBy: string;
    status: string;
    file: string | null;
}

export function useReports() {
    const [data, setData] = useState<ReportRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(() => {
        setLoading(true);
        setError(null);
        api.get("/api/reports/")
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setData(res.data);
                } else {
                    setData([]);
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { data, loading, error, refresh: fetch };
}

export async function generateReport(params: {
    name: string;
    report_type: string;
    start_date: string;
    end_date: string;
}) {
    return api.post("/api/reports/generate/", params);
}

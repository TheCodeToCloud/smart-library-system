import { useEffect, useState, useCallback } from "react";
import api from "./api";
import { type IssueBookRecord } from "./circulation";

export type FineRecord = IssueBookRecord; // Fines are just IssueBook records with fine_amount > 0

function makeHook(endpoint: string) {
    return function useFinesHook() {
        const [data, setData] = useState<FineRecord[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        const fetch = useCallback(() => {
            setLoading(true);
            setError(null);
            api.get(endpoint)
                .then((res) => setData(res.data))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }, []);

        useEffect(() => { fetch(); }, [fetch]);

        return { data, loading, error, refresh: fetch };
    };
}

export const useFines = makeHook("/api/circulation/fines/");
export const useMyFines = makeHook("/api/circulation/my-fines/");

export async function payFine(issueId: number) {
    return api.post(`/api/circulation/pay-fine/${issueId}/`);
}

export async function waiveFine(issueId: number) {
    return api.post(`/api/circulation/waive-fine/${issueId}/`);
}

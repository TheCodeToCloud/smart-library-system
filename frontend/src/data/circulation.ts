import { useEffect, useState, useCallback } from "react";
import api from "./api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IssueBookRecord {
    id: number;
    book: {
        id: number;
        title: string;
        author: string;
    };
    member: {
        id: number;
        username: string;
        full_name: string;
        role: string;
        email: string;
    };
    request_date: string;
    issue_date: string | null;
    due_date: string | null;
    return_date: string | null;
    status: "pending" | "issued" | "returned" | "rejected";
    fine_amount: string;
    last_reminder_sent: string | null;
}


// ── Generic hook factory ───────────────────────────────────────────────────────

function makeHook(endpoint: string) {
    return function useIssueHook() {
        const [data, setData] = useState<IssueBookRecord[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        const fetch = useCallback(() => {
            setLoading(true);
            setError(null);
            api.get(endpoint)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setData(res.data);
                    } else {
                        console.error(`Expected array from ${endpoint} but got:`, res.data);
                        setData([]);
                    }
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }, []);

        useEffect(() => { fetch(); }, [fetch]);

        return { data, loading, error, refresh: fetch };
    };
}

// ── Named hooks ───────────────────────────────────────────────────────────────

/** Admin/Librarian: all currently issued books */
export const useIssuedBooks = makeHook("/api/circulation/issued/");

/** Admin/Librarian: borrow requests waiting for approval */
export const usePendingRequests = makeHook("/api/circulation/pending/");

/** Admin/Librarian: issued books past their due date */
export const useOverdueBooks = makeHook("/api/circulation/overdue/");

/** Student: their own borrow history */
export const useMyBorrowHistory = makeHook("/api/circulation/my-books/");

export function useRecommendations() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(() => {
        setLoading(true);
        api.get("/api/circulation/recommendations/")
            .then((res) => setData(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { data, loading, error, refresh: fetch };
}

// ── Action helpers ────────────────────────────────────────────────────────────

export async function approveRequest(issueId: number) {
    return api.post(`/api/circulation/approve/${issueId}/`);
}

export async function rejectRequest(issueId: number) {
    return api.post(`/api/circulation/reject/${issueId}/`);
}

export async function returnBook(issueId: number) {
    return api.post(`/api/circulation/return/${issueId}/`);
}

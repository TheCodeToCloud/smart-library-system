/**
 * This file is intentionally empty.
 * All circulation data is now fetched live from the API via
 * src/data/circulation.ts using the hooks:
 *   - useIssuedBooks()
 *   - usePendingRequests()
 *   - useOverdueBooks()
 *   - useMyBorrowHistory()
 *
 * The static mock arrays that used to live here (issues, issueSummary,
 * overdueBooks, recentReturns) have been removed as part of the real-data
 * wiring in Prompt 4.
 */
export {};
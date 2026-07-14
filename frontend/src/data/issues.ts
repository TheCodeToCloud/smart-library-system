export type Issue = {
    id: number;
    memberName: string;
    memberId: string;
    initials: string;
    avatarColor: string;
    book: string;
    bookAuthor: string;
    issueDate: string;
    dueDate: string;
    returnDate: string | null;
    status: "Issued" | "Returned" | "Overdue" | "Lost / Damaged";
    fine: string;
}

export const issues: Issue[] = [
    { id: 1, memberName: "Yogesh Rai", memberId: "M-0012", initials: "YR", avatarColor: "bg-yellow-400", book: "The Alchemist", bookAuthor: "Paulo Coelho", issueDate: "20 May, 2026", dueDate: "03 Jun, 2026", returnDate: null, status: "Issued", fine: "$0.00" },
    { id: 2, memberName: "Roshan Karki", memberId: "M-0008", initials: "RK", avatarColor: "bg-blue-500", book: "Atomic Habits", bookAuthor: "James Clear", issueDate: "18 May, 2026", dueDate: "01 Jun, 2026", returnDate: null, status: "Issued", fine: "$0.00" },
    { id: 3, memberName: "Aakil Gurung", memberId: "M-0015", initials: "AG", avatarColor: "bg-green-500", book: "Think and Grow Rich", bookAuthor: "Napoleon Hill", issueDate: "16 May, 2026", dueDate: "30 May, 2026", returnDate: "27 May, 2026", status: "Returned", fine: "$0.00" },
    { id: 4, memberName: "Suraj Pokhrel", memberId: "M-0011", initials: "SF", avatarColor: "bg-orange-400", book: "The Power of Habit", bookAuthor: "Charles Duhigg", issueDate: "15 May, 2026", dueDate: "29 May, 2026", returnDate: null, status: "Overdue", fine: "$1.50" },
    { id: 5, memberName: "Jessica Rai", memberId: "M-0016", initials: "JR", avatarColor: "bg-pink-400", book: "The Psychology of Money", bookAuthor: "Morgan Housel", issueDate: "14 May, 2026", dueDate: "28 May, 2026", returnDate: null, status: "Overdue", fine: "$2.00" },
    { id: 6, memberName: "Robert Brown", memberId: "M-0003", initials: "RB", avatarColor: "bg-red-500", book: "Rich Dad Poor Dad", bookAuthor: "Robert T. Kiyosaki", issueDate: "12 May, 2026", dueDate: "26 May, 2026", returnDate: "11 May, 2026", status: "Returned", fine: "$0.00" },
    { id: 7, memberName: "Lisa Wilson", memberId: "M-0006", initials: "LW", avatarColor: "bg-lime-400", book: "The 5 AM Club", bookAuthor: "Robin Sharma", issueDate: "10 May, 2026", dueDate: "24 May, 2026", returnDate: "24 May, 2026", status: "Returned", fine: "$0.00" },
    { id: 8, memberName: "Saurav Rai", memberId: "M-0009", initials: "SR", avatarColor: "bg-teal-400", book: "Deep Work", bookAuthor: "Cal Newport", issueDate: "09 May, 2026", dueDate: "23 May, 2026", returnDate: null, status: "Issued", fine: "$0.00" },
    { id: 9, memberName: "Anu Rai", memberId: "M-0010", initials: "AS", avatarColor: "bg-cyan-500", book: "The Subtle Art of Not Caring", bookAuthor: "Mark Manson", issueDate: "08 May, 2026", dueDate: "22 May, 2026", returnDate: null, status: "Issued", fine: "$0.00" },
    { id: 10, memberName: "Puspa Magar", memberId: "M-0013", initials: "PM", avatarColor: "bg-purple-400", book: "Ikigai", bookAuthor: "Héctor Garcia", issueDate: "07 May, 2026", dueDate: "21 May, 2026", returnDate: null, status: "Lost / Damaged", fine: "$15.00" },
];

export const issueSummary = [
    { id: 1, label: "Issued", value: 12, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 2, label: "Returned", value: 18, color: "text-green-600", bg: "bg-green-50" },
    { id: 3, label: "Overdue", value: 5, color: "text-red-600", bg: "bg-red-50" },
    { id: 4, label: "Lost / Damaged", value: 1, color: "text-orange-600", bg: "bg-orange-50" },
];

export const overdueBooks = [
    { id: 1, title: "The Power of Habit", author: "Charles Duhigg", due: "Due: 29 May, 2026", fine: "$1.50", fineColor: "text-red-500", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" },
    { id: 2, title: "The Psychology of Money", author: "Morgan Housel", due: "Due: 28 May, 2026", fine: "$2.00", fineColor: "text-red-500", img: "https://covers.openlibrary.org/b/id/10521270-M.jpg" },
    { id: 3, title: "Atomic Habits", author: "James Clear", due: "Due: 01 Jun, 2026", fine: "$0.50", fineColor: "text-red-500", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" },
];

export const recentReturns = [
    { id: 1, title: "Think and Grow Rich", author: "Napoleon Hill", returnDate: "27 May, 2026", img: "https://covers.openlibrary.org/b/id/7898836-M.jpg" },
    { id: 2, title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", returnDate: "11 May, 2026", img: "https://covers.openlibrary.org/b/id/8739161-M.jpg" },
    { id: 3, title: "The 5 AM Club", author: "Robin Sharma", returnDate: "24 May, 2026", img: "https://covers.openlibrary.org/b/id/10521270-M.jpg" },
];
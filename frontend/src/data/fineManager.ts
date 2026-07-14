export type Fine = {
    id: number;
    fineId: string;
    member: { name: string; email: string; initials: string; avatarColor: string };
    book: { title: string; author: string; img: string };
    fineType: "Overdue" | "Damaged" | "Lost";
    amount: number;
    status: "Unpaid" | "Paid" | "Partially Paid";
    issueDate: string;
    dueDate: string;
    daysOverdue: number;
    paidDate: string | null;
    paidAmount: number | null;
};

export const fines: Fine[] = [
    { id: 1,  fineId: "FNE-2026-0001", member: { name: "Sarah Anderson",  email: "sarah.anderson@email.com",  initials: "SA", avatarColor: "bg-red-400"    }, book: { title: "The Alchemist",            author: "Paulo Coelho",        img: "https://books.google.com/books/content?vid=ISBN9780062315007&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 2.50,  status: "Unpaid",         issueDate: "10 May 2026", dueDate: "17 May 2026", daysOverdue: 8,  paidDate: null,          paidAmount: null },
    { id: 2,  fineId: "FNE-2026-0002", member: { name: "Michael Johnson", email: "michael.johnson@email.com", initials: "MJ", avatarColor: "bg-blue-400"   }, book: { title: "Atomic Habits",            author: "James Clear",         img: "https://books.google.com/books/content?vid=ISBN9781847941831&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 1.50,  status: "Unpaid",         issueDate: "08 May 2026", dueDate: "15 May 2026", daysOverdue: 10, paidDate: null,          paidAmount: null },
    { id: 3,  fineId: "FNE-2026-0003", member: { name: "Emily Williams",  email: "emily.williams@email.com",  initials: "EW", avatarColor: "bg-yellow-500" }, book: { title: "Think and Grow Rich",      author: "Napoleon Hill",       img: "https://books.google.com/books/content?vid=ISBN9781640951287&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 2.00,  status: "Partially Paid", issueDate: "06 May 2026", dueDate: "13 May 2026", daysOverdue: 12, paidDate: "20 May 2026", paidAmount: 1.00 },
    { id: 4,  fineId: "FNE-2026-0004", member: { name: "David Garcia",    email: "david.garcia@email.com",    initials: "DG", avatarColor: "bg-green-400"  }, book: { title: "The Power of Habit",       author: "Charles Duhigg",      img: "https://books.google.com/books/content?vid=ISBN9780812981605&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 1.50,  status: "Paid",           issueDate: "05 May 2026", dueDate: "12 May 2026", daysOverdue: 13, paidDate: "14 May 2026", paidAmount: 1.50 },
    { id: 5,  fineId: "FNE-2026-0005", member: { name: "Jessica Smith",   email: "jessica.smith@email.com",   initials: "JS", avatarColor: "bg-purple-400" }, book: { title: "The Psychology of Money",  author: "Morgan Housel",       img: "https://books.google.com/books/content?vid=ISBN9780857197689&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 2.50,  status: "Unpaid",         issueDate: "04 May 2026", dueDate: "11 May 2026", daysOverdue: 14, paidDate: null,          paidAmount: null },
    { id: 6,  fineId: "FNE-2026-0006", member: { name: "Robert Brown",    email: "robert.brown@email.com",    initials: "RB", avatarColor: "bg-red-500"    }, book: { title: "Rich Dad Poor Dad",        author: "Robert T. Kiyosaki",  img: "https://books.google.com/books/content?vid=ISBN9781612680194&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 1.00,  status: "Paid",           issueDate: "03 May 2026", dueDate: "10 May 2026", daysOverdue: 15, paidDate: "11 May 2026", paidAmount: 1.00 },
    { id: 7,  fineId: "FNE-2026-0007", member: { name: "Lisa Wilson",     email: "lisa.wilson@email.com",     initials: "LW", avatarColor: "bg-lime-400"   }, book: { title: "Digital Design",           author: "M. Morris Mano",      img: "https://books.google.com/books/content?vid=ISBN9789332518745&printsec=frontcover&img=1&zoom=1" }, fineType: "Damaged", amount: 5.00,  status: "Unpaid",         issueDate: "02 May 2026", dueDate: "—",           daysOverdue: 0,  paidDate: null,          paidAmount: null },
    { id: 8,  fineId: "FNE-2026-0008", member: { name: "James OConnor",   email: "james.oconnor@email.com",   initials: "JO", avatarColor: "bg-orange-400" }, book: { title: "Operating System Concepts", author: "Galvin, Gagne",       img: "https://books.google.com/books/content?vid=ISBN9789353509242&printsec=frontcover&img=1&zoom=1" }, fineType: "Lost",    amount: 15.00, status: "Partially Paid", issueDate: "01 May 2026", dueDate: "—",           daysOverdue: 0,  paidDate: "18 May 2026", paidAmount: 5.00 },
    { id: 9,  fineId: "FNE-2026-0009", member: { name: "Amanda Martinez", email: "amanda.martinez@email.com", initials: "AM", avatarColor: "bg-teal-400"   }, book: { title: "Engineering Mathematics",   author: "B.S. Grewal",         img: "https://books.google.com/books/content?vid=ISBN9788173719557&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 1.50,  status: "Unpaid",         issueDate: "30 Apr 2026", dueDate: "07 May 2026", daysOverdue: 18, paidDate: null,          paidAmount: null },
    { id: 10, fineId: "FNE-2026-0010", member: { name: "Daniel Lee",      email: "daniel.lee@email.com",      initials: "DL", avatarColor: "bg-cyan-500"   }, book: { title: "Database System Concepts",  author: "Abraham Silberschatz", img: "https://books.google.com/books/content?vid=ISBN9780078022159&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 2.50,  status: "Paid",           issueDate: "28 Apr 2026", dueDate: "05 May 2026", daysOverdue: 20, paidDate: "06 May 2026", paidAmount: 2.50 },
    { id: 11, fineId: "FNE-2026-0011", member: { name: "Sophia Clark",    email: "sophia.clark@email.com",    initials: "SC", avatarColor: "bg-violet-400" }, book: { title: "Clean Code",               author: "Robert C. Martin",    img: "https://books.google.com/books/content?vid=ISBN9780132350884&printsec=frontcover&img=1&zoom=1" }, fineType: "Overdue", amount: 3.00,  status: "Unpaid",         issueDate: "25 Apr 2026", dueDate: "02 May 2026", daysOverdue: 22, paidDate: null,          paidAmount: null },
    { id: 12, fineId: "FNE-2026-0012", member: { name: "Liam Harris",     email: "liam.harris@email.com",     initials: "LH", avatarColor: "bg-amber-500"  }, book: { title: "Computer Networks",        author: "Andrew S. Tanenbaum", img: "https://books.google.com/books/content?vid=ISBN9780132126953&printsec=frontcover&img=1&zoom=1" }, fineType: "Damaged", amount: 8.00,  status: "Paid",           issueDate: "22 Apr 2026", dueDate: "—",           daysOverdue: 0,  paidDate: "01 May 2026", paidAmount: 8.00 },
];

export const fineOverview = [
    { id: 1, label: "Total Fines",    value: "$87.50", icon: "💰", iconBg: "bg-purple-100" },
    { id: 2, label: "Unpaid Fines",   value: "$42.50", icon: "❌", iconBg: "bg-red-100"    },
    { id: 3, label: "Partially Paid", value: "$6.00",  icon: "⚡", iconBg: "bg-orange-100" },
    { id: 4, label: "Paid Fines",     value: "$39.00", icon: "✅", iconBg: "bg-green-100"  },
];

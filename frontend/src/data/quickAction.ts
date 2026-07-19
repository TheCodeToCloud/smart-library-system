export const quickActions = [
    { id: 1, label: "Add New Book", icon: "📚", color: "text-blue-500", path: "/books" },
    { id: 2, label: "Add New Member", icon: "👥", color: "text-green-500", path: "/members" },
    { id: 3, label: "Issue Book", icon: "📤", color: "text-purple-500", path: "/issue-return" },
    { id: 4, label: "Return Book", icon: "📥", color: "text-orange-500", path: "/issue-return" },
];

export const notifications = [
    { id: 1, text: "86 books are overdue", sub: "Please collect overdue books", time: "10m ago", color: "bg-red-100" },
    { id: 2, text: "New member registration", sub: "5 new members joined today", time: "1h ago", color: "bg-yellow-100" },
    { id: 3, text: "Database backup completed", sub: "Library database backup was successful", time: "3h ago", color: "bg-blue-100" },
]
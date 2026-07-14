export type Issue = {
    id: number;
    title: string;
    author: string;
    issuedTo: string;
    studentId: string;
    date: string;
    due: string;
    dueColor: string;
    img: string;
};

export const recentIssues : Issue[] = [
    {
        id:1,
        title: "Database System Concepts",
        author: "Abraham Silberschatz",
        issuedTo: "Rahul Verma",
        studentId: "CS/2023/45",
        date: "20 May 2024",
        due: "Due in 7 days",
        dueColor: "text-orange-500",
        img: "https://books.google.com/books/content?vid=ISBN9780078022159&printsec=frontcover&img=1&zoom=1"
    },
    {
        id: 2,
        title: "Engineering Mathematics",
        author: "B.S. Grewal",
        issuedTo: "Priya Sharma",
        studentId: "CE/2023/12",
        date: "19 May 2024",
        due: "Due in 6 days",
        dueColor: "text-orange-500",
        img: "https://books.google.com/books/content?vid=ISBN9788173719557&printsec=frontcover&img=1&zoom=1"
    },
    {
        id: 3,
        title: "Operating System Concepts",
        author: "Galvin, Gagne",
        issuedTo: "Arjun Mehta",
        studentId: "IT/2023/31",
        date: "18 May 2024",
        due: "Due in 5 days",
        dueColor: "text-orange-500",
        img: "https://books.google.com/books/content?vid=ISBN9789353509242&printsec=frontcover&img=1&zoom=1"
    },
    {
        id: 4,
        title: "Digital Design",
        author: "M. Morris Mano",
        issuedTo: "Neha Gupta",
        studentId: "EC/2023/22",
        date: "17 May 2024",
        due: "Due in 4 days",
        dueColor: "text-orange-500",
        img: "https://covers.openlibrary.org/b/id/7898836-M.jpg"
    }
]
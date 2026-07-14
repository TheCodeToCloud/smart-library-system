// pages/ReportsPage.tsx
import { useState } from "react";
import Reports from "../reports/reports";

export default function ReportsPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedStatus, setSelectedStatus] = useState("All Status");

    const categories = ["All Categories", "Members", "Books", "Finance"]; // your real list

    return (
        <Reports
            search={search}
            onSearch={setSearch}
            selectedCategory={selectedCategory}
            onCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatus={setSelectedStatus}
            categories={categories}
        />
    );
}
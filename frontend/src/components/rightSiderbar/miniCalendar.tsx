import { useState } from "react";

export default function MiniCalendar() {

    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString("default", { month: "long" });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayDate = today.getDate();


    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear() , currentDate.getMonth() + 1))
    };
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear() , currentDate.getMonth() - 1));
    };


    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return (
        <>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800">{monthName} {year}</h2>
                    <div className="flex gap-2 text-gray-400">
                        <button onClick = {prevMonth} className="hover:text-gray-700 cursor-pointer">‹</button>
                        <button onClick = {nextMonth} className="hover:text-gray-700 cursor-pointer">›</button>
                    </div>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <span key={d}>{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 text-center text-sm gap-y-1">
                    {days.map((day, i) => (
                        <span
                            key={i}
                            className={`py-1 rounded-full w-7 h-7 flex items-center justify-center mx-auto text-xs
                            ${day === todayDate ? "bg-orange-500 text-white font-bold" : "text-gray-700 hover:bg-gray-100 cursor-pointer"}
                            ${!day ? "invisible" : ""}
                        `}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}
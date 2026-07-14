import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { weeklyData } from "../../data/libarary";
import CustomTooltip from "./CustomTooltip";

export default function IssueReturnCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex-1 min-w-0 shadow">
        {/*                                                              👆 p-6 → p-4 */}
            <h2 className="text-base font-semibold text-gray-700 mb-2">
            {/*   👆 text-base → text-sm          👆 mb-4 → mb-2 */}
                Issue / Return Overview
            </h2>
            <ResponsiveContainer width="100%" height={200}>
            {/*                                        👆 160 → 130 */}
                <LineChart data={weeklyData} margin={{ top: 4, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} />
                    {/*                                              👆 12 → 10 */}
                    <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 220]} ticks={[0, 50, 100, 150, 200]} />
                    {/*                              👆 12 → 10 */}
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="top"
                        align="left"
                        iconSize={0}
                        wrapperStyle={{ paddingBottom: 6, paddingLeft: 40, fontSize: 11, color: "#6B7280" }}
                        formatter={(value, entry) => (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                                <span style={{
                                    display: "inline-block",
                                    width: 10,
                                    height: 5,       // 👈 6 → 5
                                    borderRadius: 4,
                                    backgroundColor: entry.color,
                                }} />
                                {value}
                            </span>
                        )}
                    />
                    <Line type="monotone" dataKey="Issued"   stroke="#4B8EF1" strokeWidth={2} dot={{ r: 2, fill: "#4B8EF1",  strokeWidth: 0 }} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Returned" stroke="#34C98A" strokeWidth={2} dot={{ r: 2, fill: "#34C98A", strokeWidth: 0 }} activeDot={{ r: 4 }} />
                    {/*                                               👆 2.5→2       👆 r:3→2                                                          👆 r:5→4 */}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}


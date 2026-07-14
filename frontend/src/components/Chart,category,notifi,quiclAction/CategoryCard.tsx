import { useCategoryData } from "../../data/libarary";  // ← changed
import { buildArcs } from "../../utils/buildArcs";

type Arc = {
    label: string;
    pct: number;
    color: string;
    d: string;
};

export default function CategoryCard() {
    const { categoryData, total, loading } = useCategoryData();  // ← changed
    const cx = 90, cy = 90, r = 70, innerR = 44;
    const arcs = buildArcs(categoryData, cx, cy, r);

    if (loading) return <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex-1 min-w-0">
        <p className="text-gray-400 text-sm">Loading...</p>
    </div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-700 mb-2">
                Category Distribution
            </h2>
            <div className="flex items-center justify-center gap-6">
                <div className="flex-shrink-0">
                    <svg width={180} height={180} viewBox="0 0 180 180">
                        {arcs.map((arc: Arc) => (
                            <path key={arc.label} d={arc.d} fill="none"
                                stroke={arc.color} strokeWidth={r - innerR} strokeLinecap="butt" />
                        ))}
                        <text x={cx} y={cy - 8} textAnchor="middle"
                            style={{ fontSize: 20, fontWeight: 700, fill: "#1F2937" }}>
                            {total.toLocaleString()}  {/* ← changed TOTAL to total */}
                        </text>
                        <text x={cx} y={cy + 10} textAnchor="middle"
                            style={{ fontSize: 11, fill: "#9CA3AF" }}>
                            Total
                        </text>
                    </svg>
                </div>

                <ul className="flex flex-col gap-2">
                    {categoryData.map((c) => (
                        <li key={c.label} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: c.color }} />
                            <span className="w-20">{c.label}</span>
                            <span className="font-semibold text-gray-700">{c.pct}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
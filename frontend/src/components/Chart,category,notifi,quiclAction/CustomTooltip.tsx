// components/CustomTooltip.tsx

type PayloadItem = {
    name: string;
    value: number;
    color: string;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: PayloadItem[];
    label?: string;
};

export default function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2 text-sm">
            <p className="font-semibold text-gray-500 mb-1">{label}</p>
            {payload.map((p: PayloadItem) => (
                <p key={p.name} style={{ color: p.color }} className="font-medium">
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
}
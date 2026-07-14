// Remove the import, use a generic type instead
type SegmentData = {
    label: string;
    pct: number;
    color: string;
};

export function buildArcs(
    data: SegmentData[],  // ← changed from typeof categoryData
    cx: number,
    cy: number,
    r: number,
    gap = 2
) {
    let angle = -90;
    const total = data.reduce((s, d) => s + d.pct, 0);

    return data.map((seg) => {
        const sweep = (seg.pct / total) * 360 - gap;
        const start = angle + gap / 2;
        const end = start + sweep;
        angle += (seg.pct / total) * 360;

        const toRad = (d: number) => (d * Math.PI) / 180;
        const x1 = cx + r * Math.cos(toRad(start));
        const y1 = cy + r * Math.sin(toRad(start));
        const x2 = cx + r * Math.cos(toRad(end));
        const y2 = cy + r * Math.sin(toRad(end));
        const large = sweep > 180 ? 1 : 0;

        return { ...seg, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` };
    });
}
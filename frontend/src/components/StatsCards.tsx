import { useStats } from "../data/statCard";

export default function StatsCards() {
    const { stats, loading } = useStats();

    if (loading) return <p className="p-5 text-gray-400">Loading stats...</p>;

    return (
        <div className="grid grid-cols-4 gap-5 pt-5 pl-5 pr-5">
            {stats.map((stat) => (
                <div key={stat.id} className="bg-gray-300 p-3 rounded-xl shadow font-nav">
                    <div className="flex items-center gap-3">
                        <div className={`${stat.col} rounded-xl flex items-center justify-center w-12 h-12 shrink-0`}>
                            <img src={stat.img} alt={stat.title} />
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-800 font-semibold">{stat.title}</h3>
                            <p className="text-xl font-bold mt-1">{stat.value}</p>
                            <p className="text-sm text-gray-500 flex gap-1">
                                <span className={`${stat.parCol} font-nav font-bold`}>{stat.parVal}</span>
                                <span>{stat.par}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
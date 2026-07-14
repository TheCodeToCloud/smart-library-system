import { recentIssues } from "../../data/recentIssues";

export default function RecentIssues() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 mt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 text-base">Recent Issues</h2>
                <button className="text-xs text-blue-500 hover:underline">View all</button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
                {recentIssues.map(issue => (
                    <div key={issue.id} className="flex items-center gap-4">
                        {/* Book cover */}
                        <img
                            src={issue.img}
                            alt={issue.title}
                            className="w-10 h-14 object-cover rounded-md shrink-0"
                        />

                        {/* Book info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800">{issue.title}</p>
                            <p className="text-xs text-gray-400">{issue.author}</p>
                            <p className="text-xs text-gray-400">Issued to <span className="text-gray-600 font-medium">{issue.issuedTo} ({issue.studentId})</span></p>
                        </div>

                        {/* Date + due */}
                        <div className="text-right shrink-0">
                            <p className="text-xs text-gray-400">{issue.date}</p>
                            <p className={`text-xs font-semibold ${issue.dueColor}`}>{issue.due}</p>
                        </div>
                    </div>
                ))}

                {/* Footer */}
                <div className="mt-4 text-center">
                    <button className="text-sm text-blue-500 hover:underline cursor-pointer">View all issues →</button>
                </div>
            </div>
        </div>
    );
}
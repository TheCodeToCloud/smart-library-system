export default function Dashboard() {
    return (
        <div>
            {/* Welcome — only here, not in Header */}
            <div className="pl-8 py-2">
                <h1 className='text-3xl font-semibold font-nav2 text-fuchsia-600 pb-2'>
                    Welcome to our page ✌️,
                </h1>
                <p className="font-nav2 font-semibold text-sm">that mySelf and My Friends Created From the Scratch...</p>
            </div>

            {/* rest of your dashboard content */}
        </div>
    );
}
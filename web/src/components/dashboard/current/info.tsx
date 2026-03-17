export default function Info() {
    return (
        <div className="bg-white rounded-md shadow-md shadow-neutral-300/10 p-4 gap-6 flex ">
            <div className="size-40 bg-neutral-50 rounded-md"></div>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Greenwood Tower</h2>
                <div>
                    <p>Owner : <span>Waller Farid</span></p>
                    <p>Address : <span>320A, Road-3, Block C, Newyork</span></p>
                    <p>Occupancy Rate : <span className="text-emerald-500">82%</span></p>
                </div>
            </div>
        </div>
    )
}

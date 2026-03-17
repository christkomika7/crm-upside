
export default function ProviderInfos() {
    return (
        <div className='flex gap-x-4 bg-white rounded-md p-4'>
            <div className='size-30 rounded-md bg-neutral-50'></div>
            <div className='space-y-2'>
                <h2 className='font-medium'>Ocean Breeze</h2>
                <div className='grid text-neutral-500 grid-cols-[100px_1fr] gap-x-2'>
                    <p className='text-sm'>Profession</p>
                    <p className='text-sm'>: Plombier</p>
                    <p className='text-sm'>Adresse</p>
                    <p className='text-sm'>: 320/A, Road-3, Block C, Newyork</p>
                    <p className='text-sm'>Note</p>
                    <p className='text-sm '>: <span className="text-amber-500">4.8</span></p>
                </div>
            </div>
        </div>
    )
}

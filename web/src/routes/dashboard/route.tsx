import Navbar from '@/components/dashboard/layout/navbar'
import Sidebar from '@/components/dashboard/layout/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
    component: Dashboard,
})

function Dashboard() {
    return (
        <div className="w-screen h-screen bg-neutral-50 grid grid-cols-[260px_1fr] overflow-hidden">
            <aside className="sticky top-0 h-screen  z-10">
                <Sidebar />
            </aside>
            <div className="flex flex-col h-screen overflow-hidden">
                <header className="sticky top-0">
                    <Navbar />
                </header>
                <main className="flex-1 overflow-y-auto p-6 w-full mx-auto">
                    <div className='max-w-290 w-full mx-auto'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

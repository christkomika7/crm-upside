import Navbar from '@/components/dashboard/layout/navbar'
import Sidebar from '@/components/dashboard/layout/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard')({
    component: Dashboard,
})

function Dashboard() {
    const [open, setOpen] = useState(true);

    return (
        <div
            className="w-screen h-screen bg-neutral-50 grid overflow-hidden transition-all duration-300"
            style={{
                gridTemplateColumns: open ? "260px 1fr" : "72px 1fr",
            }}
        >
            <aside className="sticky top-0 h-screen z-10">
                <Sidebar open={open} setOpen={setOpen} />
            </aside>

            <div className="flex flex-col h-screen overflow-hidden">
                <header className="sticky top-0">
                    <Navbar />
                </header>

                <main className="flex-1 overflow-y-auto p-6 w-full mx-auto">
                    <div className="w-full mx-auto transition-all duration-300"
                        style={{
                            maxWidth: open ? 1160 : 1200
                        }}
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
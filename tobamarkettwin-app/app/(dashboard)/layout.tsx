import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 min-w-0 flex flex-col">
                <main className="flex-1 px-6 py-6 lg:px-10 lg:py-8">{children}</main>
                <footer className="px-6 lg:px-10 py-4 border-t border-black/[0.05] text-center">
                    <p className="text-[10.5px] text-charcoal/40">
                        Prototype research system. Current values are illustrative/simulated unless explicitly marked as primary data or literature evidence.
                    </p>
                </footer>
            </div>
        </div>
    );
}

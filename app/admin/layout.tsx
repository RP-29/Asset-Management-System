import Link from "next/link";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Home, Key, QrCode, ClipboardList, Database, LogOutIcon } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 print:block">
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shadow-xl flex flex-col print:hidden md:sticky md:top-0 md:h-screen z-20">
                <div className="p-4 md:p-6 border-b border-slate-800 text-center">
                    <div className="bg-white p-2 rounded-lg mb-2 md:mb-4 flex justify-center w-max mx-auto md:w-auto">
                        <img src="/icmr-logo.png" alt="ICMR-NIHR Logo" className="h-12 md:h-20 object-contain" />
                    </div>
                    <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">ICMR-NIHR Dibrugarh</h1>
                    <p className="text-xs md:text-sm font-medium text-blue-400 mt-1">Asset Portal</p>
                </div>
                <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 px-4 py-4 md:py-6 md:space-y-2 flex-1 w-full hide-scrollbar scroll-smooth">
                    <Link href="/admin/dashboard" className="flex items-center whitespace-nowrap px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors group">
                        <Home className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                        <span className="font-medium group-hover:text-white">Dashboard</span>
                    </Link>
                    <Link href="/admin/assets/new" className="flex items-center whitespace-nowrap px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors group">
                        <Database className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                        <span className="font-medium group-hover:text-white">Enter New Asset</span>
                    </Link>
                    <Link href="/admin/assets" className="flex items-center whitespace-nowrap px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors group">
                        <ClipboardList className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                        <span className="font-medium group-hover:text-white">Manage Assets</span>
                    </Link>
                    <Link href="/admin/print" className="flex items-center whitespace-nowrap px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors group">
                        <QrCode className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                        <span className="font-medium group-hover:text-white">Print QR Stickers</span>
                    </Link>
                    <Link href="/admin/reports" className="flex items-center whitespace-nowrap px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors group">
                        <ClipboardList className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                        <span className="font-medium group-hover:text-white">Audit & Reports</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800 flex md:block flex-row gap-2 overflow-x-auto md:overflow-visible sm:space-y-0 md:space-y-2">
                    <Link href="/admin/profile" className="flex items-center whitespace-nowrap md:w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group">
                        <Key className="w-5 h-5 mr-3" />
                        Admin Profile
                    </Link>
                    <div className="min-w-fit">
                        <LogoutButton />
                    </div>
                </div>
            </aside>
            <main className="flex-1 relative overflow-hidden md:overflow-y-auto print:overflow-visible">
                <header className="bg-white px-4 md:px-8 py-4 shadow-sm border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 w-full print:hidden">
                    <div className="text-slate-500 font-medium text-sm border px-3 py-1 bg-slate-100 rounded-md">Logged in as {session?.user?.name || "Admin"}</div>
                </header>
                <div className="p-8 pb-20 print:p-0">
                    {children}
                </div>
            </main>
        </div>
    );
}

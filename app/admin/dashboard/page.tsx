import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    // Real stats logic here later
    const totalAssets = await prisma.asset.count();

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-900 border-x border-y border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700">Total Assets</h3>
                    <p className="text-4xl font-black text-blue-900 mt-2">{totalAssets}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-emerald-600 border-x border-y border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700">Database Size</h3>
                    <p className="text-4xl font-black text-emerald-600 mt-2">{totalAssets} Units</p>
                </div>
            </div>
        </div>
    );
}

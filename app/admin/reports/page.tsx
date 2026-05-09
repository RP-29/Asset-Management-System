import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import ReportClient from "./ReportClient";

export default async function ReportsPage() {
    const session = await getServerSession(authOptions);

    // Get all unique budget years
    const distinctYears = await prisma.asset.findMany({
        select: { budgetYear: true },
        distinct: ['budgetYear']
    });

    const budgetYears = distinctYears.map(y => y.budgetYear).sort().reverse();

    const allAssets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Audit Reports</h1>
            <ReportClient allAssets={allAssets} budgetYears={budgetYears} />
        </div>
    );
}

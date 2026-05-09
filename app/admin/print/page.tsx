import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import PrintClientWrapper from "./PrintClientWrapper";
import { redirect } from "next/navigation";

export default async function PrintPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const assets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' },
        select: { propertyNo: true, particulars: true }
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6 print:hidden">Bulk Print QR Stickers</h1>
            <PrintClientWrapper items={assets} />
        </div>
    );
}

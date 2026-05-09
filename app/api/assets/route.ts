import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const {
            date,
            particulars,
            cost,
            vendorName,
            vendorAddress,
            invoiceNo,
            invoiceDate,
            warrantyYears,
            headOfAccount,
            location,
            budgetYear,
            remarks,
            quantity
        } = data;

        const qnty = parseInt(quantity);
        if (!qnty || qnty < 1) {
            return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
        }

        // Determine the next serial number for this financial year
        const lastAsset = await prisma.asset.findFirst({
            where: { budgetYear },
            orderBy: { propertyNo: 'desc' }
        });

        let startSerial = 1;
        if (lastAsset) {
            const parts = lastAsset.propertyNo.split('-');
            const lastSerialStr = parts[parts.length - 1];
            startSerial = parseInt(lastSerialStr) + 1;
        }

        const newAssets = [];
        for (let i = 0; i < qnty; i++) {
            const currentSerial = startSerial + i;
            const serialStr = currentSerial.toString().padStart(3, '0');
            const propertyNo = `ICMR-NIHR-DIB-${budgetYear}-${serialStr}`;

            newAssets.push({
                propertyNo,
                date: new Date(date),
                particulars,
                cost: parseFloat(cost),
                vendorName,
                vendorAddress,
                invoiceNo,
                invoiceDate: new Date(invoiceDate),
                warrantyYears: parseInt(warrantyYears),
                headOfAccount,
                location,
                budgetYear,
                remarks: remarks || "",
            });
        }

        await prisma.asset.createMany({
            data: newAssets
        });

        return NextResponse.json({ success: true, count: qnty, properties: newAssets.map(a => a.propertyNo) });
    } catch (error) {
        console.error("Error creating assets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(assets);
}

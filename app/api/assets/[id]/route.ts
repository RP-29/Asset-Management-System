import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const id = params.id;
    try {
        const asset = await prisma.asset.findUnique({
            where: { propertyNo: id }
        });
        if (!asset) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(asset);
    } catch (error) {
        console.error("Error fetching asset:", error);
        return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 });
    }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const id = params.id;
    try {
        const data = await req.json();

        // Exclude system fields from update if any are passed
        delete data.propertyNo;
        delete data.createdAt;
        delete data.updatedAt;

        if (data.date) {
            data.date = new Date(data.date);
        }
        if (data.invoiceDate) {
            data.invoiceDate = new Date(data.invoiceDate);
        }

        const updatedAsset = await prisma.asset.update({
            where: { propertyNo: id },
            data
        });

        return NextResponse.json(updatedAsset);
    } catch (error) {
        console.error("Error updating asset:", error);
        return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const id = params.id;
    try {
        const deletedAsset = await prisma.asset.update({
            where: { propertyNo: id },
            data: { status: "Discarded" } // Soft delete
        });

        return NextResponse.json({ message: "Asset marked as discarded", asset: deletedAsset });
    } catch (error) {
        console.error("Error discarding asset:", error);
        return NextResponse.json({ error: "Failed to discard asset" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const { username, password } = await req.json();
        const updateData: any = {};

        if (username && username.trim().length > 0) {
            // Check if username already exists for someone else
            const existingUser = await prisma.user.findUnique({ where: { username } });
            if (existingUser && existingUser.id !== userId) {
                return NextResponse.json({ error: "Username already taken" }, { status: 400 });
            }
            updateData.username = username;
        }

        if (password && password.trim().length > 0) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No data provided to update" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json({ message: "Profile updated successfully", username: updatedUser.username });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}

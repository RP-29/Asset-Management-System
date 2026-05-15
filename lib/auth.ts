import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password) {
                        console.log("Missing credentials");
                        return null;
                    }

                    console.log("Attempting login for:", credentials.username);

                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username }
                    });

                    if (!user) {
                        console.log("User not found in DB");
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        console.log("Invalid password");
                        return null;
                    }

                    console.log("Login successful!");
                    return {
                        id: user.id,
                        username: user.username,
                    };
                } catch (error) {
                    console.error("AUTH ERROR:", error);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev",
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    }
};

"use client";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => {
                if (window.confirm("Are you Sure ?")) {
                    signOut({ callbackUrl: "/login" });
                }
            }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors group"
        >
            <LogOutIcon className="w-5 h-5 mr-3" />
            Sign Out
        </button>
    );
}

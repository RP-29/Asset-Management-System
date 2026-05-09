"use client";

import { useState } from "react";
import { User, Lock } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!window.confirm("Are you Sure ?")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Profile updated successfully. Please log back in if your username or password changed.");
                setFormData({ username: "", password: "" });
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                <h2 className="text-xl font-semibold text-white tracking-wide">Admin Profile</h2>
                <p className="text-slate-400 text-sm mt-1">Update your login credentials below. Leave password blank if you do not want to change it.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2 text-slate-400" /> New Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter new username"
                        className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-slate-400" /> New Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                    />
                    <p className="text-xs text-slate-400 mt-2">Only fill this if you want to change your current password.</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || (!formData.username && !formData.password)}
                        className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-800 transition focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update Credentials'}
                    </button>
                </div>
            </form>
        </div>
    );
}

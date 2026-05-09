"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });
        if (result?.ok) {
            router.push("/admin/dashboard");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl w-[90%] max-w-[400px] border-t-8 border-blue-900 border-x border-b border-gray-200">
                <div className="flex justify-center mb-6">
                    <img src="/icmr-logo.png" alt="ICMR-NIHR Logo" className="h-32 object-contain" />
                </div>
                <h2 className="text-xl font-bold mb-1 text-center text-blue-900">ICMR-NIHR Dibrugarh</h2>
                <p className="text-center text-slate-500 mb-6 font-medium">Asset Management Portal</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="e.g. admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border w-full p-3 bg-slate-50 rounded-lg outline-none focus:border-blue-900 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border w-full p-3 bg-slate-50 rounded-lg outline-none focus:border-blue-900 transition-colors"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-900 text-white font-semibold text-base py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-md mt-2">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

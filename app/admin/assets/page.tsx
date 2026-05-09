"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";

type Asset = {
    propertyNo: string;
    particulars: string;
    date: string;
    cost: number;
    status: string;
};

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/assets");
            if (res.ok) {
                const data = await res.json();
                setAssets(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you Sure ?")) {
            return;
        }

        try {
            const res = await fetch(`/api/assets/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchAssets(); // Refresh list
            } else {
                alert("Failed to delete asset");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting asset");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white tracking-wide">Manage Assets</h2>
                    <p className="text-slate-400 text-sm mt-1">View, edit, or remove asset records.</p>
                </div>
            </div>

            <div className="p-6 overflow-x-auto">
                {loading ? (
                    <p className="text-slate-500 text-center py-8">Loading assets...</p>
                ) : assets.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No assets found in the database.</p>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Property No.</th>
                                <th className="px-6 py-3 font-semibold">Particulars</th>
                                <th className="px-6 py-3 font-semibold">Date</th>
                                <th className="px-6 py-3 font-semibold text-right">Cost</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                                <th className="px-6 py-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.propertyNo} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-800">{asset.propertyNo}</td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={asset.particulars}>{asset.particulars}</td>
                                    <td className="px-6 py-4 text-slate-600">{new Date(asset.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-700">₹{asset.cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${asset.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {asset.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-3">
                                            <Link href={`/asset/${asset.propertyNo}`} target="_blank" className="text-slate-400 hover:text-blue-600 transition" title="View Public Page">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/admin/assets/${asset.propertyNo}`} className="text-slate-400 hover:text-amber-500 transition" title="Edit Asset">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(asset.propertyNo)} disabled={asset.status === 'Discarded'} className="text-slate-400 hover:text-red-600 transition disabled:opacity-30 disabled:hover:text-slate-400" title="Discard Asset">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

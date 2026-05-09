import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PublicAssetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const asset = await prisma.asset.findUnique({
        where: { propertyNo: decodeURIComponent(id) }
    });

    if (!asset) {
        return notFound();
    }

    // Formatting date
    const entryDate = asset.date.toLocaleDateString();

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-blue-900 text-center shadow-inner relative">
                    <div className="bg-white w-full py-4 px-6 shadow-sm flex justify-center border-b border-slate-200">
                        <img src="/icmr-logo.png" alt="ICMR-NIHR Logo" className="h-32 object-contain" />
                    </div>
                    <div className="p-6 pt-4">
                        <p className="text-blue-100 text-sm tracking-wide bg-blue-800 inline-block px-3 py-1 rounded-full uppercase shadow-sm font-semibold">Asset Verification</p>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Property No.</p>
                            <p className="text-lg font-mono font-bold text-slate-800">{asset.propertyNo}</p>
                        </div>
                        {asset.status === 'Discarded' ? (
                            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ring-red-600/20 shadow-sm flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span> DISCARDED
                            </div>
                        ) : (
                            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ring-emerald-600/20 shadow-sm flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> VERIFIED
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Particulars</p>
                            <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded">{asset.particulars}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                <p className="text-sm font-semibold text-slate-800">{asset.location}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account Head</p>
                                <p className="text-sm font-semibold text-slate-800">{asset.headOfAccount}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status / Remarks</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {asset.status === 'Discarded' ? 'Asset is Discarded' : (asset.remarks || 'Active / Healthy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Warranty</p>
                                <p className="text-sm font-semibold text-slate-800">{asset.warrantyYears} Year(s)</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-6 bg-slate-50 -mx-6 -mb-6 p-6">
                            <p className="text-center text-xs text-slate-500 font-medium tracking-wide">
                                Entry Date: <span className="font-semibold text-slate-700">{entryDate}</span> • Budget Year: <span className="font-semibold text-slate-700">{asset.budgetYear}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

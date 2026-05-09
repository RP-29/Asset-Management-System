"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAssetPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        propertyNo: "",
        date: "",
        particulars: "",
        cost: "",
        vendorName: "",
        vendorAddress: "",
        invoiceNo: "",
        invoiceDate: "",
        warrantyYears: "",
        headOfAccount: "",
        location: "",
        budgetYear: "",
        remarks: "",
        status: ""
    });

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                // Next.js params are promises in 15+, but since this is an ID string we can often use it directly if it's 14. 
                // Let's assume standard Next.js behavior for now. The backend API will use this ID.
                const res = await fetch(`/api/assets/${id}`);
                if (res.ok) {
                    const data = await res.json();

                    // Format dates for input type="date"
                    const dateStr = data.date ? new Date(data.date).toISOString().split('T')[0] : "";
                    const invoiceDateStr = data.invoiceDate ? new Date(data.invoiceDate).toISOString().split('T')[0] : "";

                    setFormData({
                        ...data,
                        date: dateStr,
                        invoiceDate: invoiceDateStr,
                        cost: data.cost?.toString() || "",
                        warrantyYears: data.warrantyYears?.toString() || ""
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchAsset();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!window.confirm("Are you Sure ?")) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/assets/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    cost: parseFloat(formData.cost),
                    warrantyYears: parseInt(formData.warrantyYears)
                }),
            });

            if (res.ok) {
                alert("Asset updated successfully");
                router.push("/admin/assets");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update asset");
            }
        } catch (error) {
            console.error(error);
            alert("Error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-slate-500">Loading asset data...</div>;

    return (
        <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white tracking-wide">Edit Asset: {id}</h2>
                    <p className="text-slate-400 text-sm mt-1">Update asset information and save.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Particulars of Asset</label>
                        <textarea
                            name="particulars" required
                            value={formData.particulars} onChange={handleChange}
                            className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" rows={3}
                        ></textarea>
                    </div>
                    <div className="space-y-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Cost (Per Unit)</label>
                        <input type="number" step="0.01" name="cost" required value={formData.cost} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />

                        <label className="block text-sm font-semibold text-slate-700 mb-2 mt-4">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none">
                            <option value="Active">Active</option>
                            <option value="Discarded">Discarded</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Entry Date</label>
                        <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Head of Account</label>
                        <select name="headOfAccount" value={formData.headOfAccount} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none">
                            <option value="Consumable">Consumable</option>
                            <option value="Chemical">Chemical</option>
                            <option value="OME">OME</option>
                            <option value="Office Equipment">Office Equipment</option>
                            <option value="Lab Equipment">Lab Equipment</option>
                            <option value="Scientific Equipment">Scientific Equipment</option>
                            <option value="Electric Equipment">Electric Equipment</option>
                            <option value="Computer & Peripheral">Computer & Peripheral</option>
                            <option value="Furniture & fixtures">Furniture & fixtures</option>
                            <option value="Audio & Visual">Audio & Visual</option>
                            <option value="Office Vehicles">Office Vehicles</option>
                            <option value="AMC-CMC">AMC-CMC</option>
                            <option value="Animal Food">Animal Food</option>
                            <option value="Repair/Maintenance (Scientific/Petty/Plant & Machinery)">Repair/Maintenance (Scientific/Petty/Plant & Machinery)</option>
                            <option value="CCT">CCT</option>
                            <option value="Recurring /Non recurring">Recurring /Non recurring</option>
                            <option value="Contingency">Contingency</option>
                            <option value="Stationeries">Stationeries</option>
                            <option value="Swachh Bharat Action Plan">Swachh Bharat Action Plan</option>
                            <option value="Sequencing Service">Sequencing Service</option>
                            <option value="Travel">Travel</option>
                            <option value="Vehicles Insurance">Vehicles Insurance</option>
                            <option value="Postage & Courier">Postage & Courier</option>
                            <option value="Glassware & Plasticware">Glassware & Plasticware</option>
                            <option value="Courier Charges">Courier Charges</option>
                            <option value="Building Repair Maintenance">Building Repair Maintenance</option>
                            <option value="Advertising & Publicity">Advertising & Publicity</option>
                            <option value="Advance">Advance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Financial Budget Year</label>
                        <select name="budgetYear" value={formData.budgetYear} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none">
                            {Array.from({ length: 21 }, (_, i) => {
                                const startYear = 2025 + i;
                                const endYear = (startYear + 1).toString().slice(2);
                                const yearStr = `${startYear}-${endYear}`;
                                return <option key={yearStr} value={yearStr}>{yearStr}</option>;
                            })}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Vendor Name</label>
                        <input type="text" name="vendorName" required value={formData.vendorName} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Vendor Address</label>
                        <input type="text" name="vendorAddress" required value={formData.vendorAddress} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Invoice Number</label>
                        <input type="text" name="invoiceNo" required value={formData.invoiceNo} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Invoice Date</label>
                        <input type="date" name="invoiceDate" required value={formData.invoiceDate} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Warranty (Years)</label>
                        <input type="number" min="0" name="warrantyYears" required value={formData.warrantyYears} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Section / Location</label>
                        <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Remarks</label>
                        <input type="text" name="remarks" value={formData.remarks || ""} onChange={handleChange} className="w-full p-2.5 border bg-slate-50 rounded-md focus:ring-2 focus:ring-blue-900 outline-none" />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    <button type="button" onClick={() => router.push("/admin/assets")} className="text-slate-600 font-semibold px-4 py-2 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-800 transition focus:ring-4 focus:ring-blue-200">
                        {loading ? 'Saving...' : 'Update Asset Record'}
                    </button>
                </div>
            </form>
        </div>
    );
}

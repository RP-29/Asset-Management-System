"use client";

import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ReportClient({ allAssets, budgetYears }: { allAssets: any[], budgetYears: string[] }) {
    const [selectedYear, setSelectedYear] = useState<string>("All");

    const filteredAssets = selectedYear === "All"
        ? allAssets
        : allAssets.filter(a => a.budgetYear === selectedYear);

    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Assets');

        try {
            // Fetch and embed logo
            const imageRes = await fetch('/icmr-logo.png');
            const imageBlob = await imageRes.blob();
            const arrayBuffer = await imageBlob.arrayBuffer();

            const imageId = workbook.addImage({
                buffer: arrayBuffer,
                extension: 'png',
            });

            // Add image to top left
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 },
                ext: { width: 350, height: 110 }
            });
        } catch (e) {
            console.warn("Could not load logo for excel", e);
        }

        // Leave some blank rows for the image
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);

        // Add Title
        const titleRow = worksheet.addRow(['ICMR-NIHR Dibrugarh - Asset Management Report']);
        titleRow.font = { bold: true, size: 16, color: { argb: 'FF0a1e3f' } };
        worksheet.addRow([`Report Generated on: ${new Date().toLocaleDateString()} | Filter: ${selectedYear} Budget Year`]);
        worksheet.addRow([]); // Blank row

        // Define headers
        const headers = ["Property No.", "Date", "Particulars of Asset", "Cost of the Asset", "Vendor Name", "Vendor Address", "Bill/Invoice No.", "Bill/Invoice Date", "Warranty (Years)", "Head of Accounts", "Section/Location", "Budget Year", "Status", "Remarks"];
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFe2e8f0' }
        };

        // Add data
        filteredAssets.forEach(asset => {
            worksheet.addRow([
                asset.propertyNo,
                new Date(asset.date).toLocaleDateString(),
                asset.particulars,
                asset.cost,
                asset.vendorName,
                asset.vendorAddress,
                asset.invoiceNo,
                new Date(asset.invoiceDate).toLocaleDateString(),
                asset.warrantyYears,
                asset.headOfAccount,
                asset.location,
                asset.budgetYear,
                asset.status || 'Active',
                asset.remarks || ''
            ]);
        });

        // Configure basic column widths
        worksheet.getColumn(1).width = 30; // Property No
        worksheet.getColumn(3).width = 40; // Particulars
        worksheet.getColumn(4).width = 15; // Cost
        worksheet.getColumn(5).width = 25; // Vendor Name
        worksheet.getColumn(6).width = 30; // Vendor Address
        worksheet.getColumn(10).width = 25; // Head of Accounts
        worksheet.getColumn(11).width = 20; // Location

        // Generate and save Export file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `ICMR_Assets_${selectedYear}.xlsx`);
    };

    return (
        <div className="bg-white rounded-xl shadow border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div className="flex items-center space-x-4">
                    <label className="font-semibold text-slate-700">Filter by Budget Year:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border p-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-900 outline-none"
                    >
                        <option value="All">All Years</option>
                        {budgetYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-emerald-500 transition disabled:opacity-50"
                    disabled={filteredAssets.length === 0}
                >
                    Export to Excel (.xlsx)
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                            <th className="p-4 border-b font-semibold">Property No.</th>
                            <th className="p-4 border-b font-semibold">Particulars</th>
                            <th className="p-4 border-b font-semibold">Location</th>
                            <th className="p-4 border-b font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {filteredAssets.map(asset => (
                            <tr key={asset.propertyNo} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-mono font-medium">{asset.propertyNo}</td>
                                <td className="p-4 truncate max-w-xs">{asset.particulars}</td>
                                <td className="p-4">{asset.location}</td>
                                <td className="p-4">{new Date(asset.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {filteredAssets.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">No assets found for the selected budget year.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

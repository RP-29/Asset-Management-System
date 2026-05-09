"use client";
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type AssetPreview = {
    propertyNo: string;
    particulars: string;
};

export default function PrintClientWrapper({ items }: { items: AssetPreview[] }) {
    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = (propertyNo: string) => {
        if (selected.includes(propertyNo)) {
            setSelected(selected.filter(i => i !== propertyNo));
        } else {
            setSelected([...selected, propertyNo]);
        }
    };

    const selectAll = () => setSelected(items.map(i => i.propertyNo));
    const deselectAll = () => setSelected([]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 print:hidden mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-700">Select Assets to Print</h3>
                    <div className="space-x-3">
                        <button onClick={selectAll} className="text-sm font-medium text-blue-600 hover:underline">Select All</button>
                        <button onClick={deselectAll} className="text-sm font-medium text-slate-500 hover:underline">Clear</button>
                        <button onClick={handlePrint} disabled={selected.length === 0} className="ml-4 bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50">
                            Print Selected ({selected.length})
                        </button>
                    </div>
                </div>
                <div className="max-h-64 overflow-y-auto border border-slate-100 rounded bg-slate-50 p-2">
                    {items.map((item, index) => (
                        <label key={`${item.propertyNo}-${index}`} className="flex items-center space-x-3 p-2 hover:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-0">
                            <input type="checkbox" checked={selected.includes(item.propertyNo)} onChange={() => handleSelect(item.propertyNo)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                            <span className="font-medium text-slate-700 font-mono text-sm min-w-44">{item.propertyNo}</span>
                            <span className="text-slate-500 text-sm truncate">{item.particulars}</span>
                        </label>
                    ))}
                    {items.length === 0 && <p className="text-slate-500 p-4 text-center text-sm">No assets found in the database.</p>}
                </div>
            </div>

            {/* PRINT LAYER - hidden on screen, visible on print in flow layouts designed for 25-30mm sizes */}
            <div className="hidden print:flex flex-wrap gap-[5px] justify-start items-start w-full">
                {items.filter(i => selected.includes(i.propertyNo)).map(item => {
                    const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/asset/${item.propertyNo}`;

                    return (
                        <div key={`print-${item.propertyNo}`} className="flex flex-col items-center justify-center bg-white" style={{ width: '30mm', height: '30mm', overflow: 'hidden', boxSizing: 'border-box', border: '1px solid #ccc', padding: '1mm', breakInside: 'avoid' }}>
                            <QRCodeSVG value={publicUrl} size={68} level="M" />
                            <span className="text-[6px] font-mono font-bold text-center mt-1 w-full truncate block leading-tight">{item.propertyNo}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

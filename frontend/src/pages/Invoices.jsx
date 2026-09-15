import React from 'react';

export default function Invoices() {
  const receipts = [
    { invoiceNo: 'INV-2026-001', customer: 'Arun Kumar', unit: 'A-204 (Tower A)', total: 5200000, paid: 1000000, due: 4200000, status: 'PARTIAL' },
    { invoiceNo: 'INV-2026-002', customer: 'Priya Sharma', unit: 'B-301 (Tower B)', total: 6800000, paid: 2000000, due: 4800000, status: 'PARTIAL' },
    { invoiceNo: 'INV-2026-003', customer: 'Suresh Menon', unit: 'A-102 (Tower A)', total: 4800000, paid: 4800000, due: 0, status: 'PAID' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Invoices & Payment Receipts</h1>
          <p className="text-xs text-slate-400 mt-0.5">Booking token receipts, milestone invoicing, and outstanding balances</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Received</span>
          <span className="text-xl font-black text-emerald-600">₹78.00 Lakhs</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Unit Assigned</th>
              <th className="p-4">Total Value</th>
              <th className="p-4">Token Paid</th>
              <th className="p-4">Balance Due</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {receipts.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="p-4 font-mono font-bold text-blue-600">{r.invoiceNo}</td>
                <td className="p-4 font-bold text-slate-800">{r.customer}</td>
                <td className="p-4 text-slate-600">{r.unit}</td>
                <td className="p-4 font-black text-slate-800">₹{(r.total / 100000).toFixed(2)} L</td>
                <td className="p-4 font-bold text-emerald-600">₹{(r.paid / 100000).toFixed(2)} L</td>
                <td className="p-4 font-bold text-amber-600">₹{(r.due / 100000).toFixed(2)} L</td>
                <td className="p-4 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    r.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
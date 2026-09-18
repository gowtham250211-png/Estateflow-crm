import React, { useState, useEffect } from 'react';

// Pre-encoded valid 1-page sample PDF
const SAMPLE_PDF_BASE64 =
  'data:application/pdf;base64,JVBERi0xLjMKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA2NQo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGROCihFU1RBVEVGTE9XIC0gU0FNUExFIFNBTEUgQUdSRUVNRU5UKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL1ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjEgMDAwMDAgbiAKMDAwMDAwMDMzNiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQyNQolJUVPRg==';

const DEFAULT_DOCS = [
  { id: 1, name: 'Sale Agreement - Unit #A-102', client: 'Arun Kumar', type: 'LEGAL', status: 'READY', size: '2.4 MB', fileData: SAMPLE_PDF_BASE64 },
  { id: 2, name: 'PAN & Aadhaar KYC Dossier', client: 'Priya', type: 'KYC', status: 'VERIFIED', size: '1.1 MB', fileData: SAMPLE_PDF_BASE64 },
  { id: 3, name: 'Allotment Letter - Villa #14', client: 'Karthik', type: 'ALLOTMENT', status: 'PENDING SIGNATURE', size: '3.8 MB', fileData: SAMPLE_PDF_BASE64 },
  { id: 4, name: 'Cost Sheet & Payment Milestones', client: 'Rahul Sharma', type: 'FINANCE', status: 'READY', size: '890 KB', fileData: SAMPLE_PDF_BASE64 }
];

export default function Documents() {
  const [docs, setDocs] = useState(() => {
    const saved = localStorage.getItem('estateflow_docs');
    return saved ? JSON.parse(saved) : DEFAULT_DOCS;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    client: '',
    type: 'LEGAL',
    fileData: null,
    fileName: '',
    size: ''
  });

  useEffect(() => {
    localStorage.setItem('estateflow_docs', JSON.stringify(docs));
  }, [docs]);

  // Handle PDF File Upload via FileReader
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setNewDoc((prev) => ({
        ...prev,
        fileName: file.name,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
        size: fileSizeStr,
        fileData: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDoc.fileData) {
      alert('Please attach a PDF document.');
      return;
    }

    const created = {
      id: Date.now(),
      name: newDoc.name,
      client: newDoc.client || 'General Record',
      type: newDoc.type,
      status: 'VERIFIED',
      size: newDoc.size,
      fileData: newDoc.fileData
    };

    setDocs([created, ...docs]);
    setModalOpen(false);
    setNewDoc({ name: '', client: '', type: 'LEGAL', fileData: null, fileName: '', size: '' });
  };

  // Download Action
  const triggerDownload = (doc) => {
    const downloadUrl = doc.fileData || SAMPLE_PDF_BASE64;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${doc.name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Documents Vault</h1>
          <p className="text-xs font-semibold text-slate-500">
            KYC records, verified deed packages, and downloadable contracts
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer flex items-center gap-2"
        >
          <span>📄</span>
          <span>+ Upload PDF</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sale Agreements', count: '18 Active', icon: '📝' },
          { label: 'KYC Vault', count: '42 Verified', icon: '🛡️' },
          { label: 'Allotment Letters', count: '9 Issued', icon: '📜' },
          { label: 'Bank NOCs', count: '14 Cleared', icon: '🏦' }
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">{item.label}</div>
              <div className="text-xs font-black text-indigo-600 mt-0.5">{item.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4">Document Details</th>
              <th className="p-4">Client / Prospect</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-indigo-500">📄</span>
                    <span>{doc.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 ml-5 font-mono">{doc.size}</div>
                </td>
                <td className="p-4 font-semibold text-slate-600">{doc.client}</td>
                <td className="p-4">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {doc.type}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      doc.status === 'VERIFIED' || doc.status === 'READY'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => triggerDownload(doc)}
                    className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Download PDF ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="text-indigo-600">📤</span> Upload Client PDF
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Document Label</label>
                <input
                  type="text"
                  placeholder="e.g. Sale Deed - Tower B 304"
                  className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Client / Buyer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sundaram"
                  className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                  value={newDoc.client}
                  onChange={(e) => setNewDoc({ ...newDoc, client: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="LEGAL">LEGAL</option>
                  <option value="KYC">KYC</option>
                  <option value="ALLOTMENT">ALLOTMENT</option>
                  <option value="FINANCE">FINANCE</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select PDF File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={handleFileChange}
                  className="w-full mt-1 p-2 bg-white border border-dashed border-indigo-300 rounded-xl text-xs text-slate-600 file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white file:font-semibold file:cursor-pointer"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                >
                  Store & Verify
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
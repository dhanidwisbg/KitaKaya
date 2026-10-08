"use client";

import { useState } from "react";
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useDatabase } from "@/lib/db/hooks";

export default function DataBackup() {
  const { exportData, importData } = useDatabase();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleExport = async () => {
    try {
      await exportData();
      setMessage({ type: "success", text: "Data berhasil diekspor!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Gagal mengekspor data" });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      await importData(file);
      setMessage({ type: "success", text: "Data berhasil diimpor! Halaman akan dimuat ulang." });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Gagal mengimpor data. Pastikan file valid." });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Backup & Restore Data</h3>
      
      {message && (
        <div className={lex items-center gap-2 p-3 rounded-xl mb-4 }>
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:opacity-90 transition-all font-medium"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>

        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all cursor-pointer font-medium">
          <Upload className="w-4 h-4" />
          {importing ? "Mengimpor..." : "Import Data"}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Data disimpan di browser Anda. Export secara berkala untuk backup.
      </p>
    </div>
  );
}

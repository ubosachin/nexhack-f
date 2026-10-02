"use client";

import React, { useState } from "react";
import { Mail, Download, Trash2, Search, CheckCircle2, Loader2 } from "lucide-react";
import { DbNewsletter } from "@/lib/dbTypes";

interface NewslettersTabProps {
  newsletters: DbNewsletter[];
  onDelete: (id: string) => Promise<void>;
}

export function NewslettersTab({ newsletters, onDelete }: NewslettersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = newsletters.filter((n) =>
    n.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["ID", "Email", "Source", "Status", "Subscribed At"];
    const rows = filtered.map((n) => [
      `"${n.id}"`,
      `"${n.email}"`,
      `"${n.source || "Website"}"`,
      `"${n.status || "Subscribed"}"`,
      `"${new Date(n.createdAt).toISOString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nexhack_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Unsubscribe / delete "${email}"?`)) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white">Subscriber List</h3>
          <p className="text-xs text-slate-400">
            {newsletters.length} users subscribed to NEXHACK updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
            title="Export subscribers to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
          <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Subscribers Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? "No emails match your query." : "Subscribers will appear here when users sign up via the footer."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Email</th>
                <th className="p-4">Acquisition Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Subscribed Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-200">
                    {item.email}
                  </td>
                  <td className="p-4 text-slate-400">
                    {item.source || "Website Footer"}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status || "Subscribed"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id, item.email)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Remove Subscriber"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

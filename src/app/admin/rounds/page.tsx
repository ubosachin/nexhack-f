"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { RoundsTab } from "@/components/admin/tabs/RoundsTab";

export default function AdminRoundsPage() {
  const { hackathons } = useAdminData();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const selected = hackathons.find((h) => h.id === selectedHackathonId);

  return (
    <>
      <AdminHeader onOpenMobile={() => {}} />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900">Rounds Management</h1>
          <p className="text-xs text-slate-500">Configure independent rounds and submission settings for each hackathon.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Hackathon</label>
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Choose a hackathon…</option>
            {hackathons.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>

        {selected ? (
          <RoundsTab hackathonId={selected.id} hackathonName={selected.name} />
        ) : (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-sm text-slate-500">Select a hackathon above to manage its rounds.</p>
          </div>
        )}
      </main>
    </>
  );
}

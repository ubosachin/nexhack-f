"use client";

import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { CodesTab } from "@/components/admin/tabs/CodesTab";

export default function AdminCodesPage() {
  const { hackathons } = useAdminData();
  return (
    <>
      <AdminHeader onOpenMobile={() => {}} />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900">Verification Codes</h1>
          <p className="text-xs text-slate-500">Generate and manage Unstop/external platform verification codes for each hackathon.</p>
        </div>
        <CodesTab hackathons={hackathons} />
      </main>
    </>
  );
}

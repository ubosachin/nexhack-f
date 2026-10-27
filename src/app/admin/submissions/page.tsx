"use client";

import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { SubmissionsTab } from "@/components/admin/tabs/SubmissionsTab";

export default function AdminSubmissionsPage() {
  const { hackathons } = useAdminData();
  return (
    <>
      <AdminHeader onOpenMobile={() => {}} />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900">Submissions</h1>
          <p className="text-xs text-slate-500">View and filter all project submissions by hackathon and round.</p>
        </div>
        <SubmissionsTab hackathons={hackathons} />
      </main>
    </>
  );
}

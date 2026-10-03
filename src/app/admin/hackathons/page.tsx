"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { HackathonsTab } from "@/components/admin/tabs/HackathonsTab";

export default function AdminHackathonsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {
    hackathons,
    openCreateHackathon,
    handleDeleteHackathon,
    handleUpdateHackathonStatus,
  } = useAdminData();

  return (
    <>
      <AdminHeader
        onOpenMobile={() => setIsMobileOpen(true)}
        actionLabel="Create Hackathon"
        actionIcon={<Plus className="w-3.5 h-3.5" />}
        onActionClick={() => openCreateHackathon()}
      />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <HackathonsTab
          hackathons={hackathons}
          onOpenCreate={() => openCreateHackathon()}
          onEdit={(h) => openCreateHackathon(h)}
          onDelete={handleDeleteHackathon}
          onUpdateStatus={handleUpdateHackathonStatus}
        />
      </main>
    </>
  );
}

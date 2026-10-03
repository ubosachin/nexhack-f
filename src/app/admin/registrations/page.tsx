"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { RegistrationsTab } from "@/components/admin/tabs/RegistrationsTab";

export default function AdminRegistrationsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {
    registrations,
    handleUpdateRegistrationStatus,
    handleDeleteRegistration,
  } = useAdminData();

  return (
    <>
      <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <RegistrationsTab
          registrations={registrations}
          onUpdateStatus={handleUpdateRegistrationStatus}
          onDelete={handleDeleteRegistration}
        />
      </main>
    </>
  );
}

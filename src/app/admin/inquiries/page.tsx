"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { InquiriesTab } from "@/components/admin/tabs/InquiriesTab";

export default function AdminInquiriesPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {
    inquiries,
    handleUpdateInquiryStatus,
    handleDeleteInquiry,
  } = useAdminData();

  return (
    <>
      <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <InquiriesTab
          inquiries={inquiries}
          onUpdateStatus={handleUpdateInquiryStatus}
          onDelete={handleDeleteInquiry}
        />
      </main>
    </>
  );
}

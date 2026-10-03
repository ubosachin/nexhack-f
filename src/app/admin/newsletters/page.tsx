"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { NewslettersTab } from "@/components/admin/tabs/NewslettersTab";

export default function AdminNewslettersPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { newsletters, handleDeleteNewsletter } = useAdminData();

  return (
    <>
      <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <NewslettersTab
          newsletters={newsletters}
          onDelete={handleDeleteNewsletter}
        />
      </main>
    </>
  );
}

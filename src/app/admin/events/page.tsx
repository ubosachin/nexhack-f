"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { EventsTab } from "@/components/admin/tabs/EventsTab";

export default function AdminEventsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { events, openCreateEvent, handleDeleteEvent } = useAdminData();

  return (
    <>
      <AdminHeader
        onOpenMobile={() => setIsMobileOpen(true)}
        actionLabel="Schedule Workshop"
        actionIcon={<Plus className="w-3.5 h-3.5" />}
        onActionClick={() => openCreateEvent()}
      />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <EventsTab
          events={events}
          onOpenCreate={() => openCreateEvent()}
          onDelete={handleDeleteEvent}
        />
      </main>
    </>
  );
}

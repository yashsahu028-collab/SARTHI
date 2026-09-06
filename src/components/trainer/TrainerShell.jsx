"use client";

import React, { useState } from "react";
import TrainerSidebar from "./TrainerSidebar";
import TrainerHeader from "./TrainerHeader";
import TrainerModals from "./TrainerModals";

export default function TrainerShell({
  children,
  searchQuery,
  setSearchQuery,
  placeholder,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="trainer-app-layout">
      {/* Sidebar */}
      <TrainerSidebar isOpen={isSidebarOpen} />

      {/* Main Column */}
      <div className="trainer-main">
        <TrainerHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={placeholder}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="trainer-content-body">
          {children}
        </main>
      </div>

      {/* Global Modals Manager */}
      <TrainerModals />
    </div>
  );
}

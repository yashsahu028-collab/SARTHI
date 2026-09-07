"use client";

import React from "react";
import TrainerSidebar from "./TrainerSidebar";
import TrainerHeader from "./TrainerHeader";
import TrainerModals from "./TrainerModals";
import "@/app/dashboard/dashboard.css";

export default function TrainerShell({
  children,
  searchQuery,
  setSearchQuery,
  placeholder = "Search courses, trainees, submissions, or assessments...",
}) {
  return (
    <div className="sarthi-dashboard-root">
      {/* Fixed Left Sidebar */}
      <TrainerSidebar />

      {/* Main Content Area */}
      <main className="db-main-content">
        <TrainerHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={placeholder}
        />
        {children}
      </main>

      {/* Global Modals Manager */}
      <TrainerModals />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerSidebar({ isOpen = false }) {
  const pathname = usePathname();
  const { trainer, submissions, conversations } = useTrainer();

  const pendingSubmissionsCount = submissions.filter((s) => s.status === "pending").length;
  const unreadDoubtsCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems = [
    {
      name: "Mission Control",
      href: "/trainer",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      name: "Course Management",
      href: "/trainer/courses",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      name: "Live Studio",
      href: "/trainer/live",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      ),
    },
    {
      name: "Grading Desk",
      href: "/trainer/assignments",
      badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : null,
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <line x1="9" y1="12" x2="15" y2="12"></line>
          <line x1="9" y1="16" x2="13" y2="16"></line>
        </svg>
      ),
    },
    {
      name: "Quiz Builder",
      href: "/trainer/quiz",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      ),
    },
    {
      name: "Trainee Roster",
      href: "/trainer/students",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      name: "Analytics & Reports",
      href: "/trainer/analytics",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    },
    {
      name: "Certificates",
      href: "/trainer/certificates",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      ),
    },
    {
      name: "Doubt Clearance",
      href: "/trainer/messages",
      badge: unreadDoubtsCount > 0 ? unreadDoubtsCount : null,
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      name: "Faculty Settings",
      href: "/trainer/settings",
      icon: (
        <svg className="trainer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
  ];

  return (
    <aside className={`trainer-sidebar ${isOpen ? "open" : ""}`}>
      <div>
        {/* Branding */}
        <div className="trainer-brand">
          <Link href="/trainer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src="/images/sarthi-logo.png" alt="SARTHI" className="trainer-brand-logo" />
            <div className="trainer-brand-text">
              <span className="trainer-brand-title">SARTHI</span>
              <span className="trainer-brand-subtitle">Faculty Command</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <ul className="trainer-nav-menu">
          {navItems.map((item) => {
            const isActive =
              item.href === "/trainer"
                ? pathname === "/trainer"
                : pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`trainer-nav-btn ${isActive ? "active" : ""}`}
                >
                  {item.icon}
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge && (
                    <span className="trainer-nav-badge">{item.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Area: Role Switcher & Trainer Profile */}
      <div className="trainer-sidebar-bottom">
        <div className="trainer-role-switch-card">
          <Link href="/dashboard" className="trainer-switch-btn" title="Switch to Student / Trainee Dashboard">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Switch to Student View</span>
          </Link>
        </div>

        <Link href="/trainer/settings" className="trainer-user-pill">
          <img
            src={trainer.avatar || "/images/student-img-1.jpg"}
            alt={trainer.name}
            className="trainer-user-avatar"
          />
          <div className="trainer-user-info">
            <span className="trainer-user-name">{trainer.name}</span>
            <span className="trainer-user-title">{trainer.title}</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}

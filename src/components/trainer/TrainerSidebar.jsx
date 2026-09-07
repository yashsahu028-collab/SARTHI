"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerSidebar() {
  const pathname = usePathname();
  const { trainer, submissions, certificates } = useTrainer();

  const pendingSubmissionsCount = (submissions || []).filter((s) => s.status === "pending").length;
  const pendingCertCount = (certificates || []).filter((c) => c.status === "pending_approval").length;

  // Streamlined, high-value navigation items only
  const navItems = [
    {
      name: "Dashboard",
      href: "/trainer",
      icon: (
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      name: "Courses",
      href: "/trainer/courses",
      icon: (
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      name: "Live Studio",
      href: "/trainer/live",
      icon: (
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <line x1="9" y1="12" x2="15" y2="12"></line>
          <line x1="9" y1="16" x2="13" y2="16"></line>
        </svg>
      ),
    },
    {
      name: "Trainees",
      href: "/trainer/students",
      icon: (
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      name: "Analytics",
      href: "/trainer/analytics",
      icon: (
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    },
    {
      name: "Certificates",
      href: "/trainer/certificates",
      badge: pendingCertCount > 0 ? pendingCertCount : null,
      icon: (
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/trainer/settings",
      icon: (
        <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
  ];

  return (
    <aside className="db-sidebar">
      <div>
        {/* Logo Branding */}
        <div className="db-sidebar-brand" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px", paddingBottom: "16px" }}>
          <Link href="/trainer" title="SARTHI Faculty Portal">
            <img
              src="/images/sarthi-logo-forest.png"
              alt="SARTHI Logo"
              className="db-brand-logo"
            />
          </Link>
          <span
            style={{
              fontSize: "9.5px",
              fontWeight: "800",
              color: "#059669",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              paddingLeft: "2px",
            }}
          >
            Faculty Command
          </span>
        </div>

        {/* Navigation Links with Unified Icons */}
        <ul className="db-nav-menu">
          {navItems.map((item) => {
            const isActive =
              item.href === "/trainer"
                ? pathname === "/trainer"
                : pathname.startsWith(item.href);

            return (
              <li key={item.name} className="db-nav-item">
                <Link
                  href={item.href}
                  className={`db-nav-btn ${isActive ? "active" : ""}`}
                >
                  {item.icon}
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge && (
                    <span
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "1px 7px",
                        borderRadius: "999px",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Area: Faculty Profile Chip (Clean, comfortable, never cut off) */}
      <div className="db-sidebar-bottom-area" style={{ borderTop: "1px solid var(--sarthi-border-light, #e2e8f0)", paddingTop: "12px" }}>
        <Link href="/trainer/settings" className="db-sidebar-user-pill" style={{ textDecoration: "none" }}>
          <div className="db-user-avatar-wrap">
            <img
              src={trainer.avatar || "/images/student-img-1.jpg"}
              alt={trainer.name}
              className="db-user-avatar"
            />
          </div>
          <div className="db-user-info-text">
            <div className="db-user-name">{trainer.name}</div>
            <div className="db-user-role">{trainer.title || "Scientist-F & Faculty"}</div>
          </div>
          <svg className="db-user-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </Link>
      </div>
    </aside>
  );
}

"use client";

import React, { useState } from "react";
import StudentShell from "@/components/dashboard/StudentShell";
import { useStudent } from "@/lib/services/StudentContext";
import { EmptyState } from "@/components/dashboard/StateViews";

export default function CertificatesPage() {
  const { certificates, student } = useStudent();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalCert, setActiveModalCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredCerts = certificates.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q));
  });

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = {
    total: certificates.length,
    honors: certificates.filter((c) => c.honors?.includes("Distinction") || c.honors?.includes("Honors")).length,
    avgScore: "93.3%",
  };

  return (
    <StudentShell
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search certificates by title, ID, or domain..."
    >
      <div style={{ padding: "28px 36px 64px", maxWidth: "1360px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Apple-style Page Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--sarthi-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              CREDENTIAL REPOSITORY
            </span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0", letterSpacing: "-0.6px" }}>
            Your Certificates
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, fontWeight: "400" }}>
            Officially verified credentials issued under the India Meteorological Department (IMD) Digital Capacity Building Framework.
          </p>
        </div>

        {/* 3 Clean Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box gold">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{stats.total}</span>
                <span className="db-stat-label">Certificates Earned</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{stats.honors}</span>
                <span className="db-stat-label">Distinctions</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box purple">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{stats.avgScore}</span>
                <span className="db-stat-label">Average Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCerts.length === 0 ? (
          <EmptyState
            title={certificates.length === 0 ? "No Certificates" : "No certificates match your query"}
            description={
              certificates.length === 0
                ? "Your certificates will appear here once you complete an eligible learning program."
                : `No credentials match "${searchQuery}". Try searching for another topic.`
            }
            actionLabel={certificates.length === 0 ? "Explore Courses" : "Clear Filter"}
            actionHref={certificates.length === 0 ? "/dashboard/courses" : undefined}
            onAction={certificates.length > 0 ? () => setSearchQuery("") : undefined}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px" }}>
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                {/* Certificate Preview Top Header */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #10b981 100%)",
                    padding: "20px 24px",
                    color: "#ffffff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, paddingRight: "12px" }}>
                    <span
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(6px)",
                        padding: "3px 9px",
                        borderRadius: "999px",
                        fontSize: "10px",
                        fontWeight: "700",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {cert.honors}
                    </span>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "10px 0 4px 0", lineHeight: 1.35, color: "#ffffff" }}>
                      {cert.title}
                    </h3>
                    <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }}>
                      {cert.authority}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#ffffff",
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0,
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    🏅
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Metadata Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div style={{ fontSize: "12.5px", color: "#6b7280" }}>
                      Issued: <strong style={{ color: "#374151" }}>{cert.issueDate}</strong>
                    </div>
                    <div style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--sarthi-primary)" }}>
                      Score: {cert.score}%
                    </div>
                  </div>

                  {/* Verification ID chip */}
                  <div
                    style={{
                      background: "#f9fafb",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>
                      Credential ID: <code style={{ fontWeight: "700", color: "#111827", marginLeft: "4px" }}>{cert.id}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(cert.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--sarthi-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {copiedId === cert.id ? "✓ Copied" : "Copy ID"}
                    </button>
                  </div>

                  {/* Primary Action */}
                  <button
                    onClick={() => setActiveModalCert(cert)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      background: "#f0fdf4",
                      color: "var(--sarthi-primary)",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>View Certificate</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Secondary Details Modal */}
        {activeModalCert && (
          <div
            onClick={() => setActiveModalCert(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                maxWidth: "680px",
                width: "100%",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Modal Top Bar */}
              <div
                style={{
                  background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
                  padding: "24px 32px",
                  color: "#ffffff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6ee7b7" }}>
                    OFFICIAL IMD VERIFIED CREDENTIAL
                  </span>
                  <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "4px 0 0 0", color: "#ffffff" }}>
                    {activeModalCert.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModalCert(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: "28px 32px" }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 6px 0" }}>This certifies that</p>
                  <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>
                    {student.name || "Mohit Raj"}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: 1.5 }}>
                    has successfully satisfied all rigorous operational coursework, simulation lab benchmarks, and passed with an assessment score of{" "}
                    <strong style={{ color: "var(--sarthi-primary)" }}>{activeModalCert.score}% ({activeModalCert.honors})</strong>.
                  </p>
                </div>

                {/* Verified Competencies */}
                <div style={{ marginBottom: "24px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Verified Competencies & Syllabus
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    {activeModalCert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#065f46",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Metadata Strip */}
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>Credential Verification Key</div>
                    <code style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>{activeModalCert.id}</code>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>Issued Date</div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{activeModalCert.issueDate}</div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => {
                      alert(`Printing / Downloading official certificate PDF for ${activeModalCert.id}...`);
                    }}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "10px",
                      border: "none",
                      background: "var(--sarthi-primary)",
                      color: "#ffffff",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <span>Download PDF Credential</span>
                  </button>
                  <button
                    onClick={() => handleCopy(activeModalCert.id)}
                    style={{
                      padding: "11px 20px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      background: "#ffffff",
                      color: "#374151",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {copiedId === activeModalCert.id ? "✓ Copied" : "Copy ID"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}

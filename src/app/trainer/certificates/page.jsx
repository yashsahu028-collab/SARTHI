"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerCertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { certificates, approveCertificate, batchApproveCertificates } = useTrainer();

  const pendingCerts = certificates.filter((c) => c.status === "pending_approval");
  const approvedCerts = certificates.filter((c) => c.status === "approved");

  const filteredCerts = certificates.filter((c) =>
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search certificates by trainee or cert number...">
      <div style={{ padding: "28px 36px 64px 36px", maxWidth: "1360px", margin: "0 auto", width: "100%" }}>
        {/* Page Header (Apple Design Hierarchy) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--sarthi-emerald, #059669)" }} />
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#065f46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                ACADEMIC CREDENTIALS & DIGITAL SIGN-OFF
              </span>
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--sarthi-text-heading, #0a2920)", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Certificate Approvals & Endorsements
            </h1>
            <p style={{ fontSize: "14px", color: "var(--sarthi-text-muted, #64748b)", margin: 0, maxWidth: "680px" }}>
              Endorse official IMD course completion credentials with faculty digital signatures and QR verification.
            </p>
          </div>

          {pendingCerts.length > 0 && (
            <button
              type="button"
              className="db-btn-primary"
              onClick={batchApproveCertificates}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: "13.5px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Batch Endorse All ({pendingCerts.length})</span>
            </button>
          )}
        </div>

        {/* 3 Top KPI Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value" style={{ color: "#d97706" }}>{pendingCerts.length}</span>
                <span className="db-stat-label">Pending Endorsement</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">{approvedCerts.length}</span>
                <span className="db-stat-label">Issued & Sealed</span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-left">
              <div className="db-stat-icon-box gold">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="db-stat-data">
                <span className="db-stat-value">100%</span>
                <span className="db-stat-label">QR Verification Integrity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Table */}
        <div style={{ background: "#ffffff", border: "1px solid var(--sarthi-border, #e2e8f0)", borderRadius: "18px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--sarthi-border, #e2e8f0)", color: "var(--sarthi-text-muted, #64748b)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Trainee Name</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Course Completed</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Division</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Grade</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Certificate ID</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700" }}>Status</th>
                  <th style={{ padding: "12px 14px", fontWeight: "700", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} style={{ borderBottom: "1px solid var(--sarthi-border, #f1f5f9)" }}>
                    <td style={{ padding: "14px" }}>
                      <div style={{ fontWeight: "700", color: "var(--sarthi-text-heading, #0a2920)" }}>{cert.studentName}</div>
                      <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>{cert.studentEmail}</div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ fontWeight: "600", color: "var(--sarthi-text-heading, #0a2920)" }}>{cert.courseTitle}</div>
                      <div style={{ fontSize: "11px", color: "var(--sarthi-text-muted, #64748b)" }}>Completed: {cert.completionDate}</div>
                    </td>
                    <td style={{ padding: "14px", color: "var(--sarthi-text-body, #334155)" }}>{cert.division}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ fontWeight: "800", color: "#059669" }}>{cert.finalGrade}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <code style={{ fontSize: "11.5px", background: "var(--sarthi-surface-subtle, #f8faf9)", padding: "3px 8px", borderRadius: "6px", border: "1px solid var(--sarthi-border, #e2e8f0)", color: "var(--sarthi-text-heading, #0a2920)" }}>
                        {cert.certificateNumber}
                      </code>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "3px 9px",
                          borderRadius: "999px",
                          background: cert.status === "approved" ? "#dcfce7" : "#fef3c7",
                          color: cert.status === "approved" ? "#166534" : "#92400e",
                          border: cert.status === "approved" ? "1px solid #bbf7d0" : "1px solid #fde68a",
                        }}
                      >
                        {cert.status === "approved" ? "ISSUED & SEALED" : "PENDING SIGN-OFF"}
                      </span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      {cert.status === "pending_approval" ? (
                        <button
                          type="button"
                          className="db-btn-primary"
                          style={{ padding: "6px 14px", fontSize: "12px", borderRadius: "8px" }}
                          onClick={() => approveCertificate(cert.id)}
                        >
                          Sign & Endorse
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#059669", fontWeight: "700" }}>
                          ✓ Sealed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TrainerShell>
  );
}

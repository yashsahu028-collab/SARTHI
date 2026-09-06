"use client";

import React, { useState } from "react";
import TrainerShell from "@/components/trainer/TrainerShell";
import { useTrainer } from "@/lib/services/TrainerContext";

export default function TrainerCertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { certificates, approveCertificate, batchApproveCertificates, setActiveModal } = useTrainer();

  const pendingCerts = certificates.filter((c) => c.status === "pending_approval");
  const approvedCerts = certificates.filter((c) => c.status === "approved");

  const filteredCerts = certificates.filter((c) =>
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TrainerShell searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search certificates by trainee or cert number...">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--tr-text-heading)", margin: "0 0 4px 0" }}>
            Certificate Approvals & Digital Sign-Offs
          </h1>
          <p style={{ fontSize: "14px", color: "var(--tr-text-muted)", margin: 0 }}>
            Endorse official IMD course completion credentials with faculty digital signatures and QR verification.
          </p>
        </div>

        {pendingCerts.length > 0 && (
          <button
            type="button"
            className="trainer-quick-btn trainer-btn-green"
            onClick={batchApproveCertificates}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Batch Endorse All ({pendingCerts.length})</span>
          </button>
        )}
      </div>

      {/* STATS STRIP */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#d97706" }}>{pendingCerts.length}</div>
          <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)" }}>Pending Faculty Endorsement</div>
        </div>
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#059669" }}>{approvedCerts.length}</div>
          <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)" }}>Issued & Sealed</div>
        </div>
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "var(--tr-radius-md)", border: "1px solid var(--tr-border)" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--tr-primary)" }}>100%</div>
          <div style={{ fontSize: "12.5px", color: "var(--tr-text-muted)" }}>MoES QR Verification Integrity</div>
        </div>
      </div>

      {/* CERTIFICATES TABLE */}
      <div className="trainer-section-card">
        <div className="trainer-table-wrap">
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Trainee</th>
                <th>Course Completed</th>
                <th>Division</th>
                <th>Grade Attained</th>
                <th>Certificate ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCerts.map((cert) => (
                <tr key={cert.id}>
                  <td>
                    <div style={{ fontWeight: "700", color: "var(--tr-text-heading)" }}>{cert.studentName}</div>
                    <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>{cert.studentEmail}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: "600", color: "var(--tr-text-heading)" }}>{cert.courseTitle}</div>
                    <div style={{ fontSize: "11px", color: "var(--tr-text-muted)" }}>Completed: {cert.completionDate}</div>
                  </td>
                  <td>{cert.division}</td>
                  <td>
                    <span style={{ fontWeight: "800", color: "#059669" }}>{cert.finalGrade}</span>
                  </td>
                  <td>
                    <code style={{ fontSize: "12px", background: "var(--tr-surface-alt)", padding: "2px 6px", borderRadius: "4px" }}>
                      {cert.certificateNumber}
                    </code>
                  </td>
                  <td>
                    <span className={`trainer-status-tag ${cert.status === "approved" ? "tag-graded" : "tag-pending"}`}>
                      {cert.status === "approved" ? "ISSUED & SEALED" : "PENDING SIGN-OFF"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="trainer-quick-btn trainer-btn-outline"
                        style={{ height: "30px", padding: "0 10px", fontSize: "11.5px" }}
                        onClick={() => setActiveModal({ type: "certificate_preview", data: cert })}
                      >
                        Preview Seal
                      </button>
                      {cert.status === "pending_approval" && (
                        <button
                          type="button"
                          className="trainer-quick-btn trainer-btn-green"
                          style={{ height: "30px", padding: "0 10px", fontSize: "11.5px" }}
                          onClick={() => approveCertificate(cert.id)}
                        >
                          Sign & Issue
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TrainerShell>
  );
}

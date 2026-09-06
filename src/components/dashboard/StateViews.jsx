"use client";

import React from "react";
import Link from "next/link";

/**
 * Apple-style Calm Zero/Empty State Card
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}) {
  return (
    <div className={`db-empty-state ${className}`}>
      <div className="db-empty-icon-ring">
        {icon || (
          <svg className="db-empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        )}
      </div>
      <h3 className="db-empty-title">{title}</h3>
      <p className="db-empty-desc">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <div className="db-empty-action-wrap">
          {actionHref ? (
            <Link href={actionHref} className="db-empty-btn">
              {actionLabel}
            </Link>
          ) : (
            <button onClick={onAction} className="db-empty-btn">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Apple-style Error State Card with Retry Action
 */
export function ErrorState({
  title = "We couldn't load this right now",
  description = "Please verify your connection or try refreshing the request.",
  onRetry,
  className = "",
}) {
  return (
    <div className={`db-error-state ${className}`}>
      <div className="db-error-icon-ring">
        <svg className="db-error-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="db-error-title">{title}</h3>
      <p className="db-error-desc">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="db-error-btn">
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Layout-Preserving Skeleton Loaders
 */
export function CardSkeleton({ count = 3, className = "" }) {
  return (
    <div className={`db-skeleton-grid ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="db-skeleton-card">
          <div className="db-skeleton db-sk-thumb" />
          <div className="db-sk-content">
            <div className="db-skeleton db-sk-tag" />
            <div className="db-skeleton db-sk-title" />
            <div className="db-skeleton db-sk-sub" />
            <div className="db-skeleton db-sk-bar" />
            <div className="db-skeleton db-sk-btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton({ rows = 4, className = "" }) {
  return (
    <div className={`db-skeleton-rows ${className}`}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="db-skeleton db-sk-row" />
      ))}
    </div>
  );
}

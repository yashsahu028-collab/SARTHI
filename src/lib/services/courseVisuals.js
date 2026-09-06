"use client";

import React, { useState } from "react";

// Centralized Course Visual System
// Enforces 16:9 topic-relevant meteorology thumbnails with graceful local fallbacks.

export const COURSE_VISUALS = {
  "satellite-meteorology": {
    thumbnailUrl: "/images/satellite-meteorology-thumb.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    alt: "Satellite Meteorology & Remote Sensing — Earth orbital observation",
  },
  "nwp-modeling": {
    thumbnailUrl: "/images/nwp-modeling-thumb.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    alt: "Numerical Weather Prediction (NWP) Modeling — Atmospheric fluid dynamics",
  },
  "doppler-radar-dynamics": {
    thumbnailUrl: "/images/doppler-radar-thumb.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop&q=80",
    alt: "Doppler Weather Radar (DWR) & Severe Storm Dynamics — Reflectivity tracking",
  },
  "climate-trend-analytics": {
    thumbnailUrl: "/images/monsoon-climate-thumb.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1514632595-4944383f2737?w=800&auto=format&fit=crop&q=80",
    alt: "Monsoon Synoptic Forecasting & Climate Trends — Subtropical jet stream dynamics",
  },
  "monsoon-synoptics": {
    thumbnailUrl: "/images/monsoon-climate-thumb.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1514632595-4944383f2737?w=800&auto=format&fit=crop&q=80",
    alt: "Monsoon Synoptic Forecasting & Climate Trends — Subtropical jet stream dynamics",
  },
  "agrometeorology": {
    thumbnailUrl: "/images/monsoon-climate-thumb.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
    alt: "Agrometeorology & Crop Weather Advisory — Evapotranspiration canopy mapping",
  },
};

export function getCourseVisual(courseId) {
  if (courseId && COURSE_VISUALS[courseId]) {
    return COURSE_VISUALS[courseId];
  }
  // Generic safe meteorological fallback
  return {
    thumbnailUrl: "/images/satellite-meteorology-thumb.jpg",
    fallbackUrl: "/images/course-thumbnail-img-02.jpg",
    alt: "SARTHI IMD Meteorological Course",
  };
}

/**
 * Reusable 16:9 Course Thumbnail with automatic fallback
 */
export function CourseThumbnail({
  courseId,
  src,
  alt,
  className = "",
  badge = null,
  priority = false,
}) {
  const visual = getCourseVisual(courseId);
  const [hasError, setHasError] = useState(false);
  const currentSrc = hasError ? visual.fallbackUrl : (src || visual.thumbnailUrl);

  return (
    <div className={`db-course-thumb-container ${className}`}>
      <img
        src={currentSrc}
        alt={alt || visual.alt}
        loading={priority ? "eager" : "lazy"}
        className="db-course-thumb-img"
        onError={() => setHasError(true)}
      />
      {badge && <div className="db-thumb-badge">{badge}</div>}
    </div>
  );
}

import Link from "next/link";
import Navbar from "@/components/interactive/Navbar";
import { initialCourses } from "@/lib/services/studentData";

export const metadata = {
  title: "Courses – SARTHI | IMD, Ministry of Earth Sciences",
  description: "Explore interactive meteorological training courses and specialized programs offered by IMD on SARTHI.",
};

export default function Page() {
  return (
    <>
      <div className="header-area">
        <div className="regular-bg-wrap">
          <div className="regular-bg-pattern-wrap">
            <img
              src="/images/regular-banner-bg-pattern.png"
              loading="eager"
              alt="Regular BG Pattern"
              className="header-bg-pattern"
            />
          </div>
        </div>
        <Navbar activePage="courses" />
        <section className="header-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="header-wrap">
              <div className="regular-subtitle">
                <div className="regular-subtitle-icon"></div>
                <div>ACADEMIC CURRICULUM</div>
              </div>
              <div className="header-title-wrap large">
                <h1 className="banner-title">
                  Meteorological Training &amp; Capacity Building Courses
                </h1>
              </div>
              <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "16px", marginTop: "12px", maxWidth: "700px" }}>
                Specialized professional programs in Satellite Meteorology, Numerical Weather Prediction, Doppler Weather Radar, and Monsoon Dynamics designed by IMD scientists.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="regular-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="section-title-area">
            <div className="regular-subtitle">
              <div className="regular-subtitle-icon"></div>
              <div className="regular-subtitle-text">Featured Training Program</div>
            </div>
            <div className="section-title-wrap small">
              <h2 className="section-title">
                Flagship Satellite Meteorology Track
              </h2>
            </div>
          </div>

          <div className="featured-area">
            <div className="w-dyn-list">
              <div role="list" className="w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <div className="course-card featured">
                    <div className="course-image-area featured-image">
                      <Link
                        href="/courses/deep-learning"
                        className="course-image-wrap w-inline-block"
                      >
                        <img
                          src="/images/satellite-meteorology-thumb.jpg"
                          loading="eager"
                          alt="Satellite Meteorology & Remote Sensing"
                          className="course-initial-image"
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      </Link>
                      <div className="course-offer" style={{ fontSize: "12px", letterSpacing: "0.04em", padding: "6px 14px" }}>
                        <div>IMD Certified</div>
                      </div>
                      <div className="image-overlay white-smoke-bg"></div>
                    </div>
                    <div className="course-content-area">
                      <div className="course-title-wrap">
                        <div className="regular-grow-line-wrap">
                          <Link
                            href="/courses/deep-learning"
                            className="course-title"
                          >
                            Satellite Meteorology &amp; Remote Sensing
                          </Link>
                          <div className="regular-grow-line"></div>
                        </div>
                        <Link
                          href="/team/prof-david-lee"
                          className="author-link"
                        >
                          Dr. R. K. Sharma (Scientist-F, IMD New Delhi)
                        </Link>
                      </div>
                      <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.55", margin: "10px 0 16px 0" }}>
                        Deep dive into geostationary and polar-orbiting meteorological satellites, INSAT-3D/3DR radiance calibration, and multi-spectral convective cloud tracking.
                      </p>
                      <div className="course-details-area featured">
                        <div className="course-details-card">
                          <div className="course-icon-wrap bottom">
                            <img
                              src="/images/course-icon-01.svg"
                              loading="eager"
                              alt="Lessons"
                              className="course-icon"
                            />
                          </div>
                          <div className="course-details-text-wrap">
                            <p className="course-details-text">48</p>
                            <p className="course-details-text">Lessons</p>
                          </div>
                        </div>
                        <div className="course-line-break"></div>
                        <div className="course-details-card">
                          <div className="course-icon-wrap">
                            <img
                              src="/images/course-icon-02.svg"
                              loading="eager"
                              alt="Duration"
                              className="course-icon"
                            />
                          </div>
                          <p className="course-details-text">18h Total</p>
                        </div>
                        <div className="course-line-break"></div>
                        <div className="course-details-card">
                          <div className="course-icon-wrap">
                            <img
                              src="/images/course-icon-03.svg"
                              loading="eager"
                              alt="Rating"
                              className="course-icon"
                            />
                          </div>
                          <p className="course-details-text">4.9 ★</p>
                        </div>
                      </div>
                      <div className="course-read-button">
                        <Link
                          href="/courses/deep-learning"
                          className="white-button w-inline-block"
                        >
                          <div className="button-text">Enroll Now</div>
                          <div className="button-bg green-bg"></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: All IMD Courses Grid (identical to Dashboard) */}
          <div style={{ marginTop: "64px" }}>
            <div className="section-title-area">
              <div className="regular-subtitle">
                <div className="regular-subtitle-icon"></div>
                <div className="regular-subtitle-text">IMD Portal Courses ({initialCourses.length})</div>
              </div>
              <div className="section-title-wrap small">
                <h2 className="section-title">
                  All Atmospheric &amp; Weather Prediction Programs
                </h2>
              </div>
              <p style={{ color: "#64748b", fontSize: "14.5px", marginTop: "6px" }}>
                Accredited specialized learning tracks with comprehensive modules, practical labs, and live assessments.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                marginTop: "28px",
              }}
            >
              {initialCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "16 / 9", width: "100%", overflow: "hidden", background: "#f1f5f9" }}>
                    <Link href="/courses/deep-learning" style={{ display: "block", width: "100%", height: "100%" }}>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </Link>
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(11, 61, 46, 0.85)",
                        backdropFilter: "blur(6px)",
                        color: "#ffffff",
                        fontSize: "10.5px",
                        fontWeight: "700",
                        padding: "3px 9px",
                        borderRadius: "6px",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        zIndex: 2,
                      }}
                    >
                      {course.category}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(255, 255, 255, 0.92)",
                        backdropFilter: "blur(6px)",
                        color: "#065f46",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        zIndex: 2,
                      }}
                    >
                      {course.level}
                    </div>
                  </div>

                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
                    <Link
                      href="/courses/deep-learning"
                      style={{
                        fontSize: "16.5px",
                        fontWeight: "700",
                        color: "#0f172a",
                        lineHeight: "1.35",
                        textDecoration: "none",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "44px",
                      }}
                    >
                      {course.title}
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={course.instructor?.avatar || "/images/student-img-1.jpg"}
                        alt=""
                        aria-hidden="true"
                        style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
                        {course.instructor?.name}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#64748b",
                        lineHeight: "1.5",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flex: 1,
                      }}
                    >
                      {course.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                        marginTop: "auto",
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      <span>{course.totalLessons} Lessons</span>
                      <span>•</span>
                      <span>{course.durationHours}h total</span>
                      <span>•</span>
                      <span style={{ color: "#059669" }}>4.8 ★</span>
                    </div>

                    <div style={{ marginTop: "6px" }}>
                      <Link
                        href="/courses/deep-learning"
                        className="white-button w-inline-block"
                        style={{ width: "100%", textAlign: "center", display: "block", padding: "9px 14px", borderRadius: "999px" }}
                      >
                        <div className="button-text" style={{ fontSize: "13px" }}>View Course →</div>
                        <div className="button-bg green-bg"></div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section near footer */}
      <section className="cta-section">
        <div className="cta-bg-wrap">
          <div className="cta-bg-pattern-wrap">
            <img
              src="/images/regular-banner-bg-pattern.png"
              loading="lazy"
              sizes="(max-width: 3840px) 100vw, 3840px"
              srcSet="/images/regular-banner-bg-pattern-p-500.png 500w, /images/regular-banner-bg-pattern-p-800.png 800w, /images/regular-banner-bg-pattern-p-1080.png 1080w, /images/regular-banner-bg-pattern-p-1600.png 1600w, /images/regular-banner-bg-pattern-p-2000.png 2000w, /images/regular-banner-bg-pattern-p-2600.png 2600w, /images/regular-banner-bg-pattern-p-3200.png 3200w, /images/regular-banner-bg-pattern.png 3840w"
              alt="Regular BG Pattern"
              className="cta-bg-pattern"
            />
          </div>
        </div>
        <div className="cta-whole-area">
          <div className="cta-area">
            <div className="w-layout-blockcontainer container w-container">
              <div className="cta-wrap">
                <div className="cta-title-wrap">
                  <h2 className="section-title text-white">
                    Build Skills. Build Capacity. Build SARTHI.
                  </h2>
                </div>
                <div className="cta-content-area">
                  <p className="cta-content">
                    Join SARTHI to strengthen your meteorological expertise and
                    empower IMD&apos;s scientific mission.
                  </p>
                  <div className="cta-button-wrap">
                    <Link
                      href="/contact"
                      className="secondary-button w-inline-block"
                    >
                      <div className="button-text">Sign Up Free</div>
                      <div className="button-bg"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cta-image-area">
            <div className="cta-image-wrap">
              <img
                src="/images/cta-robo-img.png"
                loading="lazy"
                sizes="(max-width: 960px) 100vw, 960px"
                srcSet="/images/cta-robo-img-p-500.png 500w, /images/cta-robo-img.png 960w"
                alt="Green robot character holding a stack of three books in its arms."
                className="cta-image"
              />
              <div className="cta-eye-animation">
                <div className="cta-eye"></div>
              </div>
              <div className="cta-eye-animation right">
                <div className="cta-eye"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="footer-top-wrap">
            <div className="footer-widget-area">
              <div className="footer-widget-wrap small">
                <div className="footer-widget-link-area contact">
                  <p className="footer-widget-title">Contact</p>
                  <div className="footer-widget-link-wrap">
                    <a
                      href="mailto:sarthi.support@imd.gov.in"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">
                        sarthi.support@imd.gov.in
                      </div>
                    </a>
                    <a
                      href="tel:+911124631913"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">+91 11 2463 1913</div>
                    </a>
                  </div>
                </div>
                <div className="footer-widget-link-area medium">
                  <p className="footer-widget-title">Address</p>
                  <div className="footer-widget-link-wrap">
                    <p className="footer-widget-text">
                      India Meteorological Department, Ministry of Earth
                      Sciences, Mausam Bhawan, Lodi Road, New Delhi 110003
                    </p>
                  </div>
                </div>
              </div>
              <div className="footer-widget-wrap">
                <div className="footer-widget-link-area">
                  <p className="footer-widget-title">Main Pages</p>
                  <div className="footer-widget-link-wrap">
                    <Link
                      href="/home"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Home</div>
                    </Link>
                    <Link
                      href="/about"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">About</div>
                    </Link>
                    <Link
                      href="/events"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Events</div>
                    </Link>
                    <Link
                      href="/membership"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">User Roles</div>
                    </Link>
                    <Link
                      href="/contact"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Contact</div>
                    </Link>
                  </div>
                </div>
                <div className="footer-widget-link-area">
                  <p className="footer-widget-title">CMS</p>
                  <div className="footer-widget-link-wrap">
                    <Link
                      href="/courses"
                      className="footer-widget-link w-inline-block w--current"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Courses</div>
                    </Link>
                    <Link
                      href="/blog"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Blog</div>
                    </Link>
                    <Link
                      href="/team"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Team</div>
                    </Link>
                  </div>
                </div>
                <div className="footer-widget-link-area">
                  <p className="footer-widget-title">Utility Pages</p>
                  <div className="footer-widget-link-wrap">
                    <Link
                      href="/template-info/style-guide"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Style Guide</div>
                    </Link>
                    <Link
                      href="/template-info/licenses"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Licenses</div>
                    </Link>
                    <Link
                      href="/template-info/changelog"
                      className="footer-widget-link w-inline-block"
                    >
                      <div className="footer-widget-icon"></div>
                      <div className="footer-widget-text">Changelog</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-title-area">
              <div className="footer-title-wrap">
                <Link href="/home" className="footer-title">
                  S
                </Link>
                <Link href="/home" className="footer-title">
                  A
                </Link>
                <Link href="/home" className="footer-title">
                  R
                </Link>
                <Link href="/home" className="footer-title">
                  T
                </Link>
                <Link href="/home" className="footer-title">
                  H
                </Link>
                <Link href="/home" className="footer-title">
                  I
                </Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom-wrap">
            <div className="footer-copyright-text-wrap">
              <p className="footer-copyright-text">
                Copyright © SARTHI — India Meteorological Department, Ministry of
                Earth Sciences
              </p>
            </div>
            <div className="footer-social-wrap">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon-wrap w-inline-block"
              >
                <img
                  src="/images/footer-facebook.svg"
                  loading="lazy"
                  alt="Facebook symbol"
                  className="footer-social-icon"
                />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon-wrap w-inline-block"
              >
                <img
                  src="/images/footer-instagram.svg"
                  loading="lazy"
                  alt="Instagram symbol"
                  className="footer-social-icon"
                />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon-wrap w-inline-block"
              >
                <img
                  src="/images/footer-linkdin.svg"
                  loading="lazy"
                  alt="linkedin symbol"
                  className="footer-social-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

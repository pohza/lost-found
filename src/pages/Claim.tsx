import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { authHeaders } from "../api";

type ItemStatus = "lost" | "found";

interface ClaimItemSummary {
  id: string;
  title: string;
  lostTime: string;
  date: string;
  location: string;
  imageUrl: string;
  status: ItemStatus;
}

interface ClaimFormValues {
  fullName: string;
  contactEmail: string;
  contactNumber: string;
  description: string;
  serialNumber: string;
  evidencePhoto: File | null;
}

function ReportIconUser() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Z"
        stroke="#1E3A5F"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="#1E3A5F"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReportIconMail() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 7.5h15v9h-15v-9Z"
        stroke="#1E3A5F"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8.5 12 13l6.5-4.5"
        stroke="#1E3A5F"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReportIconPhone() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.2 3.8 6.7 5.3c-.7.7-.9 1.8-.5 2.7 1.2 2.7 3.3 5.9 6.7 9.3s6.6 5.5 9.3 6.7c.9.4 2 .2 2.7-.5l1.5-1.5c.5-.5.5-1.3 0-1.8l-2.4-2.4c-.4-.4-1-.5-1.5-.2l-1.8 1c-.6.3-1.3.3-1.9 0-1.4-.7-3.3-2-5.4-4.1s-3.4-4-4.1-5.4c-.3-.6-.3-1.3 0-1.9l1-1.8c.3-.5.2-1.1-.2-1.5L10 3.8c-.5-.5-1.3-.5-1.8 0Z"
        stroke="#1E3A5F"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClaimPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ClaimItemSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState(false);

  const [values, setValues] = useState<ClaimFormValues>({
    fullName: "",
    contactEmail: "",
    contactNumber: "",
    description: "",
    serialNumber: "",
    evidencePhoto: null,
  });
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ไม่พบรายการ");
      return;
    }

    let cancelled = false;

    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/items/${id}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as ClaimItemSummary;
        if (!cancelled) setItem(data);
      } catch {
        if (!cancelled) {
          setItem(null);
          setError("ไม่พบรายการ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItem();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitOk(false);
    try {
      if (values.evidencePhoto) {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("contactEmail", values.contactEmail);
        formData.append("contactNumber", values.contactNumber);
        formData.append("description", values.description);
        formData.append("serialNumber", values.serialNumber);
        formData.append("evidencePhoto", values.evidencePhoto);
        const res = await fetch(`/api/items/${id}/claim`, {
          method: "POST",
          headers: authHeaders(),
          body: formData,
        });
        if (!res.ok) throw new Error("Failed");
      } else {
        const res = await fetch(`/api/items/${id}/claim`, {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({
            fullName: values.fullName,
            contactEmail: values.contactEmail,
            contactNumber: values.contactNumber,
            description: values.description,
            serialNumber: values.serialNumber || undefined,
          }),
        });
        if (!res.ok) throw new Error("Failed");
      }
      setSubmitOk(true);
    } catch {
      setSubmitError("ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner home-topbar-inner">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          <nav className="home-nav">
            <Link to="/home" className="home-nav-link">
              HOME
            </Link>
            <Link to="/claims" className="home-nav-link">
              CLAIM
            </Link>
            <Link to="/report" className="home-nav-link">
              REPORT
            </Link>
            <Link to="/notifications" className="home-nav-link">
              NOTIFICATION
            </Link>
            <Link to="/messages" className="home-nav-link">
              MESSAGES
            </Link>
            <Link to="/profile" className="home-avatar-link">
              <img
                src={profileAvatar}
                alt="Profile"
                className="home-avatar-image"
              />
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <div className="home-search-wrapper">
          <div className="home-search-box">
            <span className="home-search-icon">🔍</span>
            <input
              type="text"
              className="home-search-input"
              placeholder="Search for..."
              readOnly
              aria-label="Search"
            />
          </div>
        </div>

        <section className="home-list-section">
          <div className="home-tabs">
            <Link
              to="/home"
              className={`home-tab ${item?.status === "lost" ? "active" : ""}`}
            >
              Lost Items
            </Link>
            <Link
              to="/home"
              className={`home-tab ${item?.status === "found" ? "active" : ""}`}
            >
              Found Items
            </Link>
          </div>

          <div className="claim-card-wrapper">
            {loading && <p className="detail-message">กำลังโหลด...</p>}
            {error && !loading && <p className="detail-message">{error}</p>}

            {item && !loading && (
              <article className="claim-card">
                <div className="claim-top">
                  <div className="claim-image-frame">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="claim-image"
                    />
                  </div>

                  <div className="claim-summary">
                    <h1 className="claim-title">{item.title}</h1>
                    <p className="claim-meta">
                      {item.status === "found" ? "เจอเวลา" : "หายเมื่อ"}: {item.lostTime}{" "}
                      <span className="home-item-separator">วันที่:</span>{" "}
                      {item.date}
                    </p>
                    <p className="claim-meta">
                      {item.status === "found" ? "เจอสถานที่" : "หายที่"}: {item.location}
                    </p>
                  </div>
                </div>

                <p className="claim-hint">Enter your details below</p>

                <form className="claim-form" onSubmit={onSubmit}>
                  <label className="report-field">
                    <span className="report-field-label">Full Name</span>
                    <div className="claim-input-with-icon">
                      <span className="claim-input-icon">
                        <ReportIconUser />
                      </span>
                      <input
                        type="text"
                        className="report-input"
                        placeholder="Placeholder"
                        value={values.fullName}
                        onChange={(e) =>
                          setValues((p) => ({ ...p, fullName: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </label>

                  <div className="claim-field-row">
                    <label className="report-field">
                      <span className="report-field-label">Contact Email</span>
                      <div className="claim-input-with-icon">
                        <span className="claim-input-icon">
                          <ReportIconMail />
                        </span>
                        <input
                          type="email"
                          className="report-input"
                          placeholder="Placeholder"
                          value={values.contactEmail}
                          onChange={(e) =>
                            setValues((p) => ({
                              ...p,
                              contactEmail: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </label>

                    <label className="report-field">
                      <span className="report-field-label">Contact Number</span>
                      <div className="claim-input-with-icon">
                        <span className="claim-input-icon">
                          <ReportIconPhone />
                        </span>
                        <input
                          type="tel"
                          className="report-input"
                          placeholder="Placeholder"
                          value={values.contactNumber}
                          onChange={(e) =>
                            setValues((p) => ({
                              ...p,
                              contactNumber: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </label>
                  </div>

                  <label className="report-field">
                    <span className="report-field-label">Description (หลักฐานความเป็นเจ้าของ)</span>
                    <textarea
                      className="report-textarea claim-textarea"
                      placeholder="กรอกรายละเอียดของ รุ่น ประมาณนี้ อันนี้ใส่ละเอียดขึ้น"
                      value={values.description}
                      onChange={(e) =>
                        setValues((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      rows={6}
                      required
                    />
                  </label>

                  <label className="report-field">
                    <span className="report-field-label">Serial number (ถ้ามี)</span>
                    <div className="claim-input-with-icon">
                      <span className="claim-input-icon">
                        <ReportIconUser />
                      </span>
                      <input
                        type="text"
                        className="report-input"
                        placeholder="เช่น หมายเลขเครื่อง, S/N"
                        value={values.serialNumber}
                        onChange={(e) =>
                          setValues((p) => ({ ...p, serialNumber: e.target.value }))
                        }
                      />
                    </div>
                  </label>

                  <div className="report-field">
                    <span className="report-field-label">รูปหลักฐาน (ถ้ามี)</span>
                    {!evidencePreviewUrl ? (
                      <label className="report-upload-box claim-evidence-upload">
                        <input
                          type="file"
                          accept="image/*"
                          className="report-upload-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setValues((p) => ({ ...p, evidencePhoto: file }));
                            setEvidencePreviewUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev);
                              return file ? URL.createObjectURL(file) : null;
                            });
                          }}
                        />
                        <span className="report-upload-icon-text">เลือกรูปหลักฐาน</span>
                      </label>
                    ) : (
                      <div className="report-upload-preview">
                        <img
                          src={evidencePreviewUrl}
                          alt="Evidence preview"
                          className="report-upload-preview-image"
                        />
                        <button
                          type="button"
                          className="report-upload-clear"
                          onClick={() => {
                            setValues((p) => ({ ...p, evidencePhoto: null }));
                            setEvidencePreviewUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev);
                              return null;
                            });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {submitError && (
                    <p className="claim-submit-error">{submitError}</p>
                  )}
                  {submitOk && (
                    <p className="claim-submit-ok">ส่งคำขอสำเร็จ</p>
                  )}

                  <div className="report-actions">
                    <button
                      type="button"
                      className="report-secondary-button"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="report-primary-button"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Claim"}
                    </button>
                  </div>
                </form>
              </article>
            )}
          </div>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default ClaimPage;


import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import itemIcon from "./../assets/fi-rr-shopping-bag.png";
import locationIcon from "./../assets/Vector.png";
import timeIcon from "./../assets/fi-rr-time-oclock.png";
import pictureIcon from "./../assets/fi-rr-picture.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { authHeaders } from "../api";

interface LostItemFormValues {
  itemName: string;
  location: string;
  dateTime: string;
  description: string;
  photo?: File | null;
}

function ReportLostPage() {
  const { id: editId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<LostItemFormValues>({
    itemName: "",
    location: "",
    dateTime: "",
    description: "",
    photo: null,
  });
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  useEffect(() => {
    if (!editId) {
      setLoadingEdit(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/items/${editId}`, { headers: authHeaders() });
        if (!res.ok) return;
        const data = (await res.json()) as {
          title: string;
          date: string;
          lostTime: string;
          location: string;
          description: string;
          imageUrl?: string;
        };
        if (cancelled) return;
        const dateOnly = data.date ? String(data.date).slice(0, 10) : "";
        const timePart = data.lostTime ? String(data.lostTime).slice(0, 5) : "00:00";
        const dateTime = dateOnly ? `${dateOnly}T${timePart}` : "";
        setFormValues((prev) => ({
          ...prev,
          itemName: data.title,
          location: data.location,
          dateTime: dateTime || prev.dateTime,
          description: data.description || "",
        }));
        if (data.imageUrl) setPhotoPreviewUrl(data.imageUrl);
      } catch {
        if (!cancelled) setLoadingEdit(false);
      } finally {
        if (!cancelled) setLoadingEdit(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId]);

  const handleChange = (
    field: keyof LostItemFormValues,
    value: string | File | null,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (file: File | null) => {
    setFormValues((prev) => ({
      ...prev,
      photo: file,
    }));

    setPhotoPreviewUrl((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editId) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const payload = {
          type: "lost",
          itemName: formValues.itemName,
          location: formValues.location,
          dateTime: formValues.dateTime,
          description: formValues.description,
        };
        if (formValues.photo instanceof File) {
          const formData = new FormData();
          Object.entries(payload).forEach(([k, v]) => formData.append(k, String(v)));
          formData.append("photo", formValues.photo);
          const res = await fetch(`/api/items/${editId}`, { method: "PUT", headers: authHeaders(), body: formData });
          if (!res.ok) throw new Error("Update failed");
        } else {
          const res = await fetch(`/api/items/${editId}`, {
            method: "PUT",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Update failed");
        }
        navigate("/my-posts");
      } catch {
        setSubmitError("บันทึกไม่สำเร็จ กรุณาลองใหม่");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        type: "lost",
        itemName: formValues.itemName,
        location: formValues.location,
        dateTime: formValues.dateTime,
        description: formValues.description,
      };
      if (formValues.photo instanceof File) {
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => formData.append(k, String(v)));
        formData.append("photo", formValues.photo);
        const res = await fetch("/api/items", { method: "POST", headers: authHeaders(), body: formData });
        if (!res.ok) throw new Error("Create failed");
      } else {
        const res = await fetch("/api/items", {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
      }
      navigate("/my-posts");
    } catch {
      setSubmitError("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(editId ? "/my-posts" : "/report");
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
            <Link to="/report" className="home-nav-link active">
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

      <main className="report-main">
        <div className="report-form-wrapper">
          <div className="report-form-tabs">
            <Link to="/report/lost" className="report-form-tab active">
              Lost Items
            </Link>
            <Link to="/report/found" className="report-form-tab">
              Found Items
            </Link>
          </div>

          <section className="report-form-panel">
            <h1 className="report-form-title">
              {editId ? "แก้ไขประกาศของที่หาย" : "Report Lost Item"}
            </h1>

            {loadingEdit && <p className="detail-message">กำลังโหลด...</p>}
            <form className="report-form" onSubmit={handleSubmit} style={{ display: loadingEdit ? "none" : undefined }}>
              <label className="report-field">
                <span className="report-field-label">Item Name</span>
                <div className="report-input-with-icon">
                  <span className="report-input-icon">
                    <img
                      src={itemIcon}
                      alt=""
                      className="report-input-icon-image"
                    />
                  </span>
                  <input
                    type="text"
                    className="report-input"
                    placeholder="Placeholder"
                    value={formValues.itemName}
                    onChange={(e) => handleChange("itemName", e.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="report-field-row">
                <label className="report-field">
                  <span className="report-field-label">Location</span>
                  <div className="report-input-with-icon">
                    <span className="report-input-icon">
                      <img
                        src={locationIcon}
                        alt=""
                        className="report-input-icon-image"
                      />
                    </span>
                    <input
                      type="text"
                      className="report-input"
                      placeholder="Placeholder"
                      value={formValues.location}
                      onChange={(e) =>
                        handleChange("location", e.target.value)
                      }
                      required
                    />
                  </div>
                </label>

                <label className="report-field">
                  <span className="report-field-label">Date &amp; Time</span>
                  <div className="report-input-with-icon">
                    <span className="report-input-icon">
                      <img
                        src={timeIcon}
                        alt=""
                        className="report-input-icon-image"
                      />
                    </span>
                    <input
                      type="datetime-local"
                      className="report-input"
                      value={formValues.dateTime}
                      onChange={(e) =>
                        handleChange("dateTime", e.target.value)
                      }
                      required
                    />
                  </div>
                </label>
              </div>

              <label className="report-field">
                <span className="report-field-label">Description</span>
                <textarea
                  className="report-textarea"
                  placeholder="กรอกรายละเอียดของ รุ่น ประมาณนี้ อันนี้ใส่ละเอียดขึ้น"
                  value={formValues.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  rows={4}
                  required
                />
              </label>

              <div className="report-upload-section">
                <span className="report-field-label">Upload Photo</span>
                {!photoPreviewUrl ? (
                  <label className="report-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      className="report-upload-input"
                      onChange={(e) =>
                        handlePhotoChange(e.target.files?.[0] ?? null)
                      }
                    />
                    <span className="report-upload-icon">
                      <img
                        src={pictureIcon}
                        alt=""
                        className="report-upload-icon-image"
                      />
                    </span>
                  </label>
                ) : (
                  <div className="report-upload-preview">
                    <img
                      src={photoPreviewUrl}
                      alt="Preview uploaded"
                      className="report-upload-preview-image"
                    />
                    <button
                      type="button"
                      className="report-upload-clear"
                      onClick={() => handlePhotoChange(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {submitError && <p className="claim-submit-error">{submitError}</p>}
              <div className="report-actions">
                <button
                  type="button"
                  className="report-secondary-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="report-primary-button" disabled={submitting}>
                  {editId ? (submitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข") : "Report Item"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default ReportLostPage;


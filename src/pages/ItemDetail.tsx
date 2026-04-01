import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHeaders } from "../api";
import { API_URL } from "../lib/api";

type ItemStatus = "lost" | "found";

/** Shape for detail API response. Backend can use this for GET /api/items/:id */
export interface ItemDetailData {
  id: string;
  title: string;
  lostTime: string;
  date: string;
  location: string;
  imageUrl: string;
  status: ItemStatus;
  description: string;
  isOwner?: boolean;
  isClosed?: boolean;
}

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/items/${id}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as ItemDetailData;
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

  // Submit Claim is handled on /claim/:id page.

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

          <div className="detail-card-wrapper">
            {loading && <p className="detail-message">กำลังโหลด...</p>}
            {error && !loading && <p className="detail-message">{error}</p>}
            {item && !loading && (
              <article className="detail-card">
                <div className="detail-image-frame">
                  <img
                    src={item.imageUrl || logo}
                    alt={item.title}
                    className="detail-image"
                  />
                </div>

                <div className="detail-content">
                  <h1 className="detail-title">{item.title}</h1>
                  <p className="detail-meta">
                    {item.status === "found" ? "เจอเวลา" : "หายเมื่อ"}: {item.lostTime}{" "}
                    <span className="home-item-separator">วันที่:</span>{" "}
                    {item.date}
                  </p>
                  <p className="detail-meta">
                    {item.status === "found" ? "เจอสถานที่" : "หายที่"}: {item.location}
                  </p>

                  <div className="detail-description-block">
                    <h2 className="detail-description-heading">Description</h2>
                    <div className="detail-description-box">
                      {item.description || "—"}
                    </div>
                  </div>

                  <div className="detail-actions">
                    {!item.isOwner && (
                      <Link to={`/claim/${item.id}`} className="detail-claim-button">
                        Submit Claim
                      </Link>
                    )}
                    {item.isOwner && (
                      <div className="detail-owner-actions">
                        <Link
                          to={item.status === "found" ? `/report/found/${item.id}/edit` : `/report/lost/${item.id}/edit`}
                          className="detail-edit-button"
                        >
                          แก้ไข
                        </Link>
                        <Link to="/my-posts" className="detail-myposts-button">
                          ประกาศของฉัน
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default ItemDetailPage;


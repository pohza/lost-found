import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import profileImage from "./../assets/profile.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHeaders } from "../api";

type ItemStatus = "lost" | "found";

export interface MyPostItem {
  id: string;
  title: string;
  lostTime: string;
  date: string;
  location: string;
  imageUrl: string;
  status: ItemStatus;
  isClosed: boolean;
}

function MyPostsPage() {
  const [posts, setPosts] = useState<MyPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/me/items", { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as unknown;
          if (!cancelled) setPosts(Array.isArray(data) ? data : []);
        } else {
          if (!cancelled) setPosts([]);
        }
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleClose = async (id: string) => {
    if (actionLoading) return;
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:3000/api/items/${id}/close`, { method: "POST", headers: authHeaders() });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isClosed: true } : p)),
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (actionLoading || !window.confirm("ต้องการลบประกาศนี้ใช่หรือไม่?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:3000/api/items/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setActionLoading(null);
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
            <Link to="/home" className="home-nav-link">HOME</Link>
            <Link to="/claims" className="home-nav-link">CLAIM</Link>
            <Link to="/report" className="home-nav-link">REPORT</Link>
            <Link to="/notifications" className="home-nav-link">NOTIFICATION</Link>
            <Link to="/messages" className="home-nav-link">MESSAGES</Link>
            <Link to="/profile" className="home-avatar-link">
              <img src={profileAvatar} alt="Profile" className="home-avatar-image" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="claims-section">
          <div className="claims-header">ประกาศของฉัน (My Posts)</div>
          <p className="myposts-hint">
            แก้ไข ลบ หรือปิดประกาศของท่านได้จากหน้านี้
          </p>

          {loading && <p className="detail-message">กำลังโหลด...</p>}
          {!loading && posts.length === 0 && (
            <p className="detail-message">ยังไม่มีประกาศของท่าน</p>
          )}

          {!loading && posts.length > 0 && (
            <div className="claims-list">
              {posts.map((p) => (
                <div key={p.id} className="claims-card static myposts-card">
                  <div className="claims-image-frame">
                    <img
                      src={p.imageUrl || profileImage}
                      alt={p.title}
                      className="claims-image"
                    />
                  </div>
                  <div className="claims-content">
                    <h2 className="claims-title">{p.title}</h2>
                    <p className="claims-meta">
                      {p.status === "found" ? "เจอเวลา" : "หายเมื่อ"}: {p.lostTime} วันที่: {p.date}
                    </p>
                    <p className="claims-meta">
                      {p.status === "found" ? "เจอสถานที่" : "หายที่"}: {p.location}
                    </p>
                    {p.isClosed && (
                      <span className="status-pill status-canceled">ปิดประกาศแล้ว</span>
                    )}
                  </div>
                  <div className="myposts-actions">
                    <Link
                      to={`/item/${p.id}`}
                      className="myposts-btn myposts-btn-view"
                    >
                      ดู
                    </Link>
                    {!p.isClosed && (
                      <Link
                        to={p.status === "found" ? `/report/found/${p.id}/edit` : `/report/lost/${p.id}/edit`}
                        className="myposts-btn myposts-btn-edit"
                      >
                        แก้ไข
                      </Link>
                    )}
                    {!p.isClosed && (
                      <button
                        type="button"
                        className="myposts-btn myposts-btn-close"
                        onClick={() => handleClose(p.id)}
                        disabled={actionLoading === p.id}
                      >
                        ปิดประกาศ
                      </button>
                    )}
                    <button
                      type="button"
                      className="myposts-btn myposts-btn-delete"
                      onClick={() => handleDelete(p.id)}
                      disabled={actionLoading === p.id}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="claims-links">
            <Link to="/report" className="claims-link">ไปลงประกาศใหม่</Link>
            <Link to="/profile" className="claims-link">กลับไปโปรไฟล์</Link>
          </div>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default MyPostsPage;

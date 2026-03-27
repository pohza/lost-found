import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { authHeaders } from "../api";

type ItemStatus = "lost" | "found";
export type SortOption = "latest" | "nearDate" | "views";

export interface ItemCardData {
  id: string;
  title: string;
  lostTime: string;
  date: string;
  location: string;
  imageUrl: string;
  status: ItemStatus;
  viewCount?: number;
}

function HomePage() {
  const [activeTab, setActiveTab] = useState<ItemStatus>("lost");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");
  const [items, setItems] = useState<ItemCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    params.set("type", activeTab);
    if (search.trim()) params.set("search", search.trim());
    if (locationFilter.trim()) params.set("location", locationFilter.trim());
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("sort", sort);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/items?${params.toString()}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as unknown;
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
          setError(Array.isArray(data) ? null : "โหลดไม่สำเร็จ");
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setError("โหลดไม่สำเร็จ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeTab, search, locationFilter, dateFrom, dateTo, sort]);

  const filteredItems = useMemo(() => items, [items]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner home-topbar-inner">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          <nav className="home-nav">
            <Link to="/home" className="home-nav-link active">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <section className="home-list-section">
          <div className="home-tabs">
            <button
              type="button"
              className={`home-tab ${activeTab === "lost" ? "active" : ""}`}
              onClick={() => setActiveTab("lost")}
            >
              Lost Items
            </button>
            <button
              type="button"
              className={`home-tab ${activeTab === "found" ? "active" : ""}`}
              onClick={() => setActiveTab("found")}
            >
              Found Items
            </button>
          </div>

          <div className="home-filters">
            <input
              type="text"
              className="home-filter-input"
              placeholder="กรองตามสถานที่"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              aria-label="Location filter"
            />
            <input
              type="date"
              className="home-filter-input home-filter-date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              aria-label="Date from"
            />
            <input
              type="date"
              className="home-filter-input home-filter-date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              aria-label="Date to"
            />
            <select
              className="home-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort by"
            >
              <option value="latest">ล่าสุด</option>
              <option value="nearDate">ใกล้วันพบ</option>
              <option value="views">ยอดเข้าชม</option>
            </select>
          </div>

          <div className="home-items-container">
            {loading && <p className="home-empty-text">กำลังโหลด...</p>}
            {!loading && error && <p className="home-empty-text">โหลดไม่สำเร็จ</p>}
            {!loading && !error && filteredItems.length === 0 && (
              <p className="home-empty-text">
                ยังไม่มีรายการในหมวดนี้ ระบบจะแสดงของที่หาย / พบเมื่อมีข้อมูลจากผู้ใช้
              </p>
            )}

            {!loading && filteredItems.map((item) => (
              <article key={item.id} className="home-item-card">
                <Link to={`/item/${item.id}`} className="home-item-mainlink">
                  <div className="home-item-image-frame">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="home-item-image"
                    />
                  </div>

                  <div className="home-item-content">
                    <h2 className="home-item-title">{item.title}</h2>
                    <p className="home-item-meta">
                      {item.status === "found" ? "เจอเวลา" : "หายเมื่อ"}: {item.lostTime}{" "}
                      <span className="home-item-separator">วันที่:</span>{" "}
                      {item.date}
                    </p>
                    <p className="home-item-meta">
                      {item.status === "found" ? "เจอสถานที่" : "หายที่"}: {item.location}
                    </p>
                  </div>
                </Link>

                <div className="home-item-actions">
                  <Link to={`/claim/${item.id}`} className="home-claim-button">
                    Submit Claim
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default HomePage;


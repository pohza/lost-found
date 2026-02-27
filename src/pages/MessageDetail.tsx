import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHeaders } from "../api";

interface MessageItem {
  id: string;
  body: string;
  sentAt: string;
  fromMe: boolean;
}

function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/me/messages/${id}`, { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as { messages?: MessageItem[] };
          if (!cancelled && Array.isArray(data.messages)) setMessages(data.messages);
        }
      } catch {
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !id || sending) return;
    const text = reply.trim();
    setReply("");
    setSending(true);
    try {
      const res = await fetch(`/api/me/messages/${id}`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = (await res.json()) as { messages?: MessageItem[] };
        if (Array.isArray(data.messages)) setMessages(data.messages);
      }
    } finally {
      setSending(false);
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
            <Link to="/messages" className="home-nav-link active">MESSAGES</Link>
            <Link to="/profile" className="home-avatar-link">
              <img src={profileAvatar} alt="Profile" className="home-avatar-image" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="notif-section">
          <div className="notif-banner">ข้อความ</div>
          {loading && <p className="detail-message">กำลังโหลด...</p>}
          {!loading && (
            <>
              <div className="messages-thread">
                {messages.length === 0 ? (
                  <p className="detail-message">ยังไม่มีข้อความในหัวข้อนี้</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={m.fromMe ? "messages-bubble messages-bubble-me" : "messages-bubble"}
                    >
                      <p className="messages-bubble-text">{m.body}</p>
                      <span className="messages-bubble-time">{m.sentAt}</span>
                    </div>
                  ))
                )}
              </div>
              <form className="messages-reply-form" onSubmit={handleSend}>
                <textarea
                  className="report-textarea"
                  placeholder="พิมพ์ข้อความ..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={2}
                />
                <button type="submit" className="report-primary-button" disabled={sending}>
                  {sending ? "กำลังส่ง..." : "ส่ง"}
                </button>
              </form>
              <p className="claims-links">
                <Link to="/messages" className="claims-link">กลับไปรายการข้อความ</Link>
              </p>
            </>
          )}
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default MessageDetailPage;

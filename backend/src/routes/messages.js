const router4 = require("express").Router();
const db4 = require("../config/db");
const auth4 = require("../middleware/auth");

async function assertThreadAccess(threadId, userId) {
  const [[row]] = await db4.query(
    `SELECT t.id, i.user_id AS owner_id, c.user_id AS claimant_id
     FROM threads t
     JOIN claims c ON c.id = t.claim_id
     JOIN items i ON i.id = t.item_id
     WHERE t.id = ?`,
    [threadId]
  );
  if (!row) return null;
  if (Number(row.owner_id) !== Number(userId) && Number(row.claimant_id) !== Number(userId)) {
    return null;
  }
  return row;
}

async function markThreadRead(threadId, userId) {
  const [[maxRow]] = await db4.query(
    `SELECT COALESCE(MAX(id), 0) AS mid FROM messages WHERE thread_id = ?`,
    [threadId]
  );
  const mid = maxRow.mid;
  await db4.query(
    `INSERT INTO thread_reads (thread_id, user_id, last_seen_message_id)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE last_seen_message_id = VALUES(last_seen_message_id)`,
    [threadId, userId, mid]
  );
}

async function loadThreadMessages(threadId, userId) {
  const [msgs] = await db4.query(
    `SELECT m.id, m.text, m.sender_id, m.created_at
     FROM messages m
     WHERE m.thread_id = ?
     ORDER BY m.id ASC`,
    [threadId]
  );
  return msgs.map((m) => ({
    id: String(m.id),
    body: m.text || "",
    sentAt: m.created_at ? new Date(m.created_at).toISOString() : "",
    fromMe: Number(m.sender_id) === Number(userId),
  }));
}

router4.get("/me/messages", auth4, async (req, res) => {
  try {
    const uid = req.user.id;
    const [rows] = await db4.query(
      `SELECT t.id AS thread_id, i.id AS item_id, i.title AS item_title,
              (SELECT MAX(m.created_at) FROM messages m WHERE m.thread_id = t.id) AS last_at,
              (SELECT COUNT(*) FROM messages m
               WHERE m.thread_id = t.id
               AND m.sender_id != ?
               AND m.id > COALESCE(
                 (SELECT tr.last_seen_message_id FROM thread_reads tr
                  WHERE tr.thread_id = t.id AND tr.user_id = ? LIMIT 1),
                 0
               )
              ) AS unread
       FROM threads t
       JOIN claims c ON c.id = t.claim_id
       JOIN items i ON i.id = t.item_id
       WHERE i.user_id = ? OR c.user_id = ?
       ORDER BY t.id DESC`,
      [uid, uid, uid, uid]
    );

    const out = rows.map((r) => ({
      id: String(r.thread_id),
      subject: r.item_title || "ข้อความ",
      itemId: String(r.item_id),
      itemTitle: r.item_title || "",
      lastMessageAt: r.last_at ? new Date(r.last_at).toISOString() : "",
      unread: Number(r.unread) || 0,
    }));
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

router4.get("/me/messages/:id", auth4, async (req, res) => {
  try {
    const threadId = req.params.id;
    const access = await assertThreadAccess(threadId, req.user.id);
    if (!access) {
      return res.status(404).json({ message: "Thread not found" });
    }
    const messages = await loadThreadMessages(threadId, req.user.id);
    await markThreadRead(threadId, req.user.id);
    return res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load thread" });
  }
});

router4.post("/me/messages/:id", auth4, async (req, res) => {
  try {
    const threadId = req.params.id;
    const access = await assertThreadAccess(threadId, req.user.id);
    if (!access) {
      return res.status(404).json({ message: "Thread not found" });
    }
    const text = (req.body && req.body.text) || "";
    if (!String(text).trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }
    await db4.query("INSERT INTO messages (thread_id, sender_id, text) VALUES (?, ?, ?)", [
      threadId,
      req.user.id,
      String(text).trim(),
    ]);
    await markThreadRead(threadId, req.user.id);
    const messages = await loadThreadMessages(threadId, req.user.id);
    return res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router4;

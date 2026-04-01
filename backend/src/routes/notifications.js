const router3 = require("express").Router();
const db3 = require("../config/db");
const auth3 = require("../middleware/auth");
const { formatEventParts } = require("../utils/itemPresenter");

router3.get("/notifications", auth3, async (req, res) => {
  try {
    const [rows] = await db3.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

router3.get("/notifications/:id", auth3, async (req, res) => {
  try {
    const [rows] = await db3.query(
      `SELECT n.*, i.title, i.location, i.type, i.image_url, i.event_at,
              c.description AS claim_description
       FROM notifications n
       JOIN claims c ON c.id = n.claim_id
       JOIN items i ON i.id = c.item_id
       WHERE n.id = ? AND n.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    const row = rows[0];
    const { date, lostTime } = formatEventParts(row.event_at);
    return res.json({
      id: String(row.id),
      type: row.type || "found",
      title: row.title || "",
      time: lostTime,
      date,
      location: row.location || "",
      imageUrl: row.image_url || "",
      fullName: row.fullName || "",
      contactEmail: row.contactEmail || "",
      contactNumber: row.contactNumber || "",
      description: row.claim_description || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load notification" });
  }
});

router3.post("/notifications/:id/approve", auth3, async (req, res) => {
  try {
    const [[notification]] = await db3.query(
      "SELECT claim_id FROM notifications WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await db3.query("UPDATE claims SET status='approved' WHERE id=?", [notification.claim_id]);
    await db3.query("UPDATE notifications SET status='approved' WHERE id=?", [req.params.id]);
    return res.json({ message: "Approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve" });
  }
});

router3.post("/notifications/:id/cancel", auth3, async (req, res) => {
  try {
    const [[notification]] = await db3.query(
      "SELECT claim_id FROM notifications WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await db3.query("UPDATE claims SET status='rejected' WHERE id=?", [notification.claim_id]);
    await db3.query("UPDATE notifications SET status='rejected' WHERE id=?", [req.params.id]);
    return res.json({ message: "Cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel" });
  }
});

module.exports = router3;

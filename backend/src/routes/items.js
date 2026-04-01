const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const { toPublicItem, pickItemBody } = require("../utils/itemPresenter");
const { maybeItemPhoto } = require("../utils/multerUpload");

router.get("/", async (req, res) => {
  try {
    const { type, search, location, dateFrom, dateTo, sort } = req.query;

    let query = `SELECT * FROM items WHERE COALESCE(status, 'open') = 'open'`;
    const params = [];

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(term, term);
    }
    if (location && String(location).trim()) {
      query += " AND location LIKE ?";
      params.push(`%${String(location).trim()}%`);
    }
    if (dateFrom) {
      query += " AND DATE(event_at) >= ?";
      params.push(dateFrom);
    }
    if (dateTo) {
      query += " AND DATE(event_at) <= ?";
      params.push(dateTo);
    }

    const sortKey = sort || "latest";
    if (sortKey === "nearDate") {
      query += " ORDER BY event_at IS NULL, ABS(TIMESTAMPDIFF(HOUR, event_at, NOW())) ASC, id DESC";
    } else if (sortKey === "views") {
      query += " ORDER BY view_count DESC, id DESC";
    } else {
      query += " ORDER BY created_at DESC, id DESC";
    }

    const [rows] = await db.query(query, params);
    res.json(rows.map(toPublicItem));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load items" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM items WHERE id=?", [req.params.id]);
    const row = rows[0];
    if (!row) {
      return res.status(404).json({ message: "Item not found" });
    }

    await db.query("UPDATE items SET view_count = view_count + 1 WHERE id = ?", [req.params.id]);
    row.view_count = (row.view_count || 0) + 1;

    let isOwner = false;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        isOwner = Number(decoded.id) === Number(row.user_id);
      } catch (_error) {
        isOwner = false;
      }
    }

    return res.json({ ...toPublicItem(row), isOwner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load item" });
  }
});

router.post("/", auth, maybeItemPhoto, async (req, res) => {
  try {
    const b = pickItemBody(req.body);
    let imageUrl = null;
    if (req.file) imageUrl = `/uploads/items/${req.file.filename}`;

    const [r] = await db.query(
      `INSERT INTO items (user_id,title,description,type,location,status,event_at,image_url,handover_type,how_to_claim)
       VALUES (?,?,?,?,?,'open',?,?,?,?)`,
      [
        req.user.id,
        b.title,
        b.description,
        b.type,
        b.location,
        b.event_at,
        imageUrl,
        b.handover_type,
        b.how_to_claim,
      ]
    );
    res.json({ id: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create item" });
  }
});

router.put("/:id", auth, maybeItemPhoto, async (req, res) => {
  try {
    const [[existing]] = await db.query("SELECT * FROM items WHERE id=? AND user_id=?", [
      req.params.id,
      req.user.id,
    ]);
    if (!existing) {
      return res.status(403).json({ message: "Not allowed to edit this item" });
    }

    const b = pickItemBody(req.body);
    let imageUrl = existing.image_url;
    if (req.file) imageUrl = `/uploads/items/${req.file.filename}`;

    await db.query(
      `UPDATE items SET title=?, description=?, type=?, location=?, event_at=?, image_url=?, handover_type=?, how_to_claim=?
       WHERE id=? AND user_id=?`,
      [
        b.title,
        b.description,
        b.type,
        b.location,
        b.event_at,
        imageUrl,
        b.handover_type,
        b.how_to_claim,
        req.params.id,
        req.user.id,
      ]
    );
    res.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update item" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM items WHERE id=? AND user_id=?", [
      req.params.id,
      req.user.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not allowed to delete this item" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

router.post("/:id/close", auth, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE items SET status='closed' WHERE id=? AND user_id=?",
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not allowed to close this item" });
    }
    return res.json({ message: "Closed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to close item" });
  }
});

module.exports = router;

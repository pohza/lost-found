const router2 = require("express").Router();
const db2 = require("../config/db");
const auth2 = require("../middleware/auth");
const { maybeClaimEvidence } = require("../utils/multerUpload");
const { formatEventParts } = require("../utils/itemPresenter");

function mapClaimStatus(dbStatus) {
  if (dbStatus === "rejected") return "canceled";
  return dbStatus;
}

function claimToListRow(c) {
  const { date, lostTime } = formatEventParts(c.event_at);
  return {
    claimId: String(c.id),
    itemId: String(c.item_id),
    title: c.item_title || "",
    time: lostTime,
    date,
    location: c.item_location || "",
    imageUrl: c.image_url || "",
    status: mapClaimStatus(c.status),
  };
}

router2.post("/items/:id/claim", auth2, maybeClaimEvidence, async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  const fullName = req.body.fullName || req.body.full_name || "";
  const contactEmail = req.body.contactEmail || req.body.contact_email || "";
  const contactPhone = req.body.contactNumber || req.body.contact_phone || "";
  const description = req.body.description || "";
  const serialNumber = req.body.serialNumber || req.body.serial_number || "";
  let evidenceUrl = null;
  if (req.file) evidenceUrl = `/uploads/claims/${req.file.filename}`;

  try {
    const [[item]] = await db2.query("SELECT id, user_id, title, status as listing_status, type FROM items WHERE id = ?", [
      itemId,
    ]);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (Number(item.user_id) === Number(userId)) {
      return res.status(400).json({ message: "Cannot claim your own item" });
    }
    if (item.listing_status === "closed") {
      return res.status(400).json({ message: "This listing is closed" });
    }

    const [result] = await db2.query(
      `INSERT INTO claims (item_id, user_id, message, description, full_name, contact_email, contact_phone, serial_number, evidence_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')`,
      [itemId, userId, description, description, fullName, contactEmail, contactPhone, serialNumber, evidenceUrl]
    );

    const claimId = result.insertId;

    await db2.query(
      "UPDATE users SET name = COALESCE(NULLIF(?, ''), name), phone = COALESCE(NULLIF(?, ''), phone) WHERE id = ?",
      [fullName, contactPhone, userId]
    );

    await db2.query(
      `INSERT INTO notifications 
      (user_id, claim_id, title, fullName, contactEmail, contactNumber)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [item.user_id, claimId, item.title, fullName, contactEmail, contactPhone]
    );

    await db2.query("INSERT INTO threads (claim_id, item_id) VALUES (?, ?)", [claimId, itemId]);

    res.json({ message: "Claim submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit claim" });
  }
});

router2.get("/claims", auth2, async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT c.*, i.title AS item_title, i.location AS item_location, i.type AS item_type,
             i.event_at, i.image_url
      FROM claims c
      JOIN items i ON i.id = c.item_id
      WHERE c.user_id = ?`;
    const params = [req.user.id];
    if (status) {
      query += " AND c.status = ?";
      params.push(status);
    }
    query += " ORDER BY c.id DESC";

    const [rows] = await db2.query(query, params);
    res.json(rows.map(claimToListRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load claims" });
  }
});

module.exports = router2;

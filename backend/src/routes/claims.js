const router2 = require("express").Router();
const db2 = require("../config/db");
const auth2 = require("../middleware/auth");

router2.post("/items/:id/claim", auth2, async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;
  const { message } = req.body;

  // 1. Create claim
  const [result] = await db2.query(
    "INSERT INTO claims (item_id, user_id, message) VALUES (?, ?, ?)",
    [itemId, userId, message]
  );

  const claimId = result.insertId;

  // 2. Get item + claimant info
  const [[item]] = await db2.query(
    "SELECT title, user_id FROM items WHERE id = ?",
    [itemId]
  );

  const [[user]] = await db2.query(
    "SELECT name, email, phone FROM users WHERE id = ?",
    [userId]
  );

  // 3. Create notification (FULL DATA)
  await db2.query(
    `INSERT INTO notifications 
    (user_id, claim_id, title, fullName, contactEmail, contactNumber)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      item.user_id,      // owner gets notification
      claimId,
      item.title,
      user.name,
      user.email,
      user.phone
    ]
  );

  res.json({ message: "Claim submitted" });
});

router2.get("/claims", auth2, async (req, res) => {
  const [rows] = await db2.query("SELECT * FROM claims WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

module.exports = router2;
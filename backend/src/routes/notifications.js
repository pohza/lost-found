const router3 = require("express").Router();
const db3 = require("../config/db");
const auth3 = require("../middleware/auth");

router3.get("/notifications", auth3, async (req, res) => {
  const [rows] = await db3.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC",
    [req.user.id]
  );

  res.json(rows);
});

router3.post("/notifications/:id/approve", auth3, async (req, res) => {
  await db3.query("UPDATE claims SET status='approved' WHERE id=?", [req.params.id]);
  res.json({ message: "Approved" });
});

router3.post("/notifications/:id/cancel", auth3, async (req, res) => {
  await db3.query("UPDATE claims SET status='rejected' WHERE id=?", [req.params.id]);
  res.json({ message: "Cancelled" });
});

module.exports = router3;
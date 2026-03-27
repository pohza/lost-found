const router5 = require("express").Router();
const db5 = require("../config/db");
const auth5 = require("../middleware/auth");

router5.get("/me", auth5, async (req, res) => {
  const [rows] = await db5.query("SELECT * FROM users WHERE id=?", [req.user.id]);
  res.json(rows[0]);
});

router5.patch("/me", auth5, async (req, res) => {
  await db5.query("UPDATE users SET name=? WHERE id=?", [req.body.name, req.user.id]);
  res.json({ message: "Updated" });
});

router5.get("/me/items", auth5, async (req, res) => {
  const [rows] = await db5.query("SELECT * FROM items WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

module.exports = router5;
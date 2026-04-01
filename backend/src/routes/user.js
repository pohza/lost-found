const router5 = require("express").Router();
const db5 = require("../config/db");
const auth5 = require("../middleware/auth");
const { toPublicItem } = require("../utils/itemPresenter");

router5.get("/me", auth5, async (req, res) => {
  const [rows] = await db5.query("SELECT id, email, name, phone FROM users WHERE id=?", [req.user.id]);
  const u = rows[0] || {};
  res.json({ ...u, fullName: u.name ?? "" });
});

router5.patch("/me", auth5, async (req, res) => {
  const name = req.body.fullName ?? req.body.name;
  if (name != null) {
    await db5.query("UPDATE users SET name=? WHERE id=?", [name, req.user.id]);
  }
  res.json({ message: "Updated" });
});

router5.get("/me/items", auth5, async (req, res) => {
  const [rows] = await db5.query("SELECT * FROM items WHERE user_id=? ORDER BY id DESC", [req.user.id]);
  res.json(rows.map(toPublicItem));
});

module.exports = router5;
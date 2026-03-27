const router2 = require("express").Router();
const db2 = require("../config/db");
const auth2 = require("../middleware/auth");

router2.post("/items/:id/claim", auth2, async (req, res) => {
  await db2.query("INSERT INTO claims (item_id,user_id,message) VALUES (?,?,?)", [
    req.params.id,
    req.user.id,
    req.body.message,
  ]);
  res.json({ message: "Claim sent" });
});

router2.get("/claims", auth2, async (req, res) => {
  const [rows] = await db2.query("SELECT * FROM claims WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

module.exports = router2;
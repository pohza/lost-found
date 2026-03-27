const router4 = require("express").Router();
const db4 = require("../config/db");
const auth4 = require("../middleware/auth");

router4.get("/me/messages", auth4, async (req, res) => {
  const [rows] = await db4.query("SELECT * FROM messages WHERE sender_id=?", [req.user.id]);
  res.json(rows);
});

router4.post("/me/messages/:id", auth4, async (req, res) => {
  await db4.query("INSERT INTO messages (thread_id,sender_id,text) VALUES (?,?,?)", [
    req.params.id,
    req.user.id,
    req.body.text,
  ]);
  res.json({ message: "Sent" });
});

module.exports = router4;
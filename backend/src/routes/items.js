const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM items");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM items WHERE id=?", [req.params.id]);
  res.json(rows[0]);
});

router.post("/", auth, async (req, res) => {
  const { title, description, type, location } = req.body;
  const [r] = await db.query(
    "INSERT INTO items (user_id,title,description,type,location) VALUES (?,?,?,?,?)",
    [req.user.id, title, description, type, location]
  );
  res.json({ id: r.insertId });
});

router.put("/:id", auth, async (req, res) => {
  await db.query("UPDATE items SET title=?,description=? WHERE id=? AND user_id=?", [
    req.body.title,
    req.body.description,
    req.params.id,
    req.user.id,
  ]);
  res.json({ message: "Updated" });
});

router.delete("/:id", auth, async (req, res) => {
  await db.query("DELETE FROM items WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
  res.json({ message: "Deleted" });
});

router.post("/:id/close", auth, async (req, res) => {
  await db.query("UPDATE items SET status='closed' WHERE id=?", [req.params.id]);
  res.json({ message: "Closed" });
});

module.exports = router;
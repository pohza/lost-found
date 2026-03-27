const router = require("express").Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash]
  );

  // ✅ AUTO LOGIN AFTER SIGNUP
  const token = jwt.sign(
    { id: result.insertId, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

router.post("/login", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email=?", [req.body.email]);
  const user = rows[0];

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // ✅ CREATE SESSION TOKEN
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // session lasts 7 days
  );

  res.json({ token });
});

module.exports = router;
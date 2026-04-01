const crypto = require("crypto");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const db = require("../config/db");
const { sendPasswordResetEmail } = require("../utils/mail");

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token), "utf8").digest("hex");
}

function publicResetUrl(plainToken) {
  const base = process.env.APP_PUBLIC_URL || "";
  const path = `/reset-password?token=${encodeURIComponent(plainToken)}`;
  if (base) return `${base.replace(/\/$/, "")}${path}`;
  return path;
}

/** Request reset: always 200 to avoid email enumeration */
router.post("/auth/forgot-password", async (req, res) => {
  try {
    const email = (req.body && req.body.email && String(req.body.email).trim().toLowerCase()) || "";
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [users] = await db.query("SELECT id, email FROM users WHERE email = ?", [email]);
    const user = users[0];

    const generic = {
      message: "If an account exists for this email, you will receive reset instructions shortly.",
    };

    if (!user) {
      return res.json(generic);
    }

    await db.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [user.id]);

    const plainToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(plainToken);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [user.id, tokenHash, expires]
    );

    const resetUrl = publicResetUrl(plainToken);
    const emailed = await sendPasswordResetEmail(user.email, resetUrl);

    if (process.env.PASSWORD_RESET_RETURN_LINK === "true") {
      return res.json({
        ...generic,
        debugResetLink: resetUrl,
        emailed,
      });
    }

    if (!emailed && process.env.NODE_ENV !== "production") {
      console.info("[password-reset] No SMTP configured. Reset link for dev:", resetUrl);
    }

    return res.json(generic);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to process request" });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const token = req.body && req.body.token;
    const password = req.body && req.body.password;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const tokenHash = hashToken(token);
    const [rows] = await db.query(
      `SELECT user_id FROM password_reset_tokens 
       WHERE token_hash = ? AND expires_at > NOW()`,
      [tokenHash]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const userId = rows[0].user_id;
    const hash = await bcrypt.hash(String(password), 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, userId]);
    await db.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [userId]);

    return res.json({ message: "Password updated. You can log in now." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to reset password" });
  }
});

module.exports = router;

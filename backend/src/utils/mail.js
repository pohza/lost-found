/**
 * Sends email when SMTP_* env vars are set. Otherwise resolves false (caller may log link for dev).
 */
async function sendPasswordResetEmail(to, resetUrl) {
  const host = process.env.SMTP_HOST;
  if (!host) return false;

  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@localhost",
      to,
      subject: "Reset your Lost & Found password",
      text: `Open this link to set a new password (valid 1 hour):\n${resetUrl}\n`,
      html: `<p>Open this link to set a new password (valid 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
    return true;
  } catch (e) {
    console.error("sendPasswordResetEmail failed:", e.message);
    return false;
  }
}

module.exports = { sendPasswordResetEmail };

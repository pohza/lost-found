const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

function uploadSubdir(sub) {
  const dest = path.join(__dirname, "..", "..", "uploads", sub);
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "") || ".bin";
      const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
      cb(null, name);
    },
  });
}

const itemPhoto = multer({
  storage: uploadSubdir("items"),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const claimEvidence = multer({
  storage: uploadSubdir("claims"),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function maybeItemPhoto(req, res, next) {
  if (req.is("multipart/form-data")) {
    return itemPhoto.single("photo")(req, res, next);
  }
  next();
}

function maybeClaimEvidence(req, res, next) {
  if (req.is("multipart/form-data")) {
    return claimEvidence.single("evidencePhoto")(req, res, next);
  }
  next();
}

module.exports = { itemPhoto, claimEvidence, maybeItemPhoto, maybeClaimEvidence };

/** Map DB row -> frontend item shape (title, lostTime, date, imageUrl, status=lost|found, isClosed). */
function formatEventParts(eventAt) {
  if (!eventAt) return { date: "", lostTime: "" };
  const d = new Date(eventAt);
  if (Number.isNaN(d.getTime())) return { date: "", lostTime: "" };
  return {
    date: d.toISOString().slice(0, 10),
    lostTime: d.toTimeString().slice(0, 5),
  };
}

function toPublicItem(row) {
  if (!row) return null;
  const { date, lostTime } = formatEventParts(row.event_at);
  const listingStatus = row.status;
  const itemType = row.type || "lost";

  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title || "",
    description: row.description,
    location: row.location || "",
    type: itemType,
    handoverType: row.handover_type || undefined,
    howToClaim: row.how_to_claim || undefined,
    date,
    lostTime,
    imageUrl: row.image_url || "",
    status: itemType,
    listingStatus,
    isClosed: listingStatus === "closed",
    viewCount: row.view_count ?? 0,
    created_at: row.created_at,
    event_at: row.event_at,
  };
}

function parseEventAt(dateTimeStr) {
  if (dateTimeStr == null || String(dateTimeStr).trim() === "") return null;
  const d = new Date(dateTimeStr);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

/** Normalize fields from JSON body or multer req.body */
function pickItemBody(body) {
  return {
    title: body.itemName || body.title || "",
    description: body.description || "",
    type: body.type || "lost",
    location: body.location || "",
    event_at: parseEventAt(body.dateTime),
    handover_type: body.handoverType || null,
    how_to_claim: body.howToClaim || null,
  };
}

module.exports = { toPublicItem, parseEventAt, pickItemBody, formatEventParts };

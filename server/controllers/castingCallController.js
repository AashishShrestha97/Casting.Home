const pool = require("../db/pool");
const { sendCastingCallNotification } = require("../lib/mailer");

const VALID_TYPES = ["Film", "TV", "Web Series", "Ad", "Theatre"];

function shapeCall(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    location: row.location,
    ageRange: row.age_range,
    gender: row.gender,
    deadline: row.deadline,
    tags: row.tags || [],
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function validateCallInput(body = {}) {
  const { title, type, location, deadline, description } = body;
  if (!title || !String(title).trim())       return "Title is required";
  if (!type || !VALID_TYPES.includes(type))   return `Type must be one of: ${VALID_TYPES.join(", ")}`;
  if (!location || !String(location).trim()) return "Location is required";
  if (!deadline || Number.isNaN(Date.parse(deadline))) return "A valid deadline date is required";
  if (!description || !String(description).trim())     return "Description is required";
  return null;
}

// POST /api/producer/casting-calls
async function createCall(req, res) {
  try {
    const producerId = req.user.userId;
    const body = req.body || {};
    const validationError = validateCallInput(body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { title, type, location, ageRange, gender, deadline, tags, description } = body;
    const tagsArr = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : String(tags || "").split(",").map((t) => t.trim()).filter(Boolean);

    const insert = await pool.query(
      `INSERT INTO casting_calls
         (producer_id, title, type, location, age_range, gender, deadline, tags, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        producerId, title.trim(), type, location.trim(),
        ageRange || null, gender || "Any", deadline, tagsArr, description.trim(),
      ]
    );
    const call = shapeCall(insert.rows[0]);

    // Look up the producer so the admin email has full context
    // (company, contact name, email, phone).
    const producerResult = await pool.query(
      `SELECT name, email, phone, company FROM producers WHERE id = $1`,
      [producerId]
    );
    const producer = producerResult.rows[0];

    // Manual-curation v1: email the admin the full brief. This is a
    // best-effort side effect — a failed email never fails the request,
    // since the casting call is already safely saved.
    const emailResult = await sendCastingCallNotification({ call, producer });

    return res.status(201).json({ call, emailSent: emailResult.sent });
  } catch (err) {
    console.error("Create casting call error:", err);
    return res.status(500).json({ error: "Something went wrong posting your casting call" });
  }
}

// GET /api/producer/casting-calls
async function listMyCalls(req, res) {
  try {
    const producerId = req.user.userId;
    const result = await pool.query(
      `SELECT * FROM casting_calls WHERE producer_id = $1 ORDER BY created_at DESC`,
      [producerId]
    );
    return res.json({ calls: result.rows.map(shapeCall) });
  } catch (err) {
    console.error("List casting calls error:", err);
    return res.status(500).json({ error: "Something went wrong loading your casting calls" });
  }
}

// PUT /api/producer/casting-calls/:id
async function updateCall(req, res) {
  try {
    const producerId = req.user.userId;
    const { id } = req.params;

    const existing = await pool.query(`SELECT producer_id FROM casting_calls WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Casting call not found" });
    }
    // Ownership check: a producer can only ever edit their own calls.
    if (existing.rows[0].producer_id !== producerId) {
      return res.status(403).json({ error: "You don't have permission to edit this casting call" });
    }

    const body = req.body || {};
    const validationError = validateCallInput(body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { title, type, location, ageRange, gender, deadline, tags, description, status } = body;
    const tagsArr = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : String(tags || "").split(",").map((t) => t.trim()).filter(Boolean);

    const update = await pool.query(
      `UPDATE casting_calls SET
         title = $1, type = $2, location = $3, age_range = $4, gender = $5,
         deadline = $6, tags = $7, description = $8,
         status = COALESCE($9, status), updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        title.trim(), type, location.trim(), ageRange || null, gender || "Any",
        deadline, tagsArr, description.trim(),
        status && ["open", "closed"].includes(status) ? status : null,
        id,
      ]
    );

    return res.json({ call: shapeCall(update.rows[0]) });
  } catch (err) {
    console.error("Update casting call error:", err);
    return res.status(500).json({ error: "Something went wrong updating your casting call" });
  }
}

// PATCH /api/producer/casting-calls/:id/status
async function toggleStatus(req, res) {
  try {
    const producerId = req.user.userId;
    const { id } = req.params;

    const existing = await pool.query(`SELECT producer_id, status FROM casting_calls WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Casting call not found" });
    }
    if (existing.rows[0].producer_id !== producerId) {
      return res.status(403).json({ error: "You don't have permission to modify this casting call" });
    }

    const nextStatus = existing.rows[0].status === "open" ? "closed" : "open";
    const update = await pool.query(
      `UPDATE casting_calls SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [nextStatus, id]
    );

    return res.json({ call: shapeCall(update.rows[0]) });
  } catch (err) {
    console.error("Toggle casting call status error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// DELETE /api/producer/casting-calls/:id
async function deleteCall(req, res) {
  try {
    const producerId = req.user.userId;
    const { id } = req.params;

    const existing = await pool.query(`SELECT producer_id FROM casting_calls WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Casting call not found" });
    }
    if (existing.rows[0].producer_id !== producerId) {
      return res.status(403).json({ error: "You don't have permission to delete this casting call" });
    }

    await pool.query(`DELETE FROM casting_calls WHERE id = $1`, [id]);
    return res.json({ deleted: true });
  } catch (err) {
    console.error("Delete casting call error:", err);
    return res.status(500).json({ error: "Something went wrong deleting your casting call" });
  }
}

module.exports = { createCall, listMyCalls, updateCall, toggleStatus, deleteCall };

const pool = require("../db/pool");

function isRealUrl(v) {
  // Filters out local blob: preview URLs (from <input type=file> object
  // URLs) which don't survive a page reload / aren't reachable from the
  // server — only persist real http(s) URLs. Until real file storage
  // (S3/Cloudinary/etc) is wired up, blob URLs are simply dropped.
  return typeof v === "string" && /^https?:\/\//.test(v);
}

function shapeProfile(actorRow, profileRow) {
  return {
    id: actorRow.id,
    role: "actor",
    name: actorRow.name,
    email: actorRow.email,
    phone: actorRow.phone,
    age: actorRow.age,
    height: profileRow?.height ?? null,
    gender: profileRow?.gender ?? null,
    city: profileRow?.city ?? null,
    experience: profileRow?.experience ?? null,
    photoRightUrl: profileRow?.photo_right_url ?? null,
    photoFrontUrl: profileRow?.photo_front_url ?? null,
    photoLeftUrl: profileRow?.photo_left_url ?? null,
    videoUrl: profileRow?.video_url ?? null,
    socialType: profileRow?.social_type ?? null,
    socialUrl: profileRow?.social_url ?? null,
    updatedAt: profileRow?.updated_at ?? null,
  };
}

// GET /api/actor/profile
async function getProfile(req, res) {
  try {
    const actorId = req.user.userId;

    const actorResult = await pool.query(
      `SELECT id, name, email, phone, age FROM actors WHERE id = $1`,
      [actorId]
    );
    if (actorResult.rows.length === 0) {
      return res.status(404).json({ error: "Actor not found" });
    }

    const profileResult = await pool.query(
      `SELECT * FROM actor_profiles WHERE actor_id = $1`,
      [actorId]
    );

    return res.json({ profile: shapeProfile(actorResult.rows[0], profileResult.rows[0]) });
  } catch (err) {
    console.error("Get actor profile error:", err);
    return res.status(500).json({ error: "Something went wrong loading your profile" });
  }
}

// PUT /api/actor/profile
// Body may include: fullName, age, phone (-> actors table)
//                    height, gender, city, experience,
//                    photoRightUrl, photoFrontUrl, photoLeftUrl,
//                    videoUrl, socialType, socialUrl (-> actor_profiles table)
async function updateProfile(req, res) {
  const client = await pool.connect();
  try {
    const actorId = req.user.userId;
    const {
      fullName, age, phone,
      height, gender, city, experience,
      photoRightUrl, photoFrontUrl, photoLeftUrl,
      videoUrl, socialType, socialUrl,
    } = req.body;

    if (fullName !== undefined && !String(fullName).trim()) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    if (age !== undefined && age !== null && age !== "") {
      const n = Number(age);
      if (Number.isNaN(n) || n < 5 || n > 90) {
        return res.status(400).json({ error: "Enter a valid age" });
      }
    }

    await client.query("BEGIN");

    // Core identity fields live on `actors` — only touch the ones provided.
    const actorSets = [];
    const actorVals = [];
    let i = 1;
    if (fullName !== undefined) { actorSets.push(`name = $${i++}`); actorVals.push(String(fullName).trim()); }
    if (age !== undefined)      { actorSets.push(`age = $${i++}`);  actorVals.push(age === "" || age === null ? null : Number(age)); }
    if (phone !== undefined)    { actorSets.push(`phone = $${i++}`); actorVals.push(phone || null); }
    if (actorSets.length > 0) {
      actorSets.push(`updated_at = NOW()`);
      actorVals.push(actorId);
      await client.query(
        `UPDATE actors SET ${actorSets.join(", ")} WHERE id = $${i}`,
        actorVals
      );
    }

    // Extended fields live on `actor_profiles` — upsert (one row per actor).
    // Blob preview URLs are filtered out; only real http(s) URLs persist.
    const safePhotoRight = photoRightUrl === undefined ? undefined : (isRealUrl(photoRightUrl) ? photoRightUrl : null);
    const safePhotoFront = photoFrontUrl === undefined ? undefined : (isRealUrl(photoFrontUrl) ? photoFrontUrl : null);
    const safePhotoLeft  = photoLeftUrl  === undefined ? undefined : (isRealUrl(photoLeftUrl)  ? photoLeftUrl  : null);
    const safeVideo      = videoUrl      === undefined ? undefined : (isRealUrl(videoUrl)      ? videoUrl      : null);

    await client.query(
      `INSERT INTO actor_profiles (
         actor_id, height, gender, city, experience,
         photo_right_url, photo_front_url, photo_left_url,
         video_url, social_type, social_url, updated_at
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
       ON CONFLICT (actor_id) DO UPDATE SET
         height          = COALESCE(EXCLUDED.height, actor_profiles.height),
         gender          = COALESCE(EXCLUDED.gender, actor_profiles.gender),
         city            = COALESCE(EXCLUDED.city, actor_profiles.city),
         experience      = COALESCE(EXCLUDED.experience, actor_profiles.experience),
         photo_right_url = CASE WHEN $6::text IS NOT NULL THEN $6 ELSE actor_profiles.photo_right_url END,
         photo_front_url = CASE WHEN $7::text IS NOT NULL THEN $7 ELSE actor_profiles.photo_front_url END,
         photo_left_url  = CASE WHEN $8::text IS NOT NULL THEN $8 ELSE actor_profiles.photo_left_url END,
         video_url       = CASE WHEN $9::text IS NOT NULL THEN $9 ELSE actor_profiles.video_url END,
         social_type     = COALESCE(EXCLUDED.social_type, actor_profiles.social_type),
         social_url      = COALESCE(EXCLUDED.social_url, actor_profiles.social_url),
         updated_at      = NOW()`,
      [
        actorId,
        height ?? null, gender ?? null, city ?? null, experience ?? null,
        safePhotoRight ?? null, safePhotoFront ?? null, safePhotoLeft ?? null,
        safeVideo ?? null, socialType ?? null, socialUrl ?? null,
      ]
    );

    await client.query("COMMIT");

    const actorResult = await client.query(
      `SELECT id, name, email, phone, age FROM actors WHERE id = $1`,
      [actorId]
    );
    const profileResult = await client.query(
      `SELECT * FROM actor_profiles WHERE actor_id = $1`,
      [actorId]
    );

    return res.json({ profile: shapeProfile(actorResult.rows[0], profileResult.rows[0]) });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Update actor profile error:", err);
    return res.status(500).json({ error: "Something went wrong saving your profile" });
  } finally {
    client.release();
  }
}

module.exports = { getProfile, updateProfile };

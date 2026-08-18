const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;

/**
 * Builds a fully self-contained {signup, login, me} controller for one
 * role. Each call is bound to its own Postgres table via `table`, so an
 * actor controller only ever reads/writes `actors` and a producer
 * controller only ever reads/writes `producers` — there is no shared
 * table and no cross-table lookup, by construction.
 *
 * @param {"actor"|"producer"} role
 * @param {"actors"|"producers"} table
 * @param {{name:string, required:boolean, requiredMessage?:string, validate?:(v:any)=>string|null}} [extraColumn]
 *        the one field unique to this role (age for actors, company for producers)
 */
function createAuthController({ role, table, extraColumn }) {
  function signToken(row) {
    // role is baked into the token from the table it came from —
    // an actor's token can never claim to be a producer's.
    return jwt.sign({ userId: row.id, role, email: row.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  function publicUser(row) {
    const out = { id: row.id, role, name: row.name, email: row.email, phone: row.phone };
    if (extraColumn) out[extraColumn.name] = row[extraColumn.name];
    return out;
  }

  async function signup(req, res) {
    try {
      const { name, email, phone, password } = req.body;
      const extraVal = extraColumn ? req.body[extraColumn.name] : undefined;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Name is required" });
      }
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "A valid email is required" });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      if (extraColumn?.required) {
        const empty = extraVal === undefined || extraVal === null || String(extraVal).trim() === "";
        if (empty) return res.status(400).json({ error: extraColumn.requiredMessage });
      }
      if (extraColumn?.validate) {
        const validationError = extraColumn.validate(extraVal);
        if (validationError) return res.status(400).json({ error: validationError });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Uniqueness is checked only within THIS table — an email that
      // already exists as a producer is perfectly fine to sign up as
      // an actor, and vice versa. They become two unrelated rows.
      const existing = await pool.query(`SELECT id FROM ${table} WHERE email = $1`, [normalizedEmail]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: `An ${role} account with this email already exists` });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const columns = ["name", "email", "phone", "password_hash"];
      const values = [name.trim(), normalizedEmail, phone || null, passwordHash];
      if (extraColumn) {
        columns.push(extraColumn.name);
        values.push(
          extraColumn.name === "age"
            ? (extraVal ? Number(extraVal) : null)
            : String(extraVal).trim()
        );
      }
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

      const insert = await pool.query(
        `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
        values
      );

      const row = insert.rows[0];
      const token = signToken(row);
      return res.status(201).json({ token, user: publicUser(row) });
    } catch (err) {
      console.error(`${role} signup error:`, err);
      return res.status(500).json({ error: "Something went wrong creating your account" });
    }
  }

  async function login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "A valid email is required" });
      }
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Looks ONLY in this role's table. An actor's credentials simply
      // don't exist as far as the producer table is concerned (and
      // vice versa) — so this naturally returns "invalid" for a
      // cross-role login attempt, with no special-casing needed.
      const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [normalizedEmail]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: `Invalid email or password for ${role} login` });
      }

      const row = result.rows[0];
      const match = await bcrypt.compare(password, row.password_hash);
      if (!match) {
        return res.status(401).json({ error: `Invalid email or password for ${role} login` });
      }

      const token = signToken(row);
      return res.json({ token, user: publicUser(row) });
    } catch (err) {
      console.error(`${role} login error:`, err);
      return res.status(500).json({ error: "Something went wrong signing you in" });
    }
  }

  async function me(req, res) {
    try {
      const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [req.user.userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user: publicUser(result.rows[0]) });
    } catch (err) {
      console.error(`${role} me error:`, err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  return { signup, login, me };
}

module.exports = createAuthController;

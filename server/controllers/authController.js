const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function publicUser(row) {
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    phone: row.phone,
    age: row.age,
    company: row.company,
  };
}

// POST /api/auth/signup
async function signup(req, res) {
  try {
    const { role, name, email, phone, password, age, company } = req.body;

    if (!role || !["actor", "producer"].includes(role)) {
      return res.status(400).json({ error: "role must be 'actor' or 'producer'" });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (role === "producer" && (!company || !company.trim())) {
      return res.status(400).json({ error: "Company name is required for producers" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const insert = await pool.query(
      `INSERT INTO users (role, name, email, phone, password_hash, age, company)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, role, name, email, phone, age, company`,
      [
        role,
        name.trim(),
        normalizedEmail,
        phone || null,
        passwordHash,
        role === "actor" ? (age || null) : null,
        role === "producer" ? company.trim() : null,
      ]
    );

    const user = insert.rows[0];
    const token = signToken(user);

    return res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Something went wrong creating your account" });
  }
}

// POST /api/auth/login
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

    const result = await pool.query(
      `SELECT id, role, name, email, phone, age, company, password_hash
       FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    // Same error for "no user" and "wrong password" — don't leak which one.
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const row = result.rows[0];
    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(row);

    // role is returned explicitly so the frontend knows which
    // dashboard to redirect to (actor -> /actor-dashboard, producer -> /producer-dashboard)
    return res.json({ token, user: publicUser(row) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Something went wrong signing you in" });
  }
}

// GET /api/auth/me  (requires auth middleware)
async function me(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, role, name, email, phone, age, company FROM users WHERE id = $1`,
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user: publicUser(result.rows[0]) });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { signup, login, me };

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const actorAuthRoutes = require("./routes/actorAuth");
const producerAuthRoutes = require("./routes/producerAuth");
const actorProfileRoutes = require("./routes/actorProfile");
const castingCallRoutes = require("./routes/castingCalls");

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env — copy .env.example to .env and set it.");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

// Two fully separate auth systems — never share a route, a table, or a token shape.
app.use("/api/auth/actor", actorAuthRoutes);
app.use("/api/auth/producer", producerAuthRoutes);

// Actor profile (extended fields beyond auth) — actor-only, JWT protected.
app.use("/api/actor/profile", actorProfileRoutes);

// Producer's casting calls — producer-only, JWT protected. Creating one
// also emails the admin the full brief for manual actor matching.
app.use("/api/producer/casting-calls", castingCallRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

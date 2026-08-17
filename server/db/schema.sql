-- Casting.Home — auth schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  role           VARCHAR(20)  NOT NULL CHECK (role IN ('actor', 'producer')),
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL UNIQUE,
  phone          VARCHAR(50),
  password_hash  TEXT         NOT NULL,

  -- actor-only field
  age            INTEGER,

  -- producer-only field
  company        VARCHAR(255),

  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

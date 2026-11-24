ALTER TABLE users ADD COLUMN mfa_ciphertext text, ADD COLUMN mfa_last_step bigint;
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE INDEX rate_limits_expiry ON rate_limits(expires_at);

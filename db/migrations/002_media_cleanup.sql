CREATE TABLE media_cleanup (
 storage_key text PRIMARY KEY, queued_at timestamptz NOT NULL DEFAULT now()
);

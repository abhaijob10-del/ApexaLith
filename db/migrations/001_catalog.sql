CREATE TABLE users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), role text NOT NULL CHECK (role IN ('admin','customer')),
 phone text UNIQUE CHECK (phone ~ '^\+91[6-9][0-9]{9}$'), email text UNIQUE CHECK (email=lower(email)),
 password_hash text, name text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(),
 CHECK ((role='admin' AND email IS NOT NULL AND password_hash IS NOT NULL) OR (role='customer' AND phone IS NOT NULL AND password_hash IS NULL))
);
CREATE TABLE sessions (
 digest text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users, expires_at timestamptz NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);
CREATE TABLE otp_challenges (
 phone text PRIMARY KEY, digest text NOT NULL, expires_at timestamptz NOT NULL,
 resend_after timestamptz NOT NULL, attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0)
);
CREATE TABLE rate_limits (key text PRIMARY KEY, hits integer NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE media (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), storage_key text UNIQUE NOT NULL,
 mime text NOT NULL, width integer NOT NULL CHECK(width>0), height integer NOT NULL CHECK(height>0),
 bytes integer NOT NULL CHECK(bytes>0), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE listings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind text NOT NULL CHECK(kind IN ('apartment','design')),
 slug text UNIQUE NOT NULL CHECK(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), title text NOT NULL,
 description text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '',
 price_inr numeric(14,2) CHECK(price_inr>=0), bhk integer CHECK(bhk>0), carpet_sqft numeric CHECK(carpet_sqft>0),
 amenities text[] NOT NULL DEFAULT '{}', construction_status text, rera text, category text, specifications text,
 availability text CHECK(availability IN ('available','reserved','sold')), featured boolean NOT NULL DEFAULT false,
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
 floor_plan_id uuid REFERENCES media, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX listings_public ON listings(kind,status,featured DESC,created_at DESC);
CREATE TABLE listing_images (
 listing_id uuid NOT NULL REFERENCES listings, media_id uuid NOT NULL REFERENCES media,
 position integer NOT NULL CHECK(position>=0), PRIMARY KEY(listing_id,media_id), UNIQUE(listing_id,position)
);
CREATE TABLE saved_properties (
 user_id uuid REFERENCES users, listing_id uuid REFERENCES listings, PRIMARY KEY(user_id,listing_id)
);
CREATE TABLE enquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users, listing_id uuid REFERENCES listings,
 kind text NOT NULL CHECK(kind IN ('contact','enquiry','visit','booking')), name text NOT NULL,
 phone text, email text, message text NOT NULL DEFAULT '', requested_date date, notes text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','in_progress','closed')), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX enquiries_status ON enquiries(status,created_at DESC);
CREATE TABLE website_settings (key text PRIMARY KEY, value jsonb NOT NULL, media_id uuid REFERENCES media);
CREATE TABLE audit_log (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor_id uuid REFERENCES users,
 action text NOT NULL, object_id uuid, created_at timestamptz NOT NULL DEFAULT now()
);

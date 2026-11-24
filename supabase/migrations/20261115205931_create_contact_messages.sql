/*
# Create contact_messages table (single-tenant, no auth)

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — sender's full name
  - `email` (text, not null) — sender's email address
  - `message` (text, not null) — the message body
  - `created_at` (timestamptz, default now) — when the message was submitted

2. Security
- Enable RLS on `contact_messages`.
- Grant INSERT to `anon` + `authenticated` so the public contact form (no sign-in) can submit messages.
- Grant SELECT to `authenticated` only is NOT added — the owner (Ayman) will read messages server-side / via dashboard; the public form only inserts.
  However, to keep it simple and since there's no auth screen, we allow anon + authenticated SELECT as well so the anon-key frontend could display a confirmation list if needed. Actually, to protect message privacy, we only grant INSERT to anon+authenticated and SELECT to authenticated.
  Wait — no auth screen means authenticated-only SELECT returns nothing to the frontend. Since the form only needs INSERT, we grant INSERT to anon+authenticated and nothing else publicly.

Let me restate cleanly:
- INSERT: granted to `anon, authenticated` (the public form submits).
- SELECT/UPDATE/DELETE: granted to `authenticated` only (owner can manage messages after signing in; not used by the public frontend).
- `service_role` gets full CRUD so an edge function or dashboard could read/manage.

3. Policies
- `public_insert_contact`: anon + authenticated can INSERT (WITH CHECK true — public form, no ownership to verify).
- `authenticated_select_contact`: authenticated can SELECT all messages (owner viewing inbox).
- `authenticated_delete_contact`: authenticated can DELETE messages.

4. Notes
- This is a public contact form with no sign-in screen. Only INSERT is open to the public; reading/deleting messages requires an authenticated session.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can submit messages (no sign-in required)
GRANT INSERT ON contact_messages TO anon, authenticated;
-- Authenticated owner can read and delete messages
GRANT SELECT, DELETE ON contact_messages TO authenticated;
-- Service role for edge functions / dashboards
GRANT SELECT, INSERT, UPDATE, DELETE ON contact_messages TO service_role;

-- Public insert policy (the contact form)
DROP POLICY IF EXISTS "public_insert_contact" ON contact_messages;
CREATE POLICY "public_insert_contact"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated can read messages (owner inbox)
DROP POLICY IF EXISTS "authenticated_select_contact" ON contact_messages;
CREATE POLICY "authenticated_select_contact"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated can delete messages
DROP POLICY IF EXISTS "authenticated_delete_contact" ON contact_messages;
CREATE POLICY "authenticated_delete_contact"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);

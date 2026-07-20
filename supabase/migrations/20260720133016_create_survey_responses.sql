/*
# Create survey_responses table for shopping quiz

1. New Tables
- `survey_responses`
  - `id` (uuid, primary key)
  - `user_id` (uuid, NOT NULL, defaults to authenticated user, references auth.users)
  - `email` (text, NOT NULL)
  - `answers` (jsonb, NOT NULL) - full survey answers object
  - `personality_type` (text, NOT NULL) - derived shopping personality
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `survey_responses`.
- Owner-scoped CRUD: each authenticated user can only access their own rows.
- `user_id` defaults to `auth.uid()` so inserts omitting it still pass the WITH CHECK.
*/

CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  answers jsonb NOT NULL,
  personality_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_survey_responses" ON survey_responses;
CREATE POLICY "select_own_survey_responses" ON survey_responses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_survey_responses" ON survey_responses;
CREATE POLICY "insert_own_survey_responses" ON survey_responses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_survey_responses" ON survey_responses;
CREATE POLICY "update_own_survey_responses" ON survey_responses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_survey_responses" ON survey_responses;
CREATE POLICY "delete_own_survey_responses" ON survey_responses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

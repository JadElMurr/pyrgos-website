/*
  # Add Apartment Slug Column

  Adds unique slug column to apartments table for URL-friendly routing.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'apartments' AND column_name = 'slug'
  ) THEN
    ALTER TABLE apartments ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

/*
  # Recreate Pyrgos Schema for Buildings and Apartments

  1. Tables
    - `buildings`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Building name
      - `location` (text) - Location (Gazi, Glyfada)
      - `starting_price` (numeric) - Starting price
      - `description` (text) - Building description
      - `images` (jsonb) - Array of image URLs
      - `created_at` (timestamptz)

    - `apartments`
      - `id` (uuid, primary key)
      - `building_id` (uuid, foreign key)
      - `title` (text) - Apartment name (e.g., Gazi A1)
      - `price` (numeric)
      - `size_m2` (numeric) - Size in square meters
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `floor` (integer)
      - `features` (jsonb) - Array of feature strings
      - `images` (jsonb) - Array of image URLs
      - `created_at` (timestamptz)

    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
*/

DROP TABLE IF EXISTS contact_submissions;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS buildings;

CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  location text NOT NULL,
  starting_price numeric NOT NULL,
  description text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS apartments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  title text NOT NULL,
  price numeric NOT NULL,
  size_m2 numeric NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  floor integer NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view buildings"
  ON buildings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view apartments"
  ON apartments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
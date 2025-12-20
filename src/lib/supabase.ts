import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Building {
  id: string;
  slug: string;
  title: string;
  location: string;
  starting_price: number;
  description: string;
  images: string[];
  created_at: string;
}

export interface Apartment {
  id: string;
  building_id: string;
  slug: string;
  title: string;
  price: number;
  size_m2: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  description: string;
  features: string[];
  images: string[];
  created_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bxvqjolyzgfhqzsnhgix.supabase.co'; // substituir
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dnFqb2x5emdmaHF6c25oZ2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODI1MTYsImV4cCI6MjA5Mjg1ODUxNn0.Hs2Rw-JfH5CtaElcPME8er0WDFlurhWZJOzgJOCXSKc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
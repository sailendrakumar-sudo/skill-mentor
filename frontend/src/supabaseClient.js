import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kqltnldwtgxyfdjzinow.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbHRubGR3dGd4eWZkanppbm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDk0MDEsImV4cCI6MjEwNjc4NTQwMX0.nHCzFh5q9tfbUWVGD8629ntQBtOjs6-gKhQBWSkBCls';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;

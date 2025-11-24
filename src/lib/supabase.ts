import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mpshazhcbbmsyeugkzrp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc2hhemhjYmJtc3lldWdrenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjczNzEsImV4cCI6MjA3OTU0MzM3MX0.TrgJ8D8-eQA252i9jZODnIJFIgj3h-oiEyB2Zn6RePc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

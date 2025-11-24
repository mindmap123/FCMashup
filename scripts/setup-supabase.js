#!/usr/bin/env node

/**
 * Script pour créer automatiquement la table history dans Supabase
 * Usage: node scripts/setup-supabase.js
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mpshazhcbbmsyeugkzrp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc2hhemhjYmJtc3lldWdrenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjczNzEsImV4cCI6MjA3OTU0MzM3MX0.TrgJ8D8-eQA252i9jZODnIJFIgj3h-oiEyB2Zn6RePc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupSupabase() {
  console.log("🚀 Setting up Supabase...");
  console.log("📍 URL:", supabaseUrl);
  console.log("");

  try {
    // Test de connexion
    console.log("🔍 Testing connection...");
    const { data: testData, error: testError } = await supabase
      .from("history")
      .select("count")
      .limit(1);

    if (testError && testError.code === "42P01") {
      console.log("❌ Table 'history' does not exist");
      console.log("");
      console.log("⚠️  Please run the following SQL in Supabase SQL Editor:");
      console.log("");
      console.log("----------------------------------------");
      console.log(`
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  type TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at DESC);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON history
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access" ON history
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON history
  FOR DELETE
  USING (true);
      `);
      console.log("----------------------------------------");
      console.log("");
      console.log("📝 Or copy from: supabase-setup.sql");
      process.exit(1);
    }

    if (testError) {
      console.error("❌ Error connecting to Supabase:", testError);
      process.exit(1);
    }

    console.log("✅ Connection successful");
    console.log("");

    // Vérifier la structure de la table
    console.log("🔍 Checking table structure...");
    const { data, error } = await supabase.from("history").select("*").limit(1);

    if (error) {
      console.error("❌ Error querying table:", error);
      process.exit(1);
    }

    console.log("✅ Table 'history' exists and is accessible");
    console.log("");

    // Compter les entrées
    const { count, error: countError } = await supabase
      .from("history")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("❌ Error counting entries:", countError);
    } else {
      console.log(`📊 Current entries: ${count || 0}`);
    }

    console.log("");
    console.log("🎉 Supabase setup complete!");
    console.log("");
    console.log("✅ Next steps:");
    console.log("   1. Generate an image in the app");
    console.log("   2. Check Supabase Dashboard → Table Editor → history");
    console.log("   3. Verify the entry was created");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

setupSupabase();

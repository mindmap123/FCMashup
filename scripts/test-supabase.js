#!/usr/bin/env node

/**
 * Script de test automatique pour Supabase
 * Usage: node scripts/test-supabase.js
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mpshazhcbbmsyeugkzrp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc2hhemhjYmJtc3lldWdrenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjczNzEsImV4cCI6MjA3OTU0MzM3MX0.TrgJ8D8-eQA252i9jZODnIJFIgj3h-oiEyB2Zn6RePc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log("🧪 Testing Supabase Integration");
  console.log("================================");
  console.log("");

  let testId = null;

  try {
    // Test 1: Connexion
    console.log("1️⃣  Testing connection...");
    const { data: testData, error: testError } = await supabase
      .from("history")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("   ❌ Connection failed:", testError.message);
      console.log("");
      console.log("   ⚠️  Please create the table first:");
      console.log("   Run: node scripts/setup-supabase.js");
      process.exit(1);
    }

    console.log("   ✅ Connection successful");
    console.log("");

    // Test 2: Insertion
    console.log("2️⃣  Testing INSERT...");
    const testEntry = {
      image_url: `https://test.replicate.delivery/test-${Date.now()}.jpg`,
      type: "test",
      metadata: {
        sofaUrl: "https://test.com/sofa.jpg",
        fabricUrl: "https://test.com/fabric.jpg",
        model: "banana",
        description: "Test entry",
      },
    };

    const { data: insertData, error: insertError } = await supabase
      .from("history")
      .insert(testEntry)
      .select();

    if (insertError) {
      console.error("   ❌ INSERT failed:", insertError.message);
      process.exit(1);
    }

    testId = insertData[0].id;
    console.log("   ✅ INSERT successful (id:", testId + ")");
    console.log("");

    // Test 3: Lecture
    console.log("3️⃣  Testing SELECT...");
    const { data: selectData, error: selectError } = await supabase
      .from("history")
      .select("*")
      .eq("id", testId)
      .single();

    if (selectError) {
      console.error("   ❌ SELECT failed:", selectError.message);
      process.exit(1);
    }

    console.log("   ✅ SELECT successful");
    console.log("   📄 Data:", {
      id: selectData.id,
      image_url: selectData.image_url,
      type: selectData.type,
      created_at: selectData.created_at,
    });
    console.log("");

    // Test 4: Tri
    console.log("4️⃣  Testing ORDER BY...");
    const { data: orderData, error: orderError } = await supabase
      .from("history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (orderError) {
      console.error("   ❌ ORDER BY failed:", orderError.message);
      process.exit(1);
    }

    console.log("   ✅ ORDER BY successful");
    console.log("   📊 Latest entries:", orderData.length);
    console.log("");

    // Test 5: Suppression
    console.log("5️⃣  Testing DELETE...");
    const { error: deleteError } = await supabase
      .from("history")
      .delete()
      .eq("id", testId);

    if (deleteError) {
      console.error("   ❌ DELETE failed:", deleteError.message);
      process.exit(1);
    }

    console.log("   ✅ DELETE successful");
    console.log("");

    // Test 6: Vérifier la suppression
    console.log("6️⃣  Verifying deletion...");
    const { data: verifyData, error: verifyError } = await supabase
      .from("history")
      .select("*")
      .eq("id", testId)
      .maybeSingle();

    if (verifyError) {
      console.error("   ❌ Verification failed:", verifyError.message);
      process.exit(1);
    }

    if (verifyData) {
      console.error("   ❌ Entry still exists after deletion");
      process.exit(1);
    }

    console.log("   ✅ Entry successfully deleted");
    console.log("");

    // Test 7: Compter les entrées
    console.log("7️⃣  Counting total entries...");
    const { count, error: countError } = await supabase
      .from("history")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("   ❌ COUNT failed:", countError.message);
      process.exit(1);
    }

    console.log("   ✅ COUNT successful");
    console.log("   📊 Total entries:", count || 0);
    console.log("");

    // Résumé
    console.log("================================");
    console.log("🎉 All tests passed!");
    console.log("");
    console.log("✅ Supabase is ready for production");
    console.log("");
    console.log("Next steps:");
    console.log("  1. Generate an image in the app");
    console.log("  2. Check Supabase Dashboard");
    console.log("  3. Verify the entry was created");
  } catch (error) {
    console.error("❌ Unexpected error:", error);

    // Nettoyer l'entrée de test si elle existe
    if (testId) {
      try {
        await supabase.from("history").delete().eq("id", testId);
        console.log("🧹 Cleaned up test entry");
      } catch {
        // Ignore cleanup errors
      }
    }

    process.exit(1);
  }
}

testSupabase();

#!/usr/bin/env node

import { searchProperties, autocompleteProperties, getSearchStats } from "@/lib/redis";
import logger from "@/logger/logger";

async function testRedisSearch() {
  console.log("🔍 Testing Redis Search Functionality\n");

  try {
    // Test 1: Basic search
    console.log("1️⃣  Basic Search Test");
    const basicSearch = await searchProperties({
      query: "villa",
      limit: 5
    });
    console.log(`   Found ${basicSearch.total} properties matching 'villa'`);
    console.log(`   First result: ${basicSearch.properties[0]?.name || 'No results'}\n`);

    // Test 2: Filtered search
    console.log("2️⃣  Filtered Search Test");
    const filteredSearch = await searchProperties({
      filters: {
        type: ["Villas"],
        priceMin: 100000,
        priceMax: 1000000,
        beds: ["3", "4"],
        isFeatured: true
      },
      limit: 3
    });
    console.log(`   Found ${filteredSearch.total} featured villas (3-4 beds, $100K-$1M)`);
    filteredSearch.properties.forEach((p: any, i: number) => {
      console.log(`   ${i + 1}. ${p.name} - $${p.price?.toLocaleString()}`);
    });
    console.log();

    // Test 3: Autocomplete
    console.log("3️⃣  Autocomplete Test");
    const suggestions = await autocompleteProperties("lux", 5);
    console.log(`   Autocomplete suggestions for 'lux':`);
    suggestions.forEach((suggestion: string, i: number) => {
      console.log(`   ${i + 1}. ${suggestion}`);
    });
    console.log();

    // Test 4: Sorting
    console.log("4️⃣  Sorting Test");
    const sortedSearch = await searchProperties({
      query: "*",
      sort: {
        by: "price",
        order: "DESC"
      },
      limit: 3
    });
    console.log(`   Top 3 most expensive properties:`);
    sortedSearch.properties.forEach((p: any, i: number) => {
      console.log(`   ${i + 1}. ${p.name} - $${p.price?.toLocaleString()}`);
    });
    console.log();

    // Test 5: Complex multi-filter search
    console.log("5️⃣  Complex Multi-Filter Test");
    const complexSearch = await searchProperties({
      query: "modern",
      filters: {
        status: ["Ready_To_Move"],
        property_type: ["Residential"],
        popular_features: ["Basement"],
        beds: ["3", "4", "5"],
        priceMin: 200000
      },
      sort: {
        by: "createdAt",
        order: "DESC"
      },
      limit: 5
    });
    console.log(`   Found ${complexSearch.total} modern residential properties with basement`);
    complexSearch.properties.forEach((p: any, i: number) => {
      console.log(`   ${i + 1}. ${p.name} - ${p.status} - ${p.beds} beds`);
    });
    console.log();

    // Test 6: Search stats
    console.log("6️⃣  Search Index Statistics");
    const stats = await getSearchStats();
    if (stats) {
      // Parse Redis info response
      const info: Record<string, string> = {};
      for (let i = 0; i < stats.length; i += 2) {
        info[stats[i]] = stats[i + 1];
      }
      console.log(`   Index name: ${info.index_name || 'N/A'}`);
      console.log(`   Total documents: ${info.num_docs || 'N/A'}`);
      console.log(`   Index size: ${info.inverted_sz_mb || 'N/A'} MB`);
      console.log(`   Total terms: ${info.num_terms || 'N/A'}`);
    }
    console.log();

    // Performance benchmark
    console.log("7️⃣  Performance Benchmark");
    const startTime = Date.now();
    const promises = Array.from({ length: 10 }, (_, i) => 
      searchProperties({
        query: `test${i}`,
        limit: 10
      })
    );
    await Promise.all(promises);
    const endTime = Date.now();
    console.log(`   Executed 10 concurrent searches in ${endTime - startTime}ms`);
    console.log(`   Average per search: ${(endTime - startTime) / 10}ms\n`);

    console.log("✅ All tests completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    logger.error("Redis search test failed:", error);
  }
}

// Run tests if called directly
if (require.main === module) {
  testRedisSearch()
    .then(() => {
      console.log("\n🎉 Redis Search testing complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Testing failed:", error);
      process.exit(1);
    });
}

export { testRedisSearch };

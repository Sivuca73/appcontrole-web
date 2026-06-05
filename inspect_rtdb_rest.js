import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_FIREBASE_DATABASE_URL || "https://appcontrole-994de-default-rtdb.firebaseio.com/";

async function inspect() {
  try {
    const cleanUrl = dbUrl.endsWith('/') ? dbUrl : dbUrl + '/';
    console.log("Analyzing weeks database structure...");
    
    // Fetch all nodes
    const nodes = ["designacoes_semana", "designacoes_fim_semana", "apoio_mecanica"];
    const results = {};
    for (const key of nodes) {
      const res = await fetch(`${cleanUrl}${key}.json`);
      if (res.ok) {
        results[key] = await res.json();
      }
    }
    
    // Let's list all keys found recursively
    for (const [nodeName, nodeVal] of Object.entries(results)) {
      console.log(`\n=== NODE: ${nodeName} ===`);
      if (!nodeVal) {
        console.log("Empty");
        continue;
      }
      for (const [year, months] of Object.entries(nodeVal)) {
        console.log(`  Year: "${year}"`);
        for (const [month, weeks] of Object.entries(months)) {
          console.log(`    Month: "${month}"`);
          if (weeks && typeof weeks === 'object') {
            for (const [weekKey, weekData] of Object.entries(weeks)) {
              console.log(`      Week Key: "${weekKey}"`);
              console.log(`        Data keys:`, Object.keys(weekData));
              if (weekData.semana) {
                console.log(`        semana property:`, weekData.semana);
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error inspecting:", err);
  }
}

inspect();

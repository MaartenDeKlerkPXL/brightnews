const cron = require('node-cron');

// CONFIGURATIE: Check in je andere terminal op welke poort je site draait!
// In je vorige bericht zag ik poort 3006. Pas dit aan als het anders is.
const PORT = 3000; 

async function triggerUpdate() {
  const url = `http://localhost:${PORT}/api/process-rss`;
  const timestamp = new Date().toLocaleTimeString();
  
  console.log(`[${timestamp}] 📡 Poging tot update op ${url}...`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Server reageert met status ${response.status}`);
    
    const data = await response.json();
    console.log(`[${timestamp}] ✅ Succes! Artikelen toegevoegd: ${data.added || 0}`);
  } catch (error) {
    console.error(`[${timestamp}] ❌ Update mislukt: ${error.message}`);
    console.log("Check of je Next.js server wel aan staat op poort " + PORT);
  }
}

// Startbericht
console.log("------------------------------------------");
console.log("🚀 BrightNews Auto-Pomp Geactiveerd");
console.log(`⏰ Planning: Elk uur op het hele uur (:00)`);
console.log(`🔗 Doel: http://localhost:${PORT}/api/process-rss`);
console.log("------------------------------------------");

// Voer direct een eerste update uit bij het opstarten
triggerUpdate();

// Plan de taak voor elk uur
cron.schedule('0 * * * *', () => {
  triggerUpdate();
});

// Zorg dat het proces niet afsluit
process.stdin.resume();
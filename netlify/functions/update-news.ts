import { schedule } from "@netlify/functions";

// Dit is de Cron expressie voor 10:00 UTC (11:00 Amsterdam)
// Formaat: "minuut uur dag maand weekdag"
export const handler = schedule("0 10 * * *", async (event) => {
  console.log("Nieuws update gestart...");

  try {
    // We roepen je bestaande API aan
    const response = await fetch("https://brightnews.netlify.app/api/process-rss", {
      method: "POST", // Gebruik POST voor veiligheid
      headers: {
        "Authorization": `Bearer ${process.env.CRON_SECRET}` // Optionele beveiliging
      }
    });

    const data = await response.json();
    console.log(`Update voltooid: ${data.added} artikelen toegevoegd.`);
    
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error("Update mislukt:", error);
    return {
      statusCode: 500,
    };
  }
});
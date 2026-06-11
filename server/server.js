import "dotenv/config";
import app from "./src/app.js";
import connectToMongoDB from "./src/configs/mongodb.config.js";
import { initPdfCluster, closePdfCluster } from "./src/services/pdfPool.service.js";

connectToMongoDB();

// Initialise Puppeteer cluster for PDF generation
initPdfCluster().catch((err) => {
  console.error("Failed to initialise PDF cluster:", err.message);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing PDF cluster and server...");
  await closePdfCluster();
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, closing PDF cluster and server...");
  await closePdfCluster();
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

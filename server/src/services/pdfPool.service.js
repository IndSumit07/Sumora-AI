import { Cluster } from "puppeteer-cluster";
import { CONFIG } from "../configs/app.config.js";

let cluster = null;

/**
 * Initialise the Puppeteer cluster for PDF generation.
 * Reuses browser instances across requests to avoid per-request launch overhead.
 */
export async function initPdfCluster() {
  if (cluster) return cluster;

  cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 3,
    puppeteerOptions: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  // Define the PDF generation task once
  await cluster.task(async ({ page, data: { htmlContent } }) => {
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: CONFIG.pdf.FORMAT,
      margin: {
        top: CONFIG.pdf.MARGIN_TOP,
        bottom: CONFIG.pdf.MARGIN_BOTTOM,
        left: CONFIG.pdf.MARGIN_LEFT,
        right: CONFIG.pdf.MARGIN_RIGHT,
      },
      pageRanges: CONFIG.pdf.PAGE_RANGES,
      scale: CONFIG.pdf.SCALE,
    });

    return pdfBuffer;
  });

  return cluster;
}

/**
 * Generate a PDF from HTML content using the shared cluster.
 */
export async function generatePdfFromHtml(htmlContent) {
  const pdfCluster = await initPdfCluster();
  return pdfCluster.execute({ htmlContent });
}

/**
 * Gracefully close the PDF cluster on application shutdown.
 */
export async function closePdfCluster() {
  if (cluster) {
    await cluster.close();
    cluster = null;
  }
}

import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
  try {
    const { htmlContent, width = 1200, height = 1200 } = await request.json(); // Square aspect ratio

    // Define base URL for assets
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: false, // Use 'new' headless mode
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width, height });

    // Set HTML content with absolute URLs
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Arial&display=swap');
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background-color: #37591e;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              width: ${width}px;
              height: ${height}px;
            }
            .post {
              position: relative;
              width: 100%;
              height: 100%;
              background-image: url('${baseUrl}/background.jpg');
              background-size: cover;
              background-position: center;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              padding: 32px;
            }
            .overlay {
              position: absolute;
              inset: 0;
              background-color: rgba(0, 0, 0, 0.5); /* Primary with 60% opacity */
            }
            .logo {
              position: absolute;
              top: 32px;
              left: 16px;
              width: 64px;
              height: 64px;
              z-index: 3;
              object-fit: contain;
            }
            .pastor {
              position: absolute;
              bottom: 50px;
              right: 16px;
              width: 150px;
              height: 150px;
              border-radius: 50%;
              object-fit: cover;
              z-index: 3;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Optional shadow */
            }
            .content {
              position: relative;
              max-width: 600px;
              z-index: 10;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .quote {
              font-size: 24px;
              font-weight: 500;
              color: #ffffff;
              margin-bottom: 24px;
              line-height: 1.5;
              max-width: 100%;
            }
            .attribution {
              font-size: 18px;
              color: #f5f5ec;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="post">
            <div class="overlay"></div>
            <img class="logo" src="${baseUrl}/logo-trans-crop.png" alt="Church Logo" />
            <img class="pastor" src="${baseUrl}/pjakes.jpeg" alt="Pastor" />
            <div class="content">
              ${htmlContent}
            </div>
          </div>
        </body>
      </html>
    `);

    // Wait for images to load
    await page.waitForSelector("img", { timeout: 5000 });

    // Capture screenshot
    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width, height },
    });

    await browser.close();

    return new NextResponse(screenshot, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename=faith-post-${new Date()
          .toISOString()
          .slice(0, 10)}.png`,
      },
    });
  } catch (err) {
    console.error("Puppeteer error:", err);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

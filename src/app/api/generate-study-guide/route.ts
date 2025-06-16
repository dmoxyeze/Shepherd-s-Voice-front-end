import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  try {
    const { guide, title } = await request.json();

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Embed the standard Helvetica font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add a new page (A4 size)
    const page = pdfDoc.addPage([595.28, 841.89]);

    // Set up styles
    const titleSize = 20;
    const bodySize = 12;
    const footerSize = 10;

    // Add header with your green color
    page.drawRectangle({
      x: 0,
      y: page.getHeight() - 50,
      width: page.getWidth(),
      height: 50,
      color: rgb(0.2, 0.35, 0.12), // #37591e equivalent
    });

    // Add title (centered)
    const titleWidth = font.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: (page.getWidth() - titleWidth) / 2,
      y: page.getHeight() - 35,
      size: titleSize,
      font,
      color: rgb(1, 1, 1), // White
    });

    // Add body content
    const lines = guide.split("\n");
    let y = page.getHeight() - 100; // Start below header

    for (const line of lines) {
      if (line.trim()) {
        page.drawText(line, {
          x: 50,
          y,
          size: bodySize,
          font,
          color: rgb(0, 0, 0), // Black
        });
        y -= 15;
      } else {
        y -= 5; // Smaller gap for empty lines
      }

      // Add new page if needed
      if (y < 50) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        y = newPage.getHeight() - 50;
      }
    }

    // Add footer with your secondary color
    const footerText = `Generated on: ${new Date().toLocaleDateString()}`;
    page.drawText(footerText, {
      x: page.getWidth() - font.widthOfTextAtSize(footerText, footerSize) - 50,
      y: 30,
      size: footerSize,
      font,
      color: rgb(0.65, 0.81, 0.07), // #a6ce11 equivalent
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title
          .toLowerCase()
          .replace(/\s+/g, "-")}-study-guide.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

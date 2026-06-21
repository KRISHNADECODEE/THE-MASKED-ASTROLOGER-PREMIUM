import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dob, tob, pob, tier } = body;

    if (!name || !dob || !tob || !pob) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real application, we would use Puppeteer to generate the PDF or fetch from a service:
    // const pdfBuffer = await generatePdfUsingPuppeteer({ name, dob, tob, pob, tier });
    // return new Response(pdfBuffer, { headers: { 'Content-Type': 'application/pdf' } });

    // Simulate PDF generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: `${tier === "premium" ? "Premium" : "Free"} PDF generated successfully.`,
      downloadUrl: `/downloads/kundli_${name.toLowerCase()}_${tier}.pdf`,
    });
  } catch (error: any) {
    console.error("PDF generation API error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF: " + error.message },
      { status: 500 }
    );
  }
}

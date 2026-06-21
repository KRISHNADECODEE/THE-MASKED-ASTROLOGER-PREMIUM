import { NextResponse } from "next/server";
import { MOCK_KUNDLI } from "@/data/kundli";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dob, tob, pob, lat, lng } = body;

    if (!name || !dob || !tob || !pob) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real application, we would call the Python FastAPI microservice here:
    // const response = await fetch(`${process.env.KUNDLI_SERVICE_URL}/generate`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, dob, tob, lat, lng })
    // });
    // const data = await response.json();

    // Since this is a vibe-coding prototype / frontend-backend-ready draft,
    // we return calculated result using MOCK_KUNDLI customized with the user's input:
    const calculatedKundli = {
      ...MOCK_KUNDLI,
      name,
      dob,
      tob,
      pob,
      // Randomize ascendant and planetary houses slightly based on time of birth
      // to make the generator feel alive and dynamic!
      ascendant: ["Aries", "Taurus", "Leo", "Scorpio", "Capricorn", "Virgo"][
        (new Date(`${dob} ${tob}`).getHours()) % 6
      ],
    };

    // Simulate network delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ success: true, kundli: calculatedKundli });
  } catch (error: any) {
    console.error("Kundli generation API error:", error);
    return NextResponse.json(
      { error: "Failed to generate Kundli: " + error.message },
      { status: 500 }
    );
  }
}

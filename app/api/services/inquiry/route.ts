import { NextResponse } from "next/server";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select an IT service"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = inquirySchema.parse(body);

    // Log the inquiry for administration & notification
    console.log("[SERVICE_INQUIRY_RECEIVED]", {
      timestamp: new Date().toISOString(),
      service: validatedData.service,
      name: validatedData.name,
      email: validatedData.email,
      budget: validatedData.budget,
      timeline: validatedData.timeline,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your IT service inquiry has been received. Our technical team will review your specifications and contact you within 24 hours.",
        data: {
          service: validatedData.service,
          submittedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error processing service inquiry" },
      { status: 500 }
    );
  }
}

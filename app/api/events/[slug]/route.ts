import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();

    const { slug } = await params;

    if (slug === undefined || slug.trim() === "" || slug === null) {
      return NextResponse.json(
        {
          message: "Invalid slug parameter",
          error: "Slug cannot be empty or undefined",
        },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.toLowerCase().trim();

    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      return NextResponse.json(
        {
          message: "Event not found",
          error: `No event found with slug: ${slug}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

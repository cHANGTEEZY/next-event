import { Event, IEvent } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries()) as unknown as IEvent;
    } catch (error) {
      return NextResponse.json(
        {
          message: "Inavalid form data",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          message: "Image file is required.",
          error: "No file provided or corrupted file.",
        },
        { status: 400 }
      );
    }

    let tags = JSON.parse(formData.get("tags") as string);
    let agenda = JSON.parse(formData.get("agenda") as string);

    const imageData = await file.arrayBuffer();

    const buffer = Buffer.from(imageData);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "next-event",
            },
            (error, results) => {
              if (error) {
                return reject(error);
              }
              if (!results) {
                return reject(new Error("Upload failed: No results returned"));
              }
              resolve(results);
            }
          )
          .end(buffer);
      }
    );

    // Assign the secure URL to the event image
    event.image = uploadResult.secure_url;

    const createdEvent = await Event.create({
      ...event,
      tags,
      agenda,
    });

    return NextResponse.json(
      {
        message: "Event create successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Events fetched successfully",
        events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch events",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

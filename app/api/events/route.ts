import { Event } from "@/database";
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

    // Extract agenda and tags as arrays
    const agenda = formData.getAll("agenda") as string[];
    const tags = formData.getAll("tags") as string[];

    // Extract other fields
    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      overview: formData.get("overview") as string,
      venue: formData.get("venue") as string,
      location: formData.get("location") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      mode: formData.get("mode") as string,
      audience: formData.get("audience") as string,
      organizer: formData.get("organizer") as string,
      agenda,
      tags,
    };

    // Upload image to Cloudinary
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

    // Create event with uploaded image URL
    const createdEvent = await Event.create({
      ...eventData,
      image: uploadResult.secure_url,
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
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

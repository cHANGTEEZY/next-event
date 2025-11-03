"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await connectDB();

    if (!eventId || !email) {
      console.error("Missing required fields:", { eventId, email });
      return {
        success: false,
        error: "Event ID and email are required",
      };
    }

    await Booking.create({ eventId, email });

    return { success: true };
  } catch (e) {
    console.error("Create booking failed:", e);

    // Check if it's a duplicate key error (MongoDB error code 11000)
    if (e && typeof e === "object" && "code" in e && e.code === 11000) {
      return {
        success: false,
        error: "You have already booked this event with this email address.",
      };
    }

    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
};

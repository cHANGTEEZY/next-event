"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";

export const getSimilarEventBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });

    if (!event) {
      return [];
    }

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .limit(3)
      .lean();

    console.log("Similar Events:", similarEvents);

    return similarEvents;
  } catch (error) {
    console.error("Error fetching similar events:", error);
    throw new Error("Failed to fetch similar events");
  }
};

import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * TypeScript interface for Event document
 * Extends mongoose Document for proper typing
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event Schema Definition
 * Includes validation rules and automatic timestamp generation
 */
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Event overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Event image is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, "Event mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be either online, offline, or hybrid",
      },
      trim: true,
    },
    audience: {
      type: String,
      required: [true, "Event audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Event agenda is required"],
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0;
        },
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Event organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Event tags are required"],
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0;
        },
        message: "Tags must contain at least one item",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook for slug generation and data normalization
 * - Generates URL-friendly slug from title (only if title is modified or document is new)
 * - Normalizes date to ISO format (YYYY-MM-DD)
 * - Ensures time format consistency (HH:MM)
 */
EventSchema.pre("save", function (next) {
  // Generate slug only if title is new or modified
  if (this.isNew || this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified("date")) {
    try {
      const dateObj = new Date(this.date);
      if (isNaN(dateObj.getTime())) {
        return next(new Error("Invalid date format"));
      }
      // Store in ISO format (YYYY-MM-DD)
      this.date = dateObj.toISOString().split("T")[0];
    } catch {
      return next(new Error("Invalid date format"));
    }
  }

  // Validate and normalize time format (HH:MM)
  if (this.isModified("time")) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(this.time)) {
      return next(new Error("Time must be in HH:MM format (24-hour)"));
    }
  }

  next();
});

/**
 * Create index on slug for faster queries
 */
EventSchema.index({ slug: 1 });

/**
 * Event Model
 * Use existing model if available (prevents OverwriteModelError in development)
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;

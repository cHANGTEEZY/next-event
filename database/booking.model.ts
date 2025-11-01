import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * TypeScript interface for Booking document
 * Extends mongoose Document for proper typing
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Schema Definition
 * References Event model and includes email validation
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook to verify that the referenced Event exists
 * Throws an error if the Event document is not found in the database
 */
BookingSchema.pre("save", async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isNew || this.isModified("eventId")) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = mongoose.model("Event");

      const eventExists = await Event.findById(this.eventId);

      if (!eventExists) {
        return next(new Error(`Event with ID ${this.eventId} does not exist`));
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
      return next(new Error("Failed to validate event reference"));
    }
  }

  next();
});

/**
 * Create index on eventId for faster queries
 * Useful for retrieving all bookings for a specific event
 */
BookingSchema.index({ eventId: 1 });

/**
 * Compound index on eventId and email to prevent duplicate bookings
 * Ensures one email can only book an event once
 */
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

/**
 * Booking Model
 * Use existing model if available (prevents OverwriteModelError in development)
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;

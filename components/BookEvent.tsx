"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { success, error: bookingError } = await createBooking({
      eventId,
      email,
    });

    setLoading(false);

    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", { eventId, slug, email });
    } else {
      setError(bookingError || "Booking creation failed");
      posthog.capture("booking_failed", {
        eventId,
        slug,
        email,
        error: bookingError,
      });
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="error-message"
              style={{
                color: "#ef4444",
                fontSize: "0.875rem",
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#fee2e2",
                borderRadius: "0.375rem",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;

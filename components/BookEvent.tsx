"use client";
import React from "react";

const BookEvent = () => {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (data: { email: string }) => {
    console.log("Booking submitted for email:", data.email);

    setTimeout(() => {
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div id="book-event">
      {submitted ? (
        <div className="confirmation-message">
          <p className="text-sm">
            We have received your booking request. A confirmation email has been
            sent to {email}.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            handleSubmit({ email });
          }}
          className="booking-form"
        >
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;

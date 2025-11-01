/**
 * Database Models Export
 * Central export point for all Mongoose models
 * Allows importing models from a single location throughout the application
 */

export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Export types for use in other parts of the application
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";

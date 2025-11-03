"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CreateEventForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "offline",
    audience: "",
    organizer: "",
  });

  const [agenda, setAgenda] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgendaChange = (index: number, value: string) => {
    const newAgenda = [...agenda];
    newAgenda[index] = value;
    setAgenda(newAgenda);
  };

  const addAgendaItem = () => {
    setAgenda([...agenda, ""]);
  };

  const removeAgendaItem = (index: number) => {
    if (agenda.length > 1) {
      setAgenda(agenda.filter((_, i) => i !== index));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formDataToSend = new FormData(form);

      // Add agenda and tags as JSON strings
      const filteredAgenda = agenda.filter((item) => item.trim() !== "");
      const filteredTags = tags.filter((tag) => tag.trim() !== "");

      if (filteredAgenda.length === 0) {
        setError("Please add at least one agenda item");
        setLoading(false);
        return;
      }

      if (filteredTags.length === 0) {
        setError("Please add at least one tag");
        setLoading(false);
        return;
      }

      // Append each agenda item and tag individually
      filteredAgenda.forEach((item) => {
        formDataToSend.append("agenda", item);
      });

      filteredTags.forEach((tag) => {
        formDataToSend.append("tags", tag);
      });

      const response = await fetch("/api/events", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create event");
      }

      // Redirect to the created event page
      router.push(`/events/${data.event.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="create-event-form-container">
      <div className="form-header">
        <h1>Create New Event</h1>
        <p>Fill in the details below to create your event</p>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            color: "#ef4444",
            backgroundColor: "#fee2e2",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="event-form">
        {/* Basic Information */}
        <section className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the event"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="overview">Overview *</label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              placeholder="Detailed overview of the event"
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Event Image *</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div style={{ marginTop: "1rem" }}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  style={{ borderRadius: "0.5rem", objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Event Details */}
        <section className="form-section">
          <h2>Event Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue *</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              placeholder="e.g., Convention Center Hall A"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., San Francisco, CA"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mode">Event Mode *</label>
            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              required
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="audience">Target Audience *</label>
            <input
              type="text"
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleInputChange}
              placeholder="e.g., Developers, Designers, Students"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizer">Organizer *</label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleInputChange}
              placeholder="Name of the organizing person or company"
              required
            />
          </div>
        </section>

        {/* Agenda */}
        <section className="form-section">
          <h2>Agenda</h2>
          {agenda.map((item, index) => (
            <div key={index} className="form-group-array">
              <input
                type="text"
                value={item}
                onChange={(e) => handleAgendaChange(index, e.target.value)}
                placeholder={`Agenda item ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeAgendaItem(index)}
                className="btn-remove"
                disabled={agenda.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addAgendaItem} className="btn-add">
            + Add Agenda Item
          </button>
        </section>

        {/* Tags */}
        <section className="form-section">
          <h2>Tags</h2>
          {tags.map((tag, index) => (
            <div key={index} className="form-group-array">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder={`Tag ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="btn-remove"
                disabled={tags.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addTag} className="btn-add">
            + Add Tag
          </button>
        </section>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;

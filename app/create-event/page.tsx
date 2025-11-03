import CreateEventForm from "@/components/CreateEventForm";

export const metadata = {
  title: "Create Event | DevEvent",
  description: "Create a new event",
};

const CreateEventPage = () => {
  return (
    <main className="create-event-page">
      <CreateEventForm />
    </main>
  );
};

export default CreateEventPage;

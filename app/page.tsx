import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { cacheLife } from "next/cache";

const Home = async () => {
  "use cache";

  cacheLife("hours");

  let events: any[] = [];

  try {
    await connectDB();
    events = await Event.find().sort({ createdAt: -1 }).limit(12).lean();
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <section>
      <h1 className="text-center">
        The hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetup, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7 ">
        <h3>Featured Events</h3>
        <ul className="events it">
          {events && events.length > 0 ? (
            events.map((event) => (
              <li key={event._id.toString()} className="list-none">
                <EventCard
                  title={event.title}
                  image={event.image}
                  slug={event.slug}
                  location={event.location}
                  date={event.date}
                  time={event.time}
                />
              </li>
            ))
          ) : (
            <p className="text-center text-light-200">
              No events available at the moment.
            </p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Home;

import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { BASE_URL } from "@/lib/constants";
import { cacheLife } from "next/cache";

const Home = async () => {
  "use cache";
  cacheLife("hours");

  const response = await fetch(`${BASE_URL}/events`, {
    cache: "no-store",
  });

  const { events } = await response.json();

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
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard
                  title={event.title}
                  image={event.image}
                  slug={event.slug}
                  location={event.location}
                  date={event.date}
                  time={event.time}
                />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;

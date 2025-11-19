import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import hackathonImage from "@assets/generated_images/Students_at_BITSA_hackathon_372741c9.png";
import workshopImage from "@assets/generated_images/BITSA_technology_workshop_event_da22ab63.png";
import heroImage from "@assets/generated_images/BITSA_students_collaborating_together_b50f10ca.png";

const mockEvents = [
  {
    id: "1",
    title: "BITSA Website Hackathon",
    date: "2025-12-15",
    time: "9:00 AM - 5:00 PM",
    location: "BITSA Lab",
    attendeeCount: "45",
    imageUrl: hackathonImage,
  },
  {
    id: "2",
    title: "Web Development Workshop",
    date: "2025-12-20",
    time: "2:00 PM - 5:00 PM",
    location: "Computer Lab 2",
    attendeeCount: "32",
    imageUrl: workshopImage,
  },
  {
    id: "3",
    title: "Tech Career Fair 2025",
    date: "2026-01-10",
    time: "10:00 AM - 4:00 PM",
    location: "Main Hall",
    attendeeCount: "120",
    imageUrl: heroImage,
  },
  {
    id: "4",
    title: "AI & Machine Learning Seminar",
    date: "2026-01-15",
    time: "3:00 PM - 6:00 PM",
    location: "Lecture Hall A",
    attendeeCount: "78",
    imageUrl: workshopImage,
  },
  {
    id: "5",
    title: "Mobile App Development Bootcamp",
    date: "2026-01-25",
    time: "9:00 AM - 5:00 PM",
    location: "Computer Lab 1",
    attendeeCount: "40",
    imageUrl: hackathonImage,
  },
  {
    id: "6",
    title: "Cybersecurity Awareness Workshop",
    date: "2026-02-05",
    time: "1:00 PM - 4:00 PM",
    location: "BITSA Lab",
    attendeeCount: "55",
    imageUrl: heroImage,
  },
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const displayEvents = events.length > 0 ? events : mockEvents;

  const filteredEvents = displayEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen border-4">
      <div className="bg-card border-b-4 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-events-title">
            Upcoming Events
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Join us for workshops, hackathons, seminars, and networking events designed to enhance your IT skills
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10 border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-events"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-8">Loading events...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date.toString()}
                  time={event.time}
                  location={event.location}
                  attendeeCount={event.attendeeCount || "0"}
                  imageUrl={event.imageUrl || undefined}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-16 border-2 rounded-md">
                <p className="text-muted-foreground" data-testid="text-no-events">
                  No events found matching your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

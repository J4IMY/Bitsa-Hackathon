import { EventCard } from "../EventCard";
import hackathonImage from "@assets/generated_images/Students_at_BITSA_hackathon_372741c9.png";

export default function EventCardExample() {
  return (
    <div className="p-8 max-w-md">
      <EventCard
        title="BITSA Website Hackathon"
        date="2025-12-15"
        time="9:00 AM - 5:00 PM"
        location="BITSA Lab"
        attendeeCount="45"
        imageUrl={hackathonImage}
      />
    </div>
  );
}

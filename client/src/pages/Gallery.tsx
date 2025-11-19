import { GalleryCard } from "@/components/GalleryCard";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import hackathonImage from "@assets/generated_images/Students_at_BITSA_hackathon_372741c9.png";
import workshopImage from "@assets/generated_images/BITSA_technology_workshop_event_da22ab63.png";
import heroImage from "@assets/generated_images/BITSA_students_collaborating_together_b50f10ca.png";

// todo: remove mock functionality
const mockGalleryImages = [
  {
    id: "1",
    imageUrl: hackathonImage,
    title: "Annual Hackathon 2024",
    caption: "Students working on innovative projects",
    category: "Hackathons",
    uploadedAt: "2024-10-20",
  },
  {
    id: "2",
    imageUrl: workshopImage,
    title: "Web Dev Workshop",
    caption: "Learning modern web technologies",
    category: "Workshops",
    uploadedAt: "2024-11-05",
  },
  {
    id: "3",
    imageUrl: heroImage,
    title: "Team Collaboration",
    caption: "BITSA members brainstorming ideas",
    category: "Meetups",
    uploadedAt: "2024-09-15",
  },
  {
    id: "4",
    imageUrl: hackathonImage,
    title: "Code Sprint",
    caption: "Intense coding session at hackathon",
    category: "Hackathons",
    uploadedAt: "2024-10-21",
  },
  {
    id: "5",
    imageUrl: workshopImage,
    title: "Guest Speaker Event",
    caption: "Industry expert sharing insights",
    category: "Workshops",
    uploadedAt: "2024-11-10",
  },
  {
    id: "6",
    imageUrl: heroImage,
    title: "BITSA Meetup",
    caption: "Monthly networking event",
    category: "Meetups",
    uploadedAt: "2024-10-30",
  },
  {
    id: "7",
    imageUrl: workshopImage,
    title: "Mobile Dev Session",
    caption: "Building mobile applications",
    category: "Workshops",
    uploadedAt: "2024-11-15",
  },
  {
    id: "8",
    imageUrl: hackathonImage,
    title: "Winners Announcement",
    caption: "Celebrating hackathon champions",
    category: "Hackathons",
    uploadedAt: "2024-10-22",
  },
  {
    id: "9",
    imageUrl: heroImage,
    title: "Networking Night",
    caption: "Connecting with industry professionals",
    category: "Meetups",
    uploadedAt: "2024-11-01",
  },
];

const categories = ["All", "Hackathons", "Workshops", "Meetups"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredImages = mockGalleryImages.filter(
    (image) => selectedCategory === "All" || image.category === selectedCategory
  );

  return (
    <div className="min-h-screen border-4">
      <div className="bg-card border-b-4 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-gallery-title">
            Photo Gallery
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Explore moments captured from our events, workshops, and community activities
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
                data-testid={`badge-gallery-filter-${category}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredImages.map((image) => (
            <GalleryCard key={image.id} {...image} />
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-16 border-2 rounded-md">
            <p className="text-muted-foreground" data-testid="text-no-images">
              No images found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

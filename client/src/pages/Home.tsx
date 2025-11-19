import { Hero } from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
import { BlogCard } from "@/components/BlogCard";
import { GalleryCard } from "@/components/GalleryCard";
import { MembershipBenefits } from "@/components/MembershipBenefits";
import { Newsletter } from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import hackathonImage from "@assets/generated_images/Students_at_BITSA_hackathon_372741c9.png";
import workshopImage from "@assets/generated_images/BITSA_technology_workshop_event_da22ab63.png";
import heroImage from "@assets/generated_images/BITSA_students_collaborating_together_b50f10ca.png";

// todo: remove mock functionality
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
];

const mockBlogPosts = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    excerpt: "Learn how to build type-safe React applications with TypeScript. This comprehensive guide covers setup, best practices, and common patterns.",
    category: "Tutorial",
    imageUrl: workshopImage,
    authorName: "Jane Smith",
    publishedAt: "2025-11-15",
    slug: "react-typescript-guide",
  },
  {
    id: "2",
    title: "BITSA Hackathon 2024 Recap",
    excerpt: "An exciting overview of our annual hackathon, featuring innovative projects, talented participants, and amazing prizes.",
    category: "Events",
    imageUrl: hackathonImage,
    authorName: "John Doe",
    publishedAt: "2025-11-10",
    slug: "hackathon-2024-recap",
  },
  {
    id: "3",
    title: "Top 10 Programming Languages in 2025",
    excerpt: "Explore the most in-demand programming languages this year and understand which ones to learn for your career growth.",
    category: "Tech Trends",
    imageUrl: heroImage,
    authorName: "Mike Johnson",
    publishedAt: "2025-11-05",
    slug: "top-programming-languages-2025",
  },
];

const mockGalleryImages = [
  {
    id: "1",
    imageUrl: hackathonImage,
    title: "Annual Hackathon 2024",
    caption: "Students working on innovative projects",
    uploadedAt: "2024-10-20",
  },
  {
    id: "2",
    imageUrl: workshopImage,
    title: "Web Dev Workshop",
    caption: "Learning modern web technologies",
    uploadedAt: "2024-11-05",
  },
  {
    id: "3",
    imageUrl: heroImage,
    title: "Team Collaboration",
    caption: "BITSA members brainstorming ideas",
    uploadedAt: "2024-09-15",
  },
  {
    id: "4",
    imageUrl: hackathonImage,
    title: "Code Sprint",
    caption: "Intense coding session at hackathon",
    uploadedAt: "2024-10-21",
  },
  {
    id: "5",
    imageUrl: workshopImage,
    title: "Guest Speaker Event",
    caption: "Industry expert sharing insights",
    uploadedAt: "2024-11-10",
  },
  {
    id: "6",
    imageUrl: heroImage,
    title: "BITSA Meetup",
    caption: "Monthly networking event",
    uploadedAt: "2024-10-30",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="py-12 md:py-20 border-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-upcoming-events">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Join us for exciting workshops, hackathons, and networking events
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" data-testid="button-view-all-events">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-card border-y-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-latest-posts">
                Latest Blog Posts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Stay updated with tech insights, tutorials, and BITSA news
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" data-testid="button-view-all-posts">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockBlogPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 border-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-gallery-highlight">
                Gallery Highlights
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Moments captured from our events and activities
              </p>
            </div>
            <Link href="/gallery">
              <Button variant="outline" data-testid="button-view-all-gallery">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {mockGalleryImages.map((image) => (
              <GalleryCard key={image.id} {...image} />
            ))}
          </div>
        </div>
      </section>

      <MembershipBenefits />

      <Newsletter />
    </div>
  );
}

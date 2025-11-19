import { BlogCard } from "../BlogCard";
import workshopImage from "@assets/generated_images/BITSA_technology_workshop_event_da22ab63.png";

export default function BlogCardExample() {
  return (
    <div className="p-8 max-w-md">
      <BlogCard
        title="How to Build Your First Web Application"
        excerpt="Learn the fundamentals of web development and create your first full-stack application with React and Node.js"
        category="Tutorial"
        imageUrl={workshopImage}
        authorName="John Doe"
        publishedAt="2025-11-15"
        slug="build-first-web-app"
      />
    </div>
  );
}

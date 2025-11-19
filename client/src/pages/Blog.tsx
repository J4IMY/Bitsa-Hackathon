import { BlogCard } from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import hackathonImage from "@assets/generated_images/Students_at_BITSA_hackathon_372741c9.png";
import workshopImage from "@assets/generated_images/BITSA_technology_workshop_event_da22ab63.png";
import heroImage from "@assets/generated_images/BITSA_students_collaborating_together_b50f10ca.png";

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
  {
    id: "4",
    title: "Building Your First Mobile App",
    excerpt: "A step-by-step guide to creating your first mobile application using React Native and modern development tools.",
    category: "Tutorial",
    imageUrl: workshopImage,
    authorName: "Sarah Williams",
    publishedAt: "2025-11-01",
    slug: "first-mobile-app",
  },
  {
    id: "5",
    title: "Cybersecurity Best Practices for Students",
    excerpt: "Essential security tips every IT student should know to protect their data and online presence.",
    category: "Security",
    imageUrl: heroImage,
    authorName: "David Brown",
    publishedAt: "2025-10-28",
    slug: "cybersecurity-tips",
  },
  {
    id: "6",
    title: "The Future of AI in Education",
    excerpt: "Exploring how artificial intelligence is transforming the educational landscape and creating new opportunities.",
    category: "Tech Trends",
    imageUrl: hackathonImage,
    authorName: "Emily Chen",
    publishedAt: "2025-10-20",
    slug: "ai-in-education",
  },
];

const categories = ["All", "Tutorial", "Events", "Tech Trends", "Security"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const displayPosts = blogPosts.length > 0 ? blogPosts : mockBlogPosts;

  const filteredPosts = displayPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen border-4">
      <div className="bg-card border-b-4 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-title">
            BITSA Blog
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Tech insights, tutorials, event recaps, and updates from the BITSA community
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-10 border-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-posts"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
                data-testid={`badge-category-filter-${category}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-8">Loading blog posts...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post) => (
                <BlogCard 
                  key={post.id} 
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  imageUrl={post.imageUrl || undefined}
                  authorName="BITSA Team"
                  publishedAt={post.publishedAt.toString()}
                  slug={post.slug}
                />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16 border-2 rounded-md">
                <p className="text-muted-foreground" data-testid="text-no-posts">
                  No blog posts found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

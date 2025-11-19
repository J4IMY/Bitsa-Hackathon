import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { Link } from "wouter";

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  authorName: string;
  authorAvatar?: string;
  publishedAt: string;
  slug: string;
}

export function BlogCard({
  title,
  excerpt,
  category,
  imageUrl,
  authorName,
  authorAvatar,
  publishedAt,
  slug,
}: BlogCardProps) {
  const dateObj = new Date(publishedAt);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200 border-2 flex flex-col h-full">
      {imageUrl && (
        <div className="aspect-video overflow-hidden border-b-2">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <Badge variant="secondary" data-testid={`badge-category-${category}`}>
            {category}
          </Badge>
        </div>

        <h3 className="font-semibold text-xl mb-3 line-clamp-2" data-testid="text-blog-title">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1" data-testid="text-blog-excerpt">
          {excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium" data-testid="text-author-name">{authorName}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span data-testid="text-published-date">{formattedDate}</span>
          </div>
        </div>

        <Link
          href={`/blog/${slug}`}
          className="mt-4 text-sm font-medium text-primary hover:underline"
          data-testid="link-read-more"
        >
          Read More →
        </Link>
      </div>
    </Card>
  );
}

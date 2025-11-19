import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Calendar, ArrowLeft, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function BlogPostDetail() {
    const params = useParams<{ slug: string }>();
    const [, setLocation] = useLocation();
    const slug = params.slug;

    const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
        queryKey: [`/api/blog/slug/${slug}`],
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (error || !blogPost) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        The blog post you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => setLocation("/blog")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blog
                    </Button>
                </div>
            </div>
        );
    }

    const dateObj = new Date(blogPost.publishedAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-card border-b-4">
                <div className="container mx-auto px-4 py-8">
                    <Link href="/blog">
                        <Button variant="ghost" className="mb-6" data-testid="button-back-to-blog">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>

                    <div className="max-w-4xl mx-auto">
                        <Badge variant="secondary" className="mb-4" data-testid="badge-category">
                            {blogPost.category}
                        </Badge>

                        <h1 className="text-3xl md:text-5xl font-bold mb-6" data-testid="text-blog-title">
                            {blogPost.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={undefined} />
                                    <AvatarFallback>
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium" data-testid="text-author">BITSA Team</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span data-testid="text-published-date">{formattedDate}</span>
                            </div>
                        </div>

                        {blogPost.imageUrl && (
                            <div className="aspect-video overflow-hidden rounded-lg border-2 mb-8">
                                <img
                                    src={blogPost.imageUrl}
                                    alt={blogPost.title}
                                    className="w-full h-full object-cover"
                                    data-testid="image-blog-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <Card className="p-8 md:p-12 border-2">
                        {/* Excerpt */}
                        <div className="mb-8 pb-8 border-b-2">
                            <p className="text-lg text-muted-foreground leading-relaxed italic" data-testid="text-excerpt">
                                {blogPost.excerpt}
                            </p>
                        </div>

                        {/* Main Content */}
                        <div
                            className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
                prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                prose-a:text-primary prose-a:underline prose-a:font-medium
                prose-strong:text-foreground prose-strong:font-bold
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:my-2 prose-li:text-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-primary
                prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-6
                prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-6
                prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: blogPost.content }}
                            data-testid="content-blog-body"
                        />
                    </Card>

                    {/* Navigation */}
                    <div className="mt-12 text-center">
                        <Button onClick={() => setLocation("/blog")} size="lg" data-testid="button-back-bottom">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to All Posts
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

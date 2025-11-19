import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  insertBlogPostSchema,
  insertEventSchema,
  insertGalleryImageSchema,
  type BlogPost,
  type Event,
  type GalleryImage,
} from "@shared/schema";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";

// Form schemas
const blogPostFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
});

const eventFormSchema = insertEventSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date(),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  attendeeCount: z.string().default("0"),
});

const galleryImageFormSchema = insertGalleryImageSchema.extend({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("Must be a valid URL"),
});

type BlogPostFormData = z.infer<typeof blogPostFormSchema>;
type EventFormData = z.infer<typeof eventFormSchema>;
type GalleryImageFormData = z.infer<typeof galleryImageFormSchema>;

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Dialog states
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "You must be an admin to access this page.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, authLoading, setLocation, toast]);

  // Queries
  const { data: blogPosts = [], isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: galleryImages = [], isLoading: galleryLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  // Blog post form
  const blogForm = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      imageUrl: "",
      authorId: user?.id || "",
    },
  });

  // Event form
  const eventForm = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "",
      location: "",
      imageUrl: "",
      attendeeCount: "0",
    },
  });

  // Gallery image form
  const galleryForm = useForm<GalleryImageFormData>({
    resolver: zodResolver(galleryImageFormSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      caption: "",
      category: "",
    },
  });

  // Auto-generate slug from title for blog posts
  const watchBlogTitle = blogForm.watch("title");
  useEffect(() => {
    if (!editingBlogPost && watchBlogTitle) {
      const slug = watchBlogTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      blogForm.setValue("slug", slug);
    }
  }, [watchBlogTitle, editingBlogPost, blogForm]);

  // Mutations
  const createBlogPostMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      const response = await apiRequest("POST", "/api/blog", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Success", description: "Blog post created successfully" });
      setBlogDialogOpen(false);
      blogForm.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPostFormData> }) => {
      const response = await apiRequest("PUT", `/api/blog/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Success", description: "Blog post updated successfully" });
      setBlogDialogOpen(false);
      setEditingBlogPost(null);
      blogForm.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Success", description: "Blog post deleted successfully" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Success", description: "Event created successfully" });
      setEventDialogOpen(false);
      eventForm.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EventFormData> }) => {
      const response = await apiRequest("PUT", `/api/events/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Success", description: "Event updated successfully" });
      setEventDialogOpen(false);
      setEditingEvent(null);
      eventForm.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Success", description: "Event deleted successfully" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const createGalleryImageMutation = useMutation({
    mutationFn: async (data: GalleryImageFormData) => {
      const response = await apiRequest("POST", "/api/gallery", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Success", description: "Gallery image created successfully" });
      setGalleryDialogOpen(false);
      galleryForm.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const updateGalleryImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GalleryImageFormData> }) => {
      const response = await apiRequest("PUT", `/api/gallery/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Success", description: "Gallery image updated successfully" });
      setGalleryDialogOpen(false);
      setEditingGalleryImage(null);
      galleryForm.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  const deleteGalleryImageMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Success", description: "Gallery image deleted successfully" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "Please log in again", variant: "destructive" });
        window.location.href = "/api/login";
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  // Handlers
  const handleCreateBlogPost = () => {
    setEditingBlogPost(null);
    blogForm.reset({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      imageUrl: "",
      authorId: user?.id || "",
    });
    setBlogDialogOpen(true);
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    blogForm.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || "",
      authorId: post.authorId,
    });
    setBlogDialogOpen(true);
  };

  const handleDeleteBlogPost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogPostMutation.mutate(id);
    }
  };

  const handleBlogSubmit = (data: BlogPostFormData) => {
    if (editingBlogPost) {
      updateBlogPostMutation.mutate({ id: editingBlogPost.id, data });
    } else {
      createBlogPostMutation.mutate(data);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    eventForm.reset({
      title: "",
      description: "",
      date: new Date(),
      time: "",
      location: "",
      imageUrl: "",
      attendeeCount: "0",
    });
    setEventDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    eventForm.reset({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      time: event.time,
      location: event.location,
      imageUrl: event.imageUrl || "",
      attendeeCount: event.attendeeCount || "0",
    });
    setEventDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(id);
    }
  };

  const handleEventSubmit = (data: EventFormData) => {
    // Convert date to proper Date object if it's a string
    const eventData = {
      ...data,
      date: data.date instanceof Date ? data.date : new Date(data.date),
    };

    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data: eventData });
    } else {
      createEventMutation.mutate(eventData);
    }
  };

  const handleCreateGalleryImage = () => {
    setEditingGalleryImage(null);
    galleryForm.reset({
      title: "",
      imageUrl: "",
      caption: "",
      category: "",
    });
    setGalleryDialogOpen(true);
  };

  const handleEditGalleryImage = (image: GalleryImage) => {
    setEditingGalleryImage(image);
    galleryForm.reset({
      title: image.title,
      imageUrl: image.imageUrl,
      caption: image.caption || "",
      category: image.category || "",
    });
    setGalleryDialogOpen(true);
  };

  const handleDeleteGalleryImage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this gallery image?")) {
      deleteGalleryImageMutation.mutate(id);
    }
  };

  const handleGallerySubmit = (data: GalleryImageFormData) => {
    if (editingGalleryImage) {
      updateGalleryImageMutation.mutate({ id: editingGalleryImage.id, data });
    } else {
      createGalleryImageMutation.mutate(data);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage blog posts, events, and gallery images
        </p>
      </div>

      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-3" data-testid="tabs-admin">
          <TabsTrigger value="blog" data-testid="tab-blog">
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">
            Events
          </TabsTrigger>
          <TabsTrigger value="gallery" data-testid="tab-gallery">
            Gallery
          </TabsTrigger>
        </TabsList>

        {/* Blog Posts Tab */}
        <TabsContent value="blog" data-testid="content-blog">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>Manage your blog posts</CardDescription>
                </div>
                <Button onClick={handleCreateBlogPost} data-testid="button-create-blog">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blogLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : blogPosts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground" data-testid="text-no-blog-posts">
                  No blog posts found. Create your first post!
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id} data-testid={`row-blog-${post.id}`}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell className="font-mono text-sm">{post.slug}</TableCell>
                        <TableCell>
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBlogPost(post)}
                              data-testid={`button-edit-blog-${post.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBlogPost(post.id)}
                              disabled={deleteBlogPostMutation.isPending}
                              data-testid={`button-delete-blog-${post.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" data-testid="content-events">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>Manage your events</CardDescription>
                </div>
                <Button onClick={handleCreateEvent} data-testid="button-create-event">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground" data-testid="text-no-events">
                  No events found. Create your first event!
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id} data-testid={`row-event-${event.id}`}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                              data-testid={`button-edit-event-${event.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                              disabled={deleteEventMutation.isPending}
                              data-testid={`button-delete-event-${event.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" data-testid="content-gallery">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gallery Images</CardTitle>
                  <CardDescription>Manage your gallery images</CardDescription>
                </div>
                <Button onClick={handleCreateGalleryImage} data-testid="button-create-gallery">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {galleryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : galleryImages.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground" data-testid="text-no-gallery-images">
                  No gallery images found. Create your first image!
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Image URL</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {galleryImages.map((image) => (
                      <TableRow key={image.id} data-testid={`row-gallery-${image.id}`}>
                        <TableCell className="font-medium">{image.title}</TableCell>
                        <TableCell>{image.category || "—"}</TableCell>
                        <TableCell className="font-mono text-sm truncate max-w-xs">
                          {image.imageUrl}
                        </TableCell>
                        <TableCell>
                          {new Date(image.uploadedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditGalleryImage(image)}
                              data-testid={`button-edit-gallery-${image.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteGalleryImage(image.id)}
                              disabled={deleteGalleryImageMutation.isPending}
                              data-testid={`button-delete-gallery-${image.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Blog Post Dialog */}
      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-blog">
          <DialogHeader>
            <DialogTitle>
              {editingBlogPost ? "Edit Blog Post" : "Create Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {editingBlogPost
                ? "Update the blog post details below"
                : "Fill in the details to create a new blog post"}
            </DialogDescription>
          </DialogHeader>
          <Form {...blogForm}>
            <form onSubmit={blogForm.handleSubmit(handleBlogSubmit)} className="space-y-4">
              <FormField
                control={blogForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-blog-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-blog-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-blog-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} data-testid="input-blog-excerpt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your blog post content here..."
                        className="min-h-[300px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? ""}
                        data-testid="input-blog-imageUrl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBlogDialogOpen(false)}
                  data-testid="button-cancel-blog"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createBlogPostMutation.isPending || updateBlogPostMutation.isPending
                  }
                  data-testid="button-submit-blog"
                >
                  {(createBlogPostMutation.isPending || updateBlogPostMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingBlogPost ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-event">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Create Event"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent
                ? "Update the event details below"
                : "Fill in the details to create a new event"}
            </DialogDescription>
          </DialogHeader>
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(handleEventSubmit)} className="space-y-4">
              <FormField
                control={eventForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-event-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} data-testid="input-event-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-event-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={eventForm.control}
                  name="time"
                  render={({ field }) => {
                    // Helper to safely parse time
                    const parseTime = (value: string) => {
                      if (!value) return { h: "", m: "" };
                      const parts = value.split(':');
                      if (parts.length < 2) return { h: "", m: "" };

                      let h = parts[0];
                      let m = parts[1];

                      // Validate hour (must be 00-23)
                      if (!/^[0-2][0-9]$/.test(h)) {
                        // Try to fix single digit
                        if (/^[0-9]$/.test(h)) h = h.padStart(2, '0');
                        else h = ""; // Invalid
                      }

                      // Validate minute (must be 00, 05, ... 55)
                      // We only check if it's 2 digits for now to allow custom times if they exist,
                      // but for the Select value we need exact matches.
                      // If it's not a valid step, the Select will show placeholder, which is fine.
                      // But we want to ensure we don't preserve garbage when changing one part.

                      return { h, m };
                    };

                    const { h: currentHours, m: currentMinutes } = parseTime(field.value);

                    return (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Select
                              value={currentHours}
                              onValueChange={(val) => {
                                // If minutes is invalid/empty, default to 00
                                const safeMinutes = /^[0-5][0-9]$/.test(currentMinutes) ? currentMinutes : "00";
                                field.onChange(`${val}:${safeMinutes}`);
                              }}
                            >
                              <SelectTrigger className="w-[120px]" data-testid="select-event-hour">
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }).map((_, i) => {
                                  const val = i.toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={i} value={val}>
                                      {val}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <span className="text-xl font-bold">:</span>
                            <Select
                              value={currentMinutes}
                              onValueChange={(val) => {
                                // If hours is invalid/empty, default to 12
                                const safeHours = /^[0-2][0-9]$/.test(currentHours) ? currentHours : "12";
                                field.onChange(`${safeHours}:${val}`);
                              }}
                            >
                              <SelectTrigger className="w-[120px]" data-testid="select-event-minute">
                                <SelectValue placeholder="Minute" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }).map((_, i) => {
                                  const val = (i * 5).toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={i} value={val}>
                                      {val}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                control={eventForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-event-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="attendeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attendee Count</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-event-attendeeCount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        value={field.value ?? ""}
                        data-testid="input-event-imageUrl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEventDialogOpen(false)}
                  data-testid="button-cancel-event"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createEventMutation.isPending || updateEventMutation.isPending
                  }
                  data-testid="button-submit-event"
                >
                  {(createEventMutation.isPending || updateEventMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingEvent ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Gallery Image Dialog */}
      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-gallery">
          <DialogHeader>
            <DialogTitle>
              {editingGalleryImage ? "Edit Gallery Image" : "Create Gallery Image"}
            </DialogTitle>
            <DialogDescription>
              {editingGalleryImage
                ? "Update the gallery image details below"
                : "Fill in the details to create a new gallery image"}
            </DialogDescription>
          </DialogHeader>
          <Form {...galleryForm}>
            <form onSubmit={galleryForm.handleSubmit(handleGallerySubmit)} className="space-y-4">
              <FormField
                control={galleryForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-gallery-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={galleryForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        value={field.value || ""}
                        data-testid="input-gallery-imageUrl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={galleryForm.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        value={field.value || ""}
                        rows={3}
                        data-testid="input-gallery-caption"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={galleryForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (optional)</FormLabel>
                    <FormControl>
                      <Input
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        value={field.value || ""}
                        data-testid="input-gallery-category"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGalleryDialogOpen(false)}
                  data-testid="button-cancel-gallery"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createGalleryImageMutation.isPending ||
                    updateGalleryImageMutation.isPending
                  }
                  data-testid="button-submit-gallery"
                >
                  {(createGalleryImageMutation.isPending ||
                    updateGalleryImageMutation.isPending) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                  {editingGalleryImage ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

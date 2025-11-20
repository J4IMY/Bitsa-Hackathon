import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare, Plus, Upload, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Discussion = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    authorEmail: string | null;
    replyCount: number;
};

export default function Discussion() {
    const { toast } = useToast();
    const { isAuthenticated, user } = useAuth();
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "", imageUrl: "" });
    const [imagePreview, setImagePreview] = useState<string>("");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "Image size should be less than 5MB",
                    variant: "destructive",
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setNewDiscussion({ ...newDiscussion, imageUrl: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImagePreview("");
        setNewDiscussion({ ...newDiscussion, imageUrl: "" });
    };

    const { data: discussions, isLoading } = useQuery<Discussion[]>({
        queryKey: ["discussions"],
        queryFn: async () => {
            const res = await fetch("/api/discussions");
            if (!res.ok) throw new Error("Failed to fetch discussions");
            return res.json();
        },
    });

    const createDiscussionMutation = useMutation({
        mutationFn: async (data: { title: string; content: string; imageUrl?: string }) => {
            const res = await fetch("/api/discussions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (res.status === 413) {
                throw new Error("PAYLOAD_TOO_LARGE");
            }

            if (!res.ok) throw new Error("Failed to create discussion");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discussions"] });
            setDialogOpen(false);
            setNewDiscussion({ title: "", content: "", imageUrl: "" });
            setImagePreview("");
            toast({
                title: "Success",
                description: "Discussion created successfully",
            });
        },
        onError: (error: Error) => {
            const message = error.message === "PAYLOAD_TOO_LARGE"
                ? "Image size is too large. Please use a smaller image (recommended under 5MB)."
                : "Failed to create discussion";

            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        },
    });

    const deleteDiscussionMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/discussions/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete discussion");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discussions"] });
            toast({
                title: "Success",
                description: "Discussion deleted successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete discussion",
                variant: "destructive",
            });
        },
    });

    const handleCreateDiscussion = () => {
        if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
            toast({
                title: "Validation Error",
                description: "Title and content are required",
                variant: "destructive",
            });
            return;
        }
        createDiscussionMutation.mutate(newDiscussion);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this discussion?")) {
            deleteDiscussionMutation.mutate(id);
        }
    };

    const getAuthorName = (discussion: Discussion) => {
        if (discussion.authorFirstName || discussion.authorLastName) {
            return `${discussion.authorFirstName || ""} ${discussion.authorLastName || ""}`.trim();
        }
        return discussion.authorEmail || "Anonymous";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Discussion Room</h1>
                    <p className="text-muted-foreground mt-2">
                        Join the conversation and share your thoughts
                    </p>
                </div>
                {isAuthenticated && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Discussion
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Start a New Discussion</DialogTitle>
                                <DialogDescription>Share your ideas with the community</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Title</label>
                                    <Input
                                        placeholder="Enter discussion title"
                                        value={newDiscussion.title}
                                        onChange={(e) =>
                                            setNewDiscussion({ ...newDiscussion, title: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Content</label>
                                    <Textarea
                                        placeholder="What would you like to discuss?"
                                        value={newDiscussion.content}
                                        onChange={(e) =>
                                            setNewDiscussion({ ...newDiscussion, content: e.target.value })
                                        }
                                        rows={6}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Image (optional)</label>
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-full rounded-md max-h-60 object-cover" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={clearImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed rounded-md p-6 text-center">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <label className="cursor-pointer">
                                                <span className="text-sm text-primary hover:underline">Upload an image</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                            <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={handleCreateDiscussion}
                                    disabled={createDiscussionMutation.isPending}
                                    className="w-full"
                                >
                                    {createDiscussionMutation.isPending ? "Creating..." : "Create Discussion"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {!isAuthenticated && (
                <Card className="mb-8 border-primary/50">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                            Please <Link href="/auth" className="text-primary hover:underline">sign in</Link> to start a new discussion
                        </p>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading discussions...</p>
                </div>
            ) : discussions && discussions.length > 0 ? (
                <div className="space-y-4">
                    {discussions.map((discussion) => (
                        <Link key={discussion.id} href={`/discussion/${discussion.id}`}>
                            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex items-start justify-between">
                                        <span className="flex-1">{discussion.title}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground font-normal">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{discussion.replyCount}</span>
                                            </div>
                                            {user?.isAdmin && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={(e) => handleDelete(e, discussion.id)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {discussion.imageUrl && (
                                        <img
                                            src={discussion.imageUrl}
                                            alt="Discussion"
                                            className="w-full rounded-md mb-4 max-h-48 object-cover"
                                        />
                                    )}
                                    <p className="text-muted-foreground line-clamp-2 mb-4">
                                        {discussion.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>By {getAuthorName(discussion)}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No discussions yet. Be the first to start one!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

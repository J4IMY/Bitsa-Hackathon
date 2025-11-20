import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, MessageSquare, Send, Upload, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type DiscussionDetail = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    authorEmail: string | null;
    replies: Reply[];
};

type Reply = {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    authorEmail: string | null;
};

export default function DiscussionDetail() {
    const [, params] = useRoute("/discussion/:id");
    const id = params?.id;
    const { toast } = useToast();
    const { isAuthenticated, user } = useAuth();
    const queryClient = useQueryClient();
    const [replyContent, setReplyContent] = useState("");
    const [replyImage, setReplyImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    const { data: discussion, isLoading } = useQuery<DiscussionDetail>({
        queryKey: ["discussion", id],
        queryFn: async () => {
            const res = await fetch(`/api/discussions/${id}`);
            if (!res.ok) throw new Error("Failed to fetch discussion");
            return res.json();
        },
        enabled: !!id,
    });

    const createReplyMutation = useMutation({
        mutationFn: async (data: { content: string; imageUrl?: string }) => {
            const res = await fetch(`/api/discussions/${id}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (res.status === 413) {
                throw new Error("PAYLOAD_TOO_LARGE");
            }

            if (!res.ok) throw new Error("Failed to create reply");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discussion", id] });
            setReplyContent("");
            setReplyImage("");
            setImagePreview("");
            toast({
                title: "Success",
                description: "Reply posted successfully",
            });
        },
        onError: (error: Error) => {
            const message = error.message === "PAYLOAD_TOO_LARGE"
                ? "Image size is too large. Please use a smaller image (recommended under 5MB)."
                : "Failed to post reply";

            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        },
    });

    const deleteReplyMutation = useMutation({
        mutationFn: async (replyId: string) => {
            const res = await fetch(`/api/discussions/${id}/replies/${replyId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete reply");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discussion", id] });
            toast({
                title: "Success",
                description: "Reply deleted successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete reply",
                variant: "destructive",
            });
        },
    });

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
                setReplyImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImagePreview("");
        setReplyImage("");
    };

    const handleReply = () => {
        if (!replyContent.trim()) {
            toast({
                title: "Validation Error",
                description: "Reply content is required",
                variant: "destructive",
            });
            return;
        }
        createReplyMutation.mutate({ content: replyContent, imageUrl: replyImage || undefined });
    };

    const handleDeleteReply = (replyId: string) => {
        if (confirm("Are you sure you want to delete this reply?")) {
            deleteReplyMutation.mutate(replyId);
        }
    };

    const getAuthorName = (item: { authorFirstName: string | null; authorLastName: string | null; authorEmail: string | null }) => {
        if (item.authorFirstName || item.authorLastName) {
            return `${item.authorFirstName || ""} ${item.authorLastName || ""}`.trim();
        }
        return item.authorEmail || "Anonymous";
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-muted-foreground">Loading discussion...</p>
            </div>
        );
    }

    if (!discussion) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Discussion not found</p>
                        <Link href="/discussion">
                            <Button className="mt-4">Back to Discussions</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/discussion">
                <Button variant="ghost" className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Discussions
                </Button>
            </Link>

            {/* Main Discussion */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-3xl">{discussion.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <span>By {getAuthorName(discussion)}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    {discussion.imageUrl && (
                        <img
                            src={discussion.imageUrl}
                            alt="Discussion"
                            className="w-full rounded-md mb-4 max-h-96 object-cover"
                        />
                    )}
                    <p className="whitespace-pre-wrap">{discussion.content}</p>
                </CardContent>
            </Card>

            {/* Reply Form */}
            {isAuthenticated ? (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl">Post a Reply</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={4}
                        />
                        <div>
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="w-full rounded-md max-h-48 object-cover" />
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
                                <div className="border-2 border-dashed rounded-md p-4 text-center">
                                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                    <label className="cursor-pointer">
                                        <span className="text-sm text-primary hover:underline">Add an image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-1">Max 5MB (optional)</p>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={handleReply}
                            disabled={createReplyMutation.isPending}
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="mb-8 border-primary/50">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                            Please <Link href="/auth" className="text-primary hover:underline">sign in</Link> to post a reply
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Replies */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <MessageSquare className="h-5 w-5" />
                    <span>{discussion.replies.length} {discussion.replies.length === 1 ? "Reply" : "Replies"}</span>
                </div>

                {discussion.replies.length > 0 ? (
                    <div className="space-y-4">
                        {discussion.replies.map((reply) => (
                            <Card key={reply.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">{getAuthorName(reply)}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                                        </div>
                                        {user?.isAdmin && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteReply(reply.id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                    {reply.imageUrl && (
                                        <img
                                            src={reply.imageUrl}
                                            alt="Reply"
                                            className="w-full rounded-md mb-3 max-h-64 object-cover"
                                        />
                                    )}
                                    <p className="whitespace-pre-wrap">{reply.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState, useRef } from "react";
import { User, Save, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    studentId: z.string().optional(),
    course: z.string().optional(),
    yearOfStudy: z.string().optional(),
    phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
    const { user, isLoading, refetchUser } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            studentId: user?.studentId || "",
            course: user?.course || "",
            yearOfStudy: user?.yearOfStudy || "",
            phone: user?.phone || "",
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        try {
            const response = await apiRequest("PUT", "/api/auth/profile", data);
            const result = await response.json();

            toast({
                title: "Success",
                description: result.message || "Profile updated successfully",
            });

            await refetchUser();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file (PNG, JPG, etc.)",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB",
                variant: "destructive",
            });
            return;
        }

        setIsUploadingAvatar(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result as string;

            try {
                const response = await apiRequest("POST", "/api/auth/upload-avatar", {
                    imageData: base64Data,
                });
                const result = await response.json();

                toast({
                    title: "Success",
                    description: result.message || "Profile picture updated successfully",
                });

                await refetchUser();
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to upload profile picture",
                    variant: "destructive",
                });
            } finally {
                setIsUploadingAvatar(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <p className="text-center py-12">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-muted-foreground mb-4">Please login to view your profile</p>
                            <Button onClick={() => window.location.href = "/auth"}>Login</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="relative inline-block">
                        <Avatar className="h-24 w-24 mx-auto mb-4 border-4">
                            <AvatarImage src={user.profileImageUrl || undefined} />
                            <AvatarFallback className="text-2xl">
                                {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="absolute bottom-4 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                            title="Change profile picture"
                            data-testid="button-upload-avatar"
                        >
                            {isUploadingAvatar ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Camera className="h-4 w-4" />
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            data-testid="input-avatar-file"
                        />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
                    <p className="text-muted-foreground">Manage your account information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Update your bio data and student information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        {...register("firstName")}
                                        placeholder="Enter your first name"
                                        data-testid="input-first-name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-destructive">{errors.firstName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        {...register("lastName")}
                                        placeholder="Enter your last name"
                                        data-testid="input-last-name" />
                                    {errors.lastName && (
                                        <p className="text-sm text-destructive">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email || ""}
                                    disabled
                                    className="bg-muted"
                                    data-testid="input-email"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg">Student Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="studentId">Student ID</Label>
                                    <Input
                                        id="studentId"
                                        {...register("studentId")}
                                        placeholder="e.g., S20230001"
                                        data-testid="input-student-id"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="course">Course</Label>
                                        <Input
                                            id="course"
                                            {...register("course")}
                                            placeholder="e.g., Computer Science"
                                            data-testid="input-course"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="yearOfStudy">Year of Study</Label>
                                        <Input
                                            id="yearOfStudy"
                                            {...register("yearOfStudy")}
                                            placeholder="e.g., Year 3"
                                            data-testid="input-year-of-study"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        {...register("phone")}
                                        placeholder="e.g., +254 712 345 678"
                                        data-testid="input-phone"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-w-32"
                                    data-testid="button-save-profile"
                                >
                                    {isSubmitting ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Created:</span>
                            <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Updated:</span>
                            <span>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Type:</span>
                            <span className="font-medium">{user.isAdmin ? "Admin" : "Student"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

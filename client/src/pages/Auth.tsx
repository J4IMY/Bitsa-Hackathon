import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Phone, GraduationCap, Calendar, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

// Validation schemas
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    studentId: z.string().optional(),
    course: z.string().optional(),
    yearOfStudy: z.string().optional(),
    phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function Auth() {
    const [, navigate] = useLocation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("login");

    const loginForm = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const registerForm = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            studentId: "",
            course: "",
            yearOfStudy: "",
            phone: "",
        },
    });

    const forgotPasswordForm = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const resetPasswordForm = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { token: "", password: "", confirmPassword: "" },
    });

    const onLogin = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login failed");
            }

            toast({
                title: "Success!",
                description: "You have been logged in successfully.",
            });

            navigate("/");
            window.location.reload();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "Please check your credentials and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onRegister = async (data: RegisterForm) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }

            toast({
                title: "Account Created!",
                description: "Your account has been created successfully. You can now log in.",
            });

            setActiveTab("login");
            loginForm.setValue("email", data.email);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onForgotPassword = async (data: ForgotPasswordForm) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Password reset request failed");
            }

            setResetSent(true);
            toast({
                title: "Email Sent!",
                description: "Check your email for password reset instructions.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: error.message || "Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onResetPassword = async (data: ResetPasswordForm) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Password reset failed");
            }

            toast({
                title: "Password Reset!",
                description: "Your password has been reset successfully. You can now log in.",
            });

            setActiveTab("login");
            resetPasswordForm.reset();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Reset Failed",
                description: error.message || "Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-background via-background to-muted/20">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary mb-4 shadow-lg">
                        <img src="/bitsa_logo.jpg" alt="BITSA Logo" className="h-full w-full object-cover rounded-xl" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to BITSA</h1>
                    <p className="text-muted-foreground mt-2">Bachelor of IT Students Association</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                        <TabsTrigger value="reset">Reset</TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>Enter your credentials to access your account</CardDescription>
                            </CardHeader>
                            <form onSubmit={loginForm.handleSubmit(onLogin)}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-10"
                                                {...loginForm.register("email")}
                                            />
                                        </div>
                                        {loginForm.formState.errors.email && (
                                            <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                {...loginForm.register("password")}
                                            />
                                        </div>
                                        {loginForm.formState.errors.password && (
                                            <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="px-0 text-sm hover:underline"
                                        onClick={() => setActiveTab("reset")}
                                    >
                                        Forgot your password?
                                    </Button>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Logging in..." : "Login"}
                                    </Button>

                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* Register Tab */}
                    <TabsContent value="register">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Account</CardTitle>
                                <CardDescription>Join the BITSA community today</CardDescription>
                            </CardHeader>
                            <form onSubmit={registerForm.handleSubmit(onRegister)}>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    className="pl-10"
                                                    {...registerForm.register("firstName")}
                                                />
                                            </div>
                                            {registerForm.formState.errors.firstName && (
                                                <p className="text-sm text-destructive">{registerForm.formState.errors.firstName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                {...registerForm.register("lastName")}
                                            />
                                            {registerForm.formState.errors.lastName && (
                                                <p className="text-sm text-destructive">{registerForm.formState.errors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="register-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-10"
                                                {...registerForm.register("email")}
                                            />
                                        </div>
                                        {registerForm.formState.errors.email && (
                                            <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="register-password">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="register-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    {...registerForm.register("password")}
                                                />
                                            </div>
                                            {registerForm.formState.errors.password && (
                                                <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                {...registerForm.register("confirmPassword")}
                                            />
                                            {registerForm.formState.errors.confirmPassword && (
                                                <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2 border-t">
                                        <p className="text-sm font-medium text-muted-foreground">Optional Information</p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="studentId">Student ID</Label>
                                                <Input
                                                    id="studentId"
                                                    placeholder="ST123456"
                                                    {...registerForm.register("studentId")}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="phone"
                                                        placeholder="+1234567890"
                                                        className="pl-10"
                                                        {...registerForm.register("phone")}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="course">Course</Label>
                                                <div className="relative">
                                                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="course"
                                                        placeholder="Computer Science"
                                                        className="pl-10"
                                                        {...registerForm.register("course")}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="yearOfStudy">Year of Study</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="yearOfStudy"
                                                        placeholder="2024"
                                                        className="pl-10"
                                                        {...registerForm.register("yearOfStudy")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Creating Account..." : "Create Account"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* Reset Password Tab */}
                    <TabsContent value="reset">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reset Password</CardTitle>
                                <CardDescription>
                                    {resetSent
                                        ? "Enter the token from your email and your new password"
                                        : "Enter your email to receive reset instructions"}
                                </CardDescription>
                            </CardHeader>

                            {!resetSent ? (
                                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="forgot-email">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="forgot-email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    className="pl-10"
                                                    {...forgotPasswordForm.register("email")}
                                                />
                                            </div>
                                            {forgotPasswordForm.formState.errors.email && (
                                                <p className="text-sm text-destructive">{forgotPasswordForm.formState.errors.email.message}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Sending..." : "Send Reset Link"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full"
                                            onClick={() => setActiveTab("login")}
                                        >
                                            Back to Login
                                        </Button>
                                    </CardFooter>
                                </form>
                            ) : (
                                <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)}>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10 text-primary">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <p className="text-sm">Check your email for the reset token</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reset-token">Reset Token</Label>
                                            <Input
                                                id="reset-token"
                                                placeholder="Enter token from email"
                                                {...resetPasswordForm.register("token")}
                                            />
                                            {resetPasswordForm.formState.errors.token && (
                                                <p className="text-sm text-destructive">{resetPasswordForm.formState.errors.token.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    {...resetPasswordForm.register("password")}
                                                />
                                            </div>
                                            {resetPasswordForm.formState.errors.password && (
                                                <p className="text-sm text-destructive">{resetPasswordForm.formState.errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                                            <Input
                                                id="confirm-new-password"
                                                type="password"
                                                placeholder="••••••••"
                                                {...resetPasswordForm.register("confirmPassword")}
                                            />
                                            {resetPasswordForm.formState.errors.confirmPassword && (
                                                <p className="text-sm text-destructive">{resetPasswordForm.formState.errors.confirmPassword.message}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Resetting..." : "Reset Password"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full"
                                            onClick={() => {
                                                setResetSent(false);
                                                setActiveTab("login");
                                            }}
                                        >
                                            Back to Login
                                        </Button>
                                    </CardFooter>
                                </form>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Reference: blueprint:javascript_log_in_with_replit for auth setup
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBlogPostSchema, insertEventSchema, insertGalleryImageSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  const userId = req.user?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUser(userId);
  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }

  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put('/api/auth/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, studentId, course, yearOfStudy, phone } = req.body;

      const updatedUser = await storage.updateUserProfile(userId, {
        firstName,
        lastName,
        studentId,
        course,
        yearOfStudy,
        phone,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: error.message || "Failed to update profile" });
    }
  });

  app.post('/api/auth/upload-avatar', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { imageData } = req.body;

      if (!imageData) {
        return res.status(400).json({ message: "No image data provided" });
      }

      // Validate that it's a valid base64 image
      if (!imageData.startsWith('data:image/')) {
        return res.status(400).json({ message: "Invalid image format" });
      }

      // Update user's profile image
      const updatedUser = await storage.updateUserProfile(userId, {
        profileImageUrl: imageData,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile picture updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ message: error.message || "Failed to upload profile picture" });
    }
  });

  // Email/Password Authentication Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, studentId, course, yearOfStudy, phone } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        studentId,
        course,
        yearOfStudy,
        phone,
      });

      res.status(201).json({
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: error.message || "Failed to create account" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      const sessionUser = {
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          profile_image_url: user.profileImageUrl,
          exp: Math.floor(Date.now() / 1000) + 3600 * 24, // 1 day
        },
        expires_at: Math.floor(Date.now() / 1000) + 3600 * 24,
        refresh_token: "email-password-session",
      };

      req.login(sessionUser, (err) => {
        if (err) {
          console.error("Error creating session:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }

        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
          },
        });
      });
    } catch (error: any) {
      console.error("Error during login:", error);
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return res.json({ message: "If an account exists with this email, you will receive a password reset link" });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save token to database
      await storage.setResetToken(email, resetToken, resetTokenExpiry);

      // In production, send email with reset token
      // For now, just log it (in development, this could be displayed to user)
      console.log(`Password reset token for ${email}: ${resetToken}`);
      console.log(`Token expires at: ${resetTokenExpiry}`);

      res.json({
        message: "If an account exists with this email, you will receive a password reset link",
        // In development, include the token in response (REMOVE IN PRODUCTION)
        ...(process.env.NODE_ENV === 'development' && { token: resetToken }),
      });
    } catch (error: any) {
      console.error("Error during password reset request:", error);
      res.status(500).json({ message: error.message || "Failed to process password reset" });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;

      // Verify token
      const user = await storage.verifyResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password and clear reset token
      await storage.updateUserPassword(user.id, hashedPassword);
      if (user.email) {
        await storage.setResetToken(user.email, "", new Date(0)); // Clear token
      }

      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error("Error during password reset:", error);
      res.status(500).json({ message: error.message || "Failed to reset password" });
    }
  });

  // Blog post routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertBlogPostSchema.parse({
        ...req.body,
        authorId: userId,
      });
      const post = await storage.createBlogPost(validated);
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: error.message || "Failed to create blog post" });
    }
  });

  app.put("/api/blog/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validated);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ message: error.message || "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const allEvents = await storage.getAllEvents();
      res.json(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validated);
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Error creating event:", error?.message || String(error));
      res.status(400).json({ message: error?.message || "Failed to create event" });
    }
  });

  app.put("/api/events/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validated);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      console.error("Error updating event:", error?.message || String(error));
      res.status(400).json({ message: error?.message || "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Event registration routes
  app.post("/api/events/:id/register", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventId = req.params.id;

      await storage.registerForEvent(eventId, userId);
      const count = await storage.getEventRegistrationCount(eventId);

      res.json({
        message: "Successfully registered for event",
        attendeeCount: count,
      });
    } catch (error: any) {
      console.error("Error registering for event:", error);
      res.status(400).json({ message: error.message || "Failed to register for event" });
    }
  });

  app.delete("/api/events/:id/register", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventId = req.params.id;

      await storage.unregisterFromEvent(eventId, userId);
      const count = await storage.getEventRegistrationCount(eventId);

      res.json({
        message: "Successfully unregistered from event",
        attendeeCount: count,
      });
    } catch (error: any) {
      console.error("Error unregistering from event:", error);
      res.status(500).json({ message: "Failed to unregister from event" });
    }
  });

  app.get("/api/events/:id/registration-status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventId = req.params.id;

      const isRegistered = await storage.isUserRegisteredForEvent(eventId, userId);
      const count = await storage.getEventRegistrationCount(eventId);

      res.json({
        isRegistered,
        attendeeCount: count,
      });
    } catch (error) {
      console.error("Error checking registration status:", error);
      res.status(500).json({ message: "Failed to check registration status" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const image = await storage.getGalleryImage(req.params.id);
      if (!image) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      res.json(image);
    } catch (error) {
      console.error("Error fetching gallery image:", error);
      res.status(500).json({ message: "Failed to fetch gallery image" });
    }
  });

  app.post("/api/gallery", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validated);
      res.status(201).json(image);
    } catch (error: any) {
      console.error("Error creating gallery image:", error);
      res.status(400).json({ message: error.message || "Failed to create gallery image" });
    }
  });

  app.put("/api/gallery/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(req.params.id, validated);
      if (!image) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      res.json(image);
    } catch (error: any) {
      console.error("Error updating gallery image:", error);
      res.status(400).json({ message: error.message || "Failed to update gallery image" });
    }
  });

  app.delete("/api/gallery/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteGalleryImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

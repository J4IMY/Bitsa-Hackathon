// Reference: blueprint:javascript_log_in_with_replit for auth-related storage methods
import {
  type User,
  type UpsertUser,
  type InsertBlogPost,
  type BlogPost,
  type InsertEvent,
  type Event,
  type InsertGalleryImage,
  type GalleryImage,
  users,
  blogPosts,
  events,
  galleryImages,
  eventRegistrations,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<void>;
  updateUserProfile(id: string, profileData: Partial<UpsertUser>): Promise<User | undefined>;
  setResetToken(email: string, token: string, expiry: Date): Promise<void>;
  verifyResetToken(token: string): Promise<User | undefined>;

  // Blog post operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;

  // Gallery operations
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: string): Promise<void>;

  // Event registration operations
  registerForEvent(eventId: string, userId: string): Promise<void>;
  unregisterFromEvent(eventId: string, userId: string): Promise<void>;
  isUserRegisteredForEvent(eventId: string, userId: string): Promise<boolean>;
  getEventRegistrationCount(eventId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    await db
      .update(users)
      .set({
        password,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateUserProfile(id: string, profileData: Partial<UpsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async setResetToken(email: string, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({
        resetToken: token,
        resetTokenExpiry: expiry,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));
  }

  async verifyResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, token));

    if (!user || !user.resetTokenExpiry) {
      return undefined;
    }

    // Check if token is expired
    if (new Date() > user.resetTokenExpiry) {
      return undefined;
    }

    return user;
  }

  // Blog post operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db
      .update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Gallery operations
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.uploadedAt));
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    const [image] = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    return image;
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [created] = await db.insert(galleryImages).values(image).returning();
    return created;
  }

  async updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const [updated] = await db
      .update(galleryImages)
      .set(image)
      .where(eq(galleryImages.id, id))
      .returning();
    return updated;
  }

  async deleteGalleryImage(id: string): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  // Event registration operations
  async registerForEvent(eventId: string, userId: string): Promise<void> {
    try {
      await db.insert(eventRegistrations).values({
        eventId,
        userId,
      });
    } catch (error: any) {
      // If unique constraint violation, user is already registered
      if (error.code === '23505') {
        throw new Error("You are already registered for this event");
      }
      throw error;
    }
  }

  async unregisterFromEvent(eventId: string, userId: string): Promise<void> {
    await db.delete(eventRegistrations).where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.userId, userId)
      )
    );
  }

  async isUserRegisteredForEvent(eventId: string, userId: string): Promise<boolean> {
    const [registration] = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.userId, userId)
        )
      )
      .limit(1);
    return !!registration;
  }

  async getEventRegistrationCount(eventId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId));
    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();

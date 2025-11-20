import { Request, Response, Router } from "express";
import { db } from "../db";
import { discussions, discussionReplies, users, insertDiscussionSchema, insertDiscussionReplySchema } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { storage } from "../storage";

export const discussionsRouter = Router();

// Helper to check if user is authenticated
function requireAuth(req: Request, res: Response, next: Function) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

// Helper to check if user is admin
async function requireAdmin(req: any, res: Response, next: Function) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);

    if (!user?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
}

// GET /api/discussions - List all discussions
discussionsRouter.get("/", async (req, res) => {
    try {
        const allDiscussions = await db
            .select({
                id: discussions.id,
                title: discussions.title,
                content: discussions.content,
                authorId: discussions.authorId,
                createdAt: discussions.createdAt,
                authorFirstName: users.firstName,
                authorLastName: users.lastName,
                authorEmail: users.email,
            })
            .from(discussions)
            .leftJoin(users, eq(discussions.authorId, users.id))
            .orderBy(desc(discussions.createdAt));

        // Count replies for each discussion
        const discussionsWithReplyCount = await Promise.all(
            allDiscussions.map(async (discussion) => {
                const replyCount = await db
                    .select({ count: discussions.id })
                    .from(discussionReplies)
                    .where(eq(discussionReplies.discussionId, discussion.id));

                return {
                    ...discussion,
                    replyCount: replyCount.length,
                };
            })
        );

        res.json(discussionsWithReplyCount);
    } catch (error: any) {
        console.error("Error fetching discussions:", error);
        res.status(500).json({ message: "Failed to fetch discussions" });
    }
});

// POST /api/discussions - Create a new discussion
discussionsRouter.post("/", requireAuth, async (req: any, res) => {
    try {
        const validatedData = insertDiscussionSchema.parse({
            ...req.body,
            authorId: req.user.claims.sub,
        });

        const [newDiscussion] = await db.insert(discussions).values(validatedData).returning();

        res.status(201).json(newDiscussion);
    } catch (error: any) {
        console.error("Error creating discussion:", error);
        res.status(400).json({ message: error.message || "Failed to create discussion" });
    }
});

// GET /api/discussions/:id - Get a specific discussion with replies
discussionsRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [discussion] = await db
            .select({
                id: discussions.id,
                title: discussions.title,
                content: discussions.content,
                authorId: discussions.authorId,
                createdAt: discussions.createdAt,
                authorFirstName: users.firstName,
                authorLastName: users.lastName,
                authorEmail: users.email,
            })
            .from(discussions)
            .leftJoin(users, eq(discussions.authorId, users.id))
            .where(eq(discussions.id, id));

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        const replies = await db
            .select({
                id: discussionReplies.id,
                content: discussionReplies.content,
                authorId: discussionReplies.authorId,
                createdAt: discussionReplies.createdAt,
                authorFirstName: users.firstName,
                authorLastName: users.lastName,
                authorEmail: users.email,
            })
            .from(discussionReplies)
            .leftJoin(users, eq(discussionReplies.authorId, users.id))
            .where(eq(discussionReplies.discussionId, id))
            .orderBy(discussionReplies.createdAt);

        res.json({
            ...discussion,
            replies,
        });
    } catch (error: any) {
        console.error("Error fetching discussion:", error);
        res.status(500).json({ message: "Failed to fetch discussion" });
    }
});

// POST /api/discussions/:id/replies - Add a reply to a discussion
discussionsRouter.post("/:id/replies", requireAuth, async (req: any, res) => {
    try {
        const { id } = req.params;

        // Check if discussion exists
        const [discussion] = await db
            .select()
            .from(discussions)
            .where(eq(discussions.id, id));

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        const validatedData = insertDiscussionReplySchema.parse({
            ...req.body,
            discussionId: id,
            authorId: req.user.claims.sub,
        });

        const [newReply] = await db.insert(discussionReplies).values(validatedData).returning();

        res.status(201).json(newReply);
    } catch (error: any) {
        console.error("Error creating reply:", error);
        res.status(400).json({ message: error.message || "Failed to create reply" });
    }
});

// DELETE /api/discussions/:id - Delete a discussion (Admin only)
discussionsRouter.delete("/:id", requireAdmin, async (req: any, res) => {
    try {
        const { id } = req.params;

        const [discussion] = await db
            .select()
            .from(discussions)
            .where(eq(discussions.id, id));

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        await db.delete(discussions).where(eq(discussions.id, id));

        res.status(204).send();
    } catch (error: any) {
        console.error("Error deleting discussion:", error);
        res.status(500).json({ message: "Failed to delete discussion" });
    }
});

// DELETE /api/discussions/:id/replies/:replyId - Delete a reply (Admin only)
discussionsRouter.delete("/:id/replies/:replyId", requireAdmin, async (req: any, res) => {
    try {
        const { id, replyId } = req.params;

        const [reply] = await db
            .select()
            .from(discussionReplies)
            .where(eq(discussionReplies.id, replyId));

        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }

        if (reply.discussionId !== id) {
            return res.status(400).json({ message: "Reply does not belong to this discussion" });
        }

        await db.delete(discussionReplies).where(eq(discussionReplies.id, replyId));

        res.status(204).send();
    } catch (error: any) {
        console.error("Error deleting reply:", error);
        res.status(500).json({ message: "Failed to delete reply" });
    }
});


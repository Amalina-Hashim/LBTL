import { Express, Request, Response } from "express";
import { createServer } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertPinSchema, insertUserSchema, insertPostSchema, insertRatingSchema, insertAnalyticsSchema } from "@shared/schema";

// Validation middleware
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(400).json({ error: "Invalid request body" });
    }
  };
};

export function registerRoutes(app: Express) {
  // Pin routes
  app.get("/api/pins", async (req: Request, res: Response) => {
    try {
      const pins = await storage.getAllPins();
      return res.json({ pins });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch pins" });
    }
  });

  app.post("/api/pins", validate(insertPinSchema), async (req: Request, res: Response) => {
    try {
      const pinData = req.body;
      const pin = await storage.createPin(pinData);
      return res.status(201).json({ pin });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create pin" });
    }
  });

  app.get("/api/pins/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const pin = await storage.getPin(id);
      if (!pin) {
        return res.status(404).json({ error: "Pin not found" });
      }
      return res.json({ pin });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch pin" });
    }
  });

  app.patch("/api/pins/:id", validate(insertPinSchema.partial()), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const pin = await storage.updatePin(id, updates);
      if (!pin) {
        return res.status(404).json({ error: "Pin not found" });
      }
      return res.json({ pin });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update pin" });
    }
  });

  app.delete("/api/pins/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const success = await storage.deletePin(id);
      if (!success) {
        return res.status(404).json({ error: "Pin not found" });
      }
      return res.json({ message: "Pin deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete pin" });
    }
  });

  // User routes
  app.post("/api/users", validate(insertUserSchema), async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      return res.status(201).json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/users/uid/:uid", async (req: Request, res: Response) => {
    try {
      const uid = req.params.uid;
      const user = await storage.getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", validate(insertUserSchema.partial()), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Post routes
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getAllPosts();
      return res.json({ posts });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req: Request, res: Response) => {
    console.log('POST /api/posts endpoint hit');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request content-type:', req.get('content-type'));
    
    try {
      const postData = req.body;
      console.log('Creating post with data:', postData);
      const post = await storage.createPost(postData);
      console.log('Post created successfully:', post);
      return res.status(201).json({ post });
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: "Failed to create post", details: errorMessage });
    }
  });

  app.get("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const post = await storage.getPost(id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json({ post });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/api/posts/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const posts = await storage.getPostsByUser(userId);
      return res.json({ posts });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user posts" });
    }
  });

  app.patch("/api/posts/:id", validate(insertPostSchema.partial()), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const post = await storage.updatePost(id, updates);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json({ post });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const success = await storage.deletePost(id);
      if (!success) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json({ message: "Post deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Rating routes
  app.get("/api/ratings", async (req: Request, res: Response) => {
    try {
      const ratings = await storage.getAllRatings();
      return res.json({ ratings });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  app.post("/api/ratings", validate(insertRatingSchema), async (req: Request, res: Response) => {
    try {
      const ratingData = req.body;
      const rating = await storage.createRating(ratingData);
      return res.status(201).json({ rating });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create rating" });
    }
  });

  app.get("/api/ratings/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const rating = await storage.getRating(id);
      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }
      return res.json({ rating });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch rating" });
    }
  });

  app.get("/api/ratings/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const ratings = await storage.getRatingsByUser(userId);
      return res.json({ ratings });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user ratings" });
    }
  });

  app.get("/api/ratings/pin/:pinId", async (req: Request, res: Response) => {
    try {
      const pinId = req.params.pinId;
      const ratings = await storage.getRatingsByPin(pinId);
      return res.json({ ratings });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch pin ratings" });
    }
  });

  app.patch("/api/ratings/:id", validate(insertRatingSchema.partial()), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const rating = await storage.updateRating(id, updates);
      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }
      return res.json({ rating });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update rating" });
    }
  });

  app.delete("/api/ratings/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteRating(id);
      if (!success) {
        return res.status(404).json({ error: "Rating not found" });
      }
      return res.json({ message: "Rating deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete rating" });
    }
  });

  // Analytics routes
  app.post("/api/analytics", validate(insertAnalyticsSchema), async (req: Request, res: Response) => {
    try {
      const analyticsData = req.body;
      const analytics = await storage.createAnalytics(analyticsData);
      return res.status(201).json({ analytics });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create analytics" });
    }
  });

  app.get("/api/analytics/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const analytics = await storage.getAnalytics(id);
      if (!analytics) {
        return res.status(404).json({ error: "Analytics not found" });
      }
      return res.json({ analytics });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.patch("/api/analytics/:id", validate(insertAnalyticsSchema.partial()), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const analytics = await storage.updateAnalytics(id, updates);
      if (!analytics) {
        return res.status(404).json({ error: "Analytics not found" });
      }
      return res.json({ analytics });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update analytics" });
    }
  });

  // Analytics tracking endpoint
  app.post("/api/track", validate(z.object({
    eventType: z.string(),
    data: z.any().optional(),
  })), async (req: Request, res: Response) => {
    try {
      const { eventType, data } = req.body;
      
      // Simple analytics tracking - in production, this would integrate with a proper analytics service
      console.log(`Analytics: ${eventType}`, data);
      
      return res.json({ message: "Event tracked successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to track event" });
    }
  });

  const server = createServer(app);
  return server;
}
import { z } from "zod";

// Pin/Location schemas
export const pinSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  lat: z.number(),
  lng: z.number(),
  type: z.enum(['trail', 'vendor', 'facility']),
  completed: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

export const insertPinSchema = pinSchema.omit({ id: true, createdAt: true });
export type InsertPin = z.infer<typeof insertPinSchema>;
export type Pin = z.infer<typeof pinSchema>;

// User schemas
export const userSchema = z.object({
  id: z.string(),
  uid: z.string(), // Firebase auth UID
  username: z.string().optional(),
  completedPins: z.array(z.string()).default([]),
  totalPhotos: z.number().default(0),
  totalRatings: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

// Post schemas
export const postSchema = z.object({
  id: z.string(),
  userId: z.string(),
  pinId: z.string(),
  username: z.string().default('Anonymous'),
  caption: z.string(),
  imageUrl: z.string(),
  location: z.string(),
  likes: z.number().default(0),
  comments: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
});

export const insertPostSchema = postSchema.omit({ id: true, createdAt: true });
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = z.infer<typeof postSchema>;

// Rating schemas
export const ratingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  pinId: z.string(),
  vendorName: z.string(),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export const insertRatingSchema = ratingSchema.omit({ id: true, createdAt: true });
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = z.infer<typeof ratingSchema>;

// Analytics schemas
export const analyticsSchema = z.object({
  id: z.string(),
  pageViews: z.number().default(0),
  activeUsers: z.number().default(0),
  qrScans: z.number().default(0),
  photoUploads: z.number().default(0),
  updatedAt: z.date().default(() => new Date()),
});

export const insertAnalyticsSchema = analyticsSchema.omit({ id: true, updatedAt: true });
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;

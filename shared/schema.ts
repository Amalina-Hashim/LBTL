import { z } from "zod";
import { pgTable, text, boolean, integer, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Database Tables
export const pins = pgTable("pins", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  type: text("type").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  username: text("username"),
  completedPins: text("completed_pins").array().default([]),
  totalPhotos: integer("total_photos").default(0),
  totalRatings: integer("total_ratings").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  location: text("location"),
  imageUrl: text("image_url"),
  pinId: text("pin_id"),
  rating: integer("rating"),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  pinId: text("pin_id").notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  data: text("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod Schemas
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
  type: z.string(),
  content: z.string(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  pinId: z.string().optional(),
  rating: z.number().optional(),
  likes: z.number().default(0),
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

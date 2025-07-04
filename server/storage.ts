import { Pin, User, Post, Rating, Analytics } from "@shared/schema";

interface IStorage {
  // Pin operations
  createPin(pin: Omit<Pin, 'id' | 'createdAt'>): Promise<Pin>;
  getPin(id: string): Promise<Pin | null>;
  getAllPins(): Promise<Pin[]>;
  updatePin(id: string, updates: Partial<Pin>): Promise<Pin | null>;
  deletePin(id: string): Promise<boolean>;

  // User operations
  createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  getUser(id: string): Promise<User | null>;
  getUserByUid(uid: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;

  // Post operations
  createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post>;
  getPost(id: string): Promise<Post | null>;
  getAllPosts(): Promise<Post[]>;
  getPostsByUser(userId: string): Promise<Post[]>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | null>;
  deletePost(id: string): Promise<boolean>;

  // Rating operations
  createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating>;
  getRating(id: string): Promise<Rating | null>;
  getAllRatings(): Promise<Rating[]>;
  getRatingsByUser(userId: string): Promise<Rating[]>;
  getRatingsByPin(pinId: string): Promise<Rating[]>;
  updateRating(id: string, updates: Partial<Rating>): Promise<Rating | null>;
  deleteRating(id: string): Promise<boolean>;

  // Analytics operations
  createAnalytics(analytics: Omit<Analytics, 'id' | 'updatedAt'>): Promise<Analytics>;
  getAnalytics(id: string): Promise<Analytics | null>;
  updateAnalytics(id: string, updates: Partial<Analytics>): Promise<Analytics | null>;
}

class MemStorage implements IStorage {
  private pins: Map<string, Pin> = new Map();
  private users: Map<string, User> = new Map();
  private posts: Map<string, Post> = new Map();
  private ratings: Map<string, Rating> = new Map();
  private analytics: Map<string, Analytics> = new Map();
  private nextId = 1;

  private generateId(): string {
    return (this.nextId++).toString();
  }

  // Pin operations
  async createPin(pin: Omit<Pin, 'id' | 'createdAt'>): Promise<Pin> {
    const id = this.generateId();
    const newPin: Pin = {
      ...pin,
      id,
      createdAt: new Date(),
    };
    this.pins.set(id, newPin);
    return newPin;
  }

  async getPin(id: string): Promise<Pin | null> {
    return this.pins.get(id) || null;
  }

  async getAllPins(): Promise<Pin[]> {
    return Array.from(this.pins.values());
  }

  async updatePin(id: string, updates: Partial<Pin>): Promise<Pin | null> {
    const pin = this.pins.get(id);
    if (!pin) return null;

    const updatedPin = { ...pin, ...updates };
    this.pins.set(id, updatedPin);
    return updatedPin;
  }

  async deletePin(id: string): Promise<boolean> {
    return this.pins.delete(id);
  }

  // User operations
  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const id = this.generateId();
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByUid(uid: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.uid === uid) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Post operations
  async createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    const id = this.generateId();
    const newPost: Post = {
      ...post,
      id,
      createdAt: new Date(),
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async getPost(id: string): Promise<Post | null> {
    return this.posts.get(id) || null;
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.userId === userId);
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const post = this.posts.get(id);
    if (!post) return null;

    const updatedPost = { ...post, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Rating operations
  async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
    const id = this.generateId();
    const newRating: Rating = {
      ...rating,
      id,
      createdAt: new Date(),
    };
    this.ratings.set(id, newRating);
    return newRating;
  }

  async getRating(id: string): Promise<Rating | null> {
    return this.ratings.get(id) || null;
  }

  async getAllRatings(): Promise<Rating[]> {
    return Array.from(this.ratings.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(rating => rating.userId === userId);
  }

  async getRatingsByPin(pinId: string): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(rating => rating.pinId === pinId);
  }

  async updateRating(id: string, updates: Partial<Rating>): Promise<Rating | null> {
    const rating = this.ratings.get(id);
    if (!rating) return null;

    const updatedRating = { ...rating, ...updates };
    this.ratings.set(id, updatedRating);
    return updatedRating;
  }

  async deleteRating(id: string): Promise<boolean> {
    return this.ratings.delete(id);
  }

  // Analytics operations
  async createAnalytics(analytics: Omit<Analytics, 'id' | 'updatedAt'>): Promise<Analytics> {
    const id = this.generateId();
    const newAnalytics: Analytics = {
      ...analytics,
      id,
      updatedAt: new Date(),
    };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }

  async getAnalytics(id: string): Promise<Analytics | null> {
    return this.analytics.get(id) || null;
  }

  async updateAnalytics(id: string, updates: Partial<Analytics>): Promise<Analytics | null> {
    const analytics = this.analytics.get(id);
    if (!analytics) return null;

    const updatedAnalytics = { ...analytics, ...updates, updatedAt: new Date() };
    this.analytics.set(id, updatedAnalytics);
    return updatedAnalytics;
  }
}

// Database Storage Implementation
import { db } from "./db";
import { posts, users, pins, ratings, analytics } from "@shared/schema";
import { eq } from "drizzle-orm";

class DatabaseStorage implements IStorage {
  // Post operations
  async createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    const id = this.generateId();
    const [newPost] = await db.insert(posts).values({
      id,
      ...post,
    }).returning();
    
    return {
      ...newPost,
      createdAt: newPost.createdAt.toISOString(),
    } as Post;
  }

  async getPost(id: string): Promise<Post | null> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) return null;
    
    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
    } as Post;
  }

  async getAllPosts(): Promise<Post[]> {
    const allPosts = await db.select().from(posts);
    return allPosts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    })) as Post[];
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    const userPosts = await db.select().from(posts).where(eq(posts.userId, userId));
    return userPosts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    })) as Post[];
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const [updatedPost] = await db.update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();
    
    if (!updatedPost) return null;
    
    return {
      ...updatedPost,
      createdAt: updatedPost.createdAt.toISOString(),
    } as Post;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  // Simplified implementations for other methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Keep existing MemStorage methods for other entities
  private pins: Map<string, Pin> = new Map();
  private users: Map<string, User> = new Map();
  private ratings: Map<string, Rating> = new Map();
  private analytics: Map<string, Analytics> = new Map();

  async createPin(pin: Omit<Pin, 'id' | 'createdAt'>): Promise<Pin> {
    const id = this.generateId();
    const newPin: Pin = {
      id,
      ...pin,
      createdAt: new Date(),
    };
    this.pins.set(id, newPin);
    return newPin;
  }

  async getPin(id: string): Promise<Pin | null> {
    return this.pins.get(id) || null;
  }

  async getAllPins(): Promise<Pin[]> {
    return Array.from(this.pins.values());
  }

  async updatePin(id: string, updates: Partial<Pin>): Promise<Pin | null> {
    const pin = this.pins.get(id);
    if (!pin) return null;
    
    const updatedPin = { ...pin, ...updates };
    this.pins.set(id, updatedPin);
    return updatedPin;
  }

  async deletePin(id: string): Promise<boolean> {
    return this.pins.delete(id);
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const id = this.generateId();
    const newUser: User = {
      id,
      ...user,
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByUid(uid: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.uid === uid) return user;
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
    const id = this.generateId();
    const newRating: Rating = {
      id,
      ...rating,
      createdAt: new Date(),
    };
    this.ratings.set(id, newRating);
    return newRating;
  }

  async getRating(id: string): Promise<Rating | null> {
    return this.ratings.get(id) || null;
  }

  async getAllRatings(): Promise<Rating[]> {
    return Array.from(this.ratings.values());
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(rating => rating.userId === userId);
  }

  async getRatingsByPin(pinId: string): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(rating => rating.pinId === pinId);
  }

  async updateRating(id: string, updates: Partial<Rating>): Promise<Rating | null> {
    const rating = this.ratings.get(id);
    if (!rating) return null;
    
    const updatedRating = { ...rating, ...updates };
    this.ratings.set(id, updatedRating);
    return updatedRating;
  }

  async deleteRating(id: string): Promise<boolean> {
    return this.ratings.delete(id);
  }

  async createAnalytics(analytics: Omit<Analytics, 'id' | 'updatedAt'>): Promise<Analytics> {
    const id = this.generateId();
    const newAnalytics: Analytics = {
      id,
      ...analytics,
      updatedAt: new Date(),
    };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }

  async getAnalytics(id: string): Promise<Analytics | null> {
    return this.analytics.get(id) || null;
  }

  async updateAnalytics(id: string, updates: Partial<Analytics>): Promise<Analytics | null> {
    const analytics = this.analytics.get(id);
    if (!analytics) return null;
    
    const updatedAnalytics = { ...analytics, ...updates, updatedAt: new Date() };
    this.analytics.set(id, updatedAnalytics);
    return updatedAnalytics;
  }
}

export const storage = new DatabaseStorage();
export type { IStorage };

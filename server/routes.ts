import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertCourseSchema,
  insertLessonSchema,
  insertEnrollmentSchema,
  insertLiveClassSchema,
  insertDiscussionSchema,
  insertReplySchema,
  insertNotificationSchema,
  insertReviewSchema,
} from "@shared/schema";

// Stripe configuration - will be enabled once API keys are provided
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
}

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

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch courses: " + error.message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const lessons = await storage.getLessonsByCourse(course.id);
      const reviews = await storage.getCourseReviews(course.id);
      
      res.json({ ...course, lessons, reviews });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch course: " + error.message });
    }
  });

  app.post("/api/courses", isAuthenticated, async (req: any, res) => {
    try {
      const courseData = insertCourseSchema.parse({
        ...req.body,
        instructorId: req.user.claims.sub,
      });
      
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course: " + error.message });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });
      
      const enrollment = await storage.enrollInCourse(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to enroll in course: " + error.message });
    }
  });

  app.get("/api/user/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const enrollments = await storage.getUserEnrollments(req.user.claims.sub);
      res.json(enrollments);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch enrollments: " + error.message });
    }
  });

  app.put("/api/enrollments/:courseId/progress", isAuthenticated, async (req: any, res) => {
    try {
      const { progress } = req.body;
      await storage.updateEnrollmentProgress(req.user.claims.sub, req.params.courseId, progress);
      res.json({ message: "Progress updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update progress: " + error.message });
    }
  });

  // Live class routes
  app.get("/api/live-classes", async (req, res) => {
    try {
      const liveClasses = await storage.getUpcomingLiveClasses();
      res.json(liveClasses);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch live classes: " + error.message });
    }
  });

  app.post("/api/live-classes", isAuthenticated, async (req: any, res) => {
    try {
      const liveClassData = insertLiveClassSchema.parse({
        ...req.body,
        instructorId: req.user.claims.sub,
      });
      
      const liveClass = await storage.createLiveClass(liveClassData);
      res.status(201).json(liveClass);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid live class data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create live class: " + error.message });
    }
  });

  app.post("/api/live-classes/:id/join", isAuthenticated, async (req: any, res) => {
    try {
      await storage.joinLiveClass(req.params.id, req.user.claims.sub);
      res.json({ message: "Joined live class successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to join live class: " + error.message });
    }
  });

  // Discussion routes
  app.get("/api/discussions", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const discussions = await storage.getDiscussions(categoryId as string);
      res.json(discussions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch discussions: " + error.message });
    }
  });

  app.get("/api/discussions/:id", async (req, res) => {
    try {
      const discussion = await storage.getDiscussion(req.params.id);
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }
      
      const replies = await storage.getReplies(discussion.id);
      res.json({ ...discussion, replies });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch discussion: " + error.message });
    }
  });

  app.post("/api/discussions", isAuthenticated, async (req: any, res) => {
    try {
      const discussionData = insertDiscussionSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub,
      });
      
      const discussion = await storage.createDiscussion(discussionData);
      res.status(201).json(discussion);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid discussion data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create discussion: " + error.message });
    }
  });

  app.post("/api/discussions/:id/replies", isAuthenticated, async (req: any, res) => {
    try {
      const replyData = insertReplySchema.parse({
        ...req.body,
        discussionId: req.params.id,
        authorId: req.user.claims.sub,
      });
      
      const reply = await storage.createReply(replyData);
      res.status(201).json(reply);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reply data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reply: " + error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user.claims.sub);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch notifications: " + error.message });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to mark notification as read: " + error.message });
    }
  });

  // Review routes
  app.post("/api/courses/:courseId/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        courseId: req.params.courseId,
        userId: req.user.claims.sub,
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review: " + error.message });
    }
  });

  // Analytics routes
  app.get("/api/user/progress", isAuthenticated, async (req: any, res) => {
    try {
      const progress = await storage.getUserProgress(req.user.claims.sub);
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch user progress: " + error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is not configured. Please contact support." });
      }
      
      const { amount, courseId } = req.body;
      
      // Convert INR to paise (smallest currency unit)
      const amountInPaise = Math.round(amount * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: "inr",
        metadata: {
          courseId,
          userId: (req as any).user.claims.sub,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Payment success webhook
  app.post("/api/payment/success", isAuthenticated, async (req: any, res) => {
    try {
      const { courseId } = req.body;
      
      // Enroll user in course after successful payment
      await storage.enrollInCourse({
        userId: req.user.claims.sub,
        courseId,
      });
      
      // Create notification
      await storage.createNotification({
        userId: req.user.claims.sub,
        title: "Course Enrollment Successful",
        message: "You have been successfully enrolled in the course!",
        type: "course_update",
      });
      
      res.json({ message: "Payment processed and course enrollment completed" });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing payment success: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import {
  users,
  courses,
  lessons,
  enrollments,
  lessonProgress,
  liveClasses,
  liveClassAttendees,
  discussions,
  discussionReplies,
  forumCategories,
  notifications,
  reviews,
  categories,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type LiveClass,
  type InsertLiveClass,
  type Discussion,
  type InsertDiscussion,
  type DiscussionReply,
  type InsertReply,
  type Notification,
  type InsertNotification,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, avg } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Course operations
  createCourse(course: InsertCourse): Promise<Course>;
  getCourse(id: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByInstructor(instructorId: string): Promise<Course[]>;
  updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  
  // Lesson operations
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessonsByCourse(courseId: string): Promise<Lesson[]>;
  updateLesson(id: string, updates: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: string): Promise<void>;
  
  // Enrollment operations
  enrollInCourse(enrollment: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]>;
  getCourseEnrollments(courseId: string): Promise<(Enrollment & { user: User })[]>;
  updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<void>;
  
  // Live class operations
  createLiveClass(liveClass: InsertLiveClass): Promise<LiveClass>;
  getLiveClasses(): Promise<LiveClass[]>;
  getUpcomingLiveClasses(): Promise<LiveClass[]>;
  joinLiveClass(liveClassId: string, userId: string): Promise<void>;
  leaveLiveClass(liveClassId: string, userId: string): Promise<void>;
  
  // Discussion operations
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  getDiscussions(categoryId?: string): Promise<Discussion[]>;
  getDiscussion(id: string): Promise<Discussion | undefined>;
  createReply(reply: InsertReply): Promise<DiscussionReply>;
  getReplies(discussionId: string): Promise<DiscussionReply[]>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getCourseReviews(courseId: string): Promise<(Review & { user: User })[]>;
  
  // Analytics
  getUserProgress(userId: string): Promise<{
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
    overallProgress: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
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

  // Course operations
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isPublished, true))
      .orderBy(desc(courses.createdAt));
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructorId))
      .orderBy(desc(courses.createdAt));
  }

  async updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Lesson operations
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.order);
  }

  async updateLesson(id: string, updates: Partial<InsertLesson>): Promise<Lesson> {
    const [updatedLesson] = await db
      .update(lessons)
      .set(updates)
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson;
  }

  async deleteLesson(id: string): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Enrollment operations
  async enrollInCourse(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    
    // Update course enrollment count
    await db
      .update(courses)
      .set({
        totalEnrollments: sql`${courses.totalEnrollments} + 1`,
      })
      .where(eq(courses.id, enrollment.courseId!));
    
    return newEnrollment;
  }

  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
    return await db
      .select()
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getCourseEnrollments(courseId: string): Promise<(Enrollment & { user: User })[]> {
    return await db
      .select()
      .from(enrollments)
      .innerJoin(users, eq(enrollments.userId, users.id))
      .where(eq(enrollments.courseId, courseId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<void> {
    await db
      .update(enrollments)
      .set({
        progress: progress.toString(),
        completedAt: progress >= 100 ? new Date() : null,
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }

  // Live class operations
  async createLiveClass(liveClass: InsertLiveClass): Promise<LiveClass> {
    const [newLiveClass] = await db.insert(liveClasses).values(liveClass).returning();
    return newLiveClass;
  }

  async getLiveClasses(): Promise<LiveClass[]> {
    return await db
      .select()
      .from(liveClasses)
      .orderBy(desc(liveClasses.scheduledAt));
  }

  async getUpcomingLiveClasses(): Promise<LiveClass[]> {
    return await db
      .select()
      .from(liveClasses)
      .where(sql`${liveClasses.scheduledAt} > NOW()`)
      .orderBy(liveClasses.scheduledAt);
  }

  async joinLiveClass(liveClassId: string, userId: string): Promise<void> {
    await db.insert(liveClassAttendees).values({
      liveClassId,
      userId,
    });
  }

  async leaveLiveClass(liveClassId: string, userId: string): Promise<void> {
    await db
      .update(liveClassAttendees)
      .set({ leftAt: new Date() })
      .where(
        and(
          eq(liveClassAttendees.liveClassId, liveClassId),
          eq(liveClassAttendees.userId, userId)
        )
      );
  }

  // Discussion operations
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const [newDiscussion] = await db.insert(discussions).values(discussion).returning();
    return newDiscussion;
  }

  async getDiscussions(categoryId?: string): Promise<Discussion[]> {
    const query = db.select().from(discussions);
    
    if (categoryId) {
      query.where(eq(discussions.categoryId, categoryId));
    }
    
    return await query.orderBy(desc(discussions.createdAt));
  }

  async getDiscussion(id: string): Promise<Discussion | undefined> {
    const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));
    
    if (discussion) {
      // Increment view count
      await db
        .update(discussions)
        .set({ viewCount: sql`${discussions.viewCount} + 1` })
        .where(eq(discussions.id, id));
    }
    
    return discussion;
  }

  async createReply(reply: InsertReply): Promise<DiscussionReply> {
    const [newReply] = await db.insert(discussionReplies).values(reply).returning();
    
    // Update reply count
    await db
      .update(discussions)
      .set({ replyCount: sql`${discussions.replyCount} + 1` })
      .where(eq(discussions.id, reply.discussionId!));
    
    return newReply;
  }

  async getReplies(discussionId: string): Promise<DiscussionReply[]> {
    return await db
      .select()
      .from(discussionReplies)
      .where(eq(discussionReplies.discussionId, discussionId))
      .orderBy(discussionReplies.createdAt);
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update course rating
    const [avgRating] = await db
      .select({ avg: avg(reviews.rating) })
      .from(reviews)
      .where(eq(reviews.courseId, review.courseId!));
    
    if (avgRating.avg) {
      await db
        .update(courses)
        .set({ rating: Number(avgRating.avg).toFixed(2) })
        .where(eq(courses.id, review.courseId!));
    }
    
    return newReview;
  }

  async getCourseReviews(courseId: string): Promise<(Review & { user: User })[]> {
    return await db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.courseId, courseId))
      .orderBy(desc(reviews.createdAt));
  }

  // Analytics
  async getUserProgress(userId: string): Promise<{
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
    overallProgress: number;
  }> {
    const userEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));

    const totalCourses = userEnrollments.length;
    const completedCourses = userEnrollments.filter(e => e.completedAt).length;
    
    // Calculate total hours and overall progress
    const coursesWithLessons = await Promise.all(
      userEnrollments.map(async (enrollment) => {
        const courseLessons = await this.getLessonsByCourse(enrollment.courseId!);
        const totalDuration = courseLessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
        return {
          progress: parseFloat(enrollment.progress || "0"),
          duration: totalDuration,
        };
      })
    );

    const totalHours = Math.round(
      coursesWithLessons.reduce((sum, course) => {
        return sum + (course.duration * course.progress / 100);
      }, 0) / 60
    );

    const overallProgress = totalCourses > 0
      ? coursesWithLessons.reduce((sum, course) => sum + course.progress, 0) / totalCourses
      : 0;

    return {
      totalCourses,
      completedCourses,
      totalHours,
      overallProgress: Math.round(overallProgress),
    };
  }
}

export const storage = new DatabaseStorage();

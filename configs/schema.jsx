import { pgTable, serial, json, varchar, boolean } from "drizzle-orm/pg-core";

export const CourseList = pgTable("courseList", {
  id: serial("ID").primaryKey(),
  courseId: varchar("Course ID").notNull(),
  name: varchar("Name").notNull(),
  category: varchar("Category").notNull(),
  level: varchar("Level").notNull(),
  includeVideo: varchar("Include Video").notNull().default("Yes"),
  courseOutput: json("Course Output").notNull(),
  createdBy: varchar("Created By").notNull(),
  userName: varchar("Username"),
  userProfileImage: varchar("User Profile Image"),
  courseBanner: varchar("Course Banner").default("/placeholder.png"),
  publish: boolean("Publish").default(false),
});

export const Chapters = pgTable("chapters", {
  id: serial("Id").primaryKey(),
  courseId: varchar("Course ID").notNull(),
  chapterId: varchar("Chapter ID").notNull(),
  content: json("Content").notNull(),
  videoId: json("Video ID").notNull().$default("[]"),
});

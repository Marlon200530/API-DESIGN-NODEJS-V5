import {
  integer,
  boolean,
  uuid,
  varchar,
  timestamp,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import {  createInsertSchema } from "drizzle-zod";
import { createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  frequency: varchar("frequency", { length: 20 }).notNull(),
  targetCount: integer("target_count").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  udatedAt: timestamp("updated_at").defaultNow(),
});

export const entries = pgTable("entries", {
  id: uuid("id").primaryKey(),
  habitId: uuid("habit_id").references(() => habits.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 50 }).unique(),
  color: varchar("color", { length: 7 }).default("#6b7288"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habitTags = pgTable("habitTags", {
  id: uuid("id").primaryKey(),
  habitId: uuid("habit_id").references(() => habits.id, {
    onDelete: "cascade",
  }),
  tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const habitsRelations = relations(habits, ({ many }) => ({
  habitTags: many(habitTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}));

export const habitTagsRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, {
    fields: [habitTags.habitId],
    references: [habits.id],
  }),

  tag: one(tags, {
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}));

export type User = typeof users.$inferInsert;
export type Entry = typeof entries.$inferInsert;
export type Tag = typeof tags.$inferInsert;
export type HabitTag = typeof habitTags.$inferInsert;

export type NewUser = Omit<User, "id">;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users)



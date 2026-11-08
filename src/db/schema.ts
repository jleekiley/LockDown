import { type AnySQLiteColumn, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const goals = sqliteTable("goals", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  complete: int({ mode: "boolean" }).notNull().default(false),
});

export const assignments = sqliteTable("assignments", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  dueDate: text(),
  parentTaskId: int().references((): AnySQLiteColumn => assignments.id, {
    onDelete: "set null",
  }),
});

export const reminders = sqliteTable("reminders", {
  //id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  month: int().notNull(),
  date: int().notNull(),
  weekday: int().notNull(),
  hour: int().notNull(),
  min: int().notNull(),
  repeating: int({ mode: "boolean" }).notNull().default(false),
  repeatList: text({ mode: "json" }).$type<boolean[]>().notNull().default([]),
});

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.
$inferInsert;
export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;

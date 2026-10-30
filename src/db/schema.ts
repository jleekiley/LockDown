import { AnySQLiteColumn, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
    onDelete: "set null"
  })
});

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.$inferInsert;

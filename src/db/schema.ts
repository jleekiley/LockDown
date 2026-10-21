import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const goals = sqliteTable("goals", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  complete: int({ mode: "boolean" }).notNull().default(false),
});

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;

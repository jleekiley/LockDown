import { drizzle } from "drizzle-orm/expo-sqlite";
import { deleteDatabaseSync, openDatabaseSync } from "expo-sqlite";

export const DB_NAME = "app.db";

export let expo = openDatabaseSync(DB_NAME, { enableChangeListener: true });
export let db = drizzle(expo);

export function resetDatabase() {
  try {
    expo.closeSync();
  } catch (e) {
    console.warn("Error closing database:", e);
  }
  deleteDatabaseSync(DB_NAME);
  expo = openDatabaseSync(DB_NAME, { enableChangeListener: true });
  db = drizzle(expo);
}


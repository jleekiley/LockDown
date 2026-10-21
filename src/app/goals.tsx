import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { db } from "@/db/client";
import { Goal, goals, NewGoal } from "@/db/schema";

export default function Index() {
  const { data: goalsList } = useLiveQuery(db.select().from(goals));
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Goals Page</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { asc, desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem } from "@/components/list-item";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";
import { db } from "@/db/client";
import type { Goal, NewGoal } from "@/db/schema";
import { goals } from "@/db/schema";

export default function Index() {
  const { data: goalsList } = useLiveQuery(
    db.select().from(goals).orderBy(asc(goals.complete), desc(goals.id)),
  );
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const toggleGoal = async (goal: Goal) => {
    try {
      await db
        .update(goals)
        .set({ complete: !goal.complete })
        .where(eq(goals.id, goal.id));
    } catch (err) {
      console.error("Failed to toggle goal:", err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.FlatList
        data={goalsList}
        keyExtractor={(item: Goal) => item.id.toString()}
        itemLayoutAnimation={LinearTransition.delay(50)}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
        ListEmptyComponent={<ThemedText>No goals found.</ThemedText>}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={item.description}
            strikethrough={item.complete}
            leading={
              <Checkbox
                value={item.complete}
                onValueChange={() => toggleGoal(item)}
                color={item.complete ? theme.primary : undefined}
              />
            }
            onPress={() => {}}
          ></ListItem>
        )}
      ></Animated.FlatList>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    opacity: 0.65,
    marginTop: 4,
    fontSize: 13,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 48,
  },
  emptyText: {
    opacity: 0.6,
  },
});

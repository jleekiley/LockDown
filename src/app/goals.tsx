import { asc, desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import Checkbox from "expo-checkbox";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem } from "@/components/list-item";
import ThemedModal from "@/components/modal";
import { ThemedTextInput } from "@/components/text-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";
import { db } from "@/db/client";
import type { Goal, NewGoal } from "@/db/schema";
import { goals } from "@/db/schema";

const INITIAL_GOAL: NewGoal = { title: "", description: "" };

export default function Index() {
  const { data: goalsList } = useLiveQuery(
    db.select().from(goals).orderBy(asc(goals.complete), desc(goals.id)),
  );
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoal>(INITIAL_GOAL);

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

  const addGoal = async (goal: NewGoal) => {
    try {
      await db.insert(goals).values(goal).onConflictDoNothing();
    } catch (error) {
      console.error("Failed to add goal:", error);
      throw error;
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewGoal(INITIAL_GOAL);
  };

  const handleSave = async () => {
    if (!newGoal.title.trim()) {
      return;
    }

    console.log("handling save of goal: ", newGoal);

    await addGoal({
      title: newGoal.title.trim(),
      description: newGoal.description?.trim() || null,
    });
    closeModal();
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.FlatList
        data={goalsList}
        keyExtractor={(item: Goal) => item.id.toString()}
        itemLayoutAnimation={LinearTransition.delay(50)}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
        ListEmptyComponent={<ThemedText style={{}}>No goals found.</ThemedText>}
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
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.newGoal, { backgroundColor: theme.primary }]}
      >
        <SymbolView
          name={{ ios: "plus", android: "add", web: "add" }}
          size={24}
          tintColor={theme.onPrimary}
        ></SymbolView>
        <ThemedText type={"smallBold"} style={{ color: theme.onPrimary }}>
          New Goal
        </ThemedText>
      </Pressable>
      <ThemedModal
        visible={modalVisible}
        title="Add a goal"
        onClose={() => setModalVisible(false)}
        onSave={() => {
          handleSave();
        }}
      >
        <ThemedTextInput
          placeholder="Goal Title"
          value={newGoal.title}
          onChangeText={(title) => {
            setNewGoal((prev) => ({ ...prev, title }));
          }}
        />
        <ThemedTextInput
          placeholder="Goal Description"
          value={newGoal.description || ""}
          onChangeText={(description) => {
            setNewGoal((prev) => ({ ...prev, description }));
          }}
        />
      </ThemedModal>
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
  newGoal: {
    position: "absolute",
    bottom: 16,
    right: 16,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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

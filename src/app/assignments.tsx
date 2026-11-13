/** biome-ignore-all lint/correctness/useParseIntRadix: error cannot occur given context */
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { asc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem } from "@/components/list-item";
import ThemedModal from "@/components/modal";
import { ThemedTextInput } from "@/components/text-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";
import { db } from "@/db/client";
import type { Assignment, NewAssignment } from "@/db/schema";
import { assignments } from "@/db/schema";

export default function Assignments() {
  const INITIAL_ASSIGNMENT: NewAssignment = {
    title: "",
    description: "",
    dueDate: new Date(),
    parentTaskId: null,
  };
  const INITIAL_DT: DT = {
    date: new Date(),
    time: new Date(),
  };

  const [newTask, setNewTask] = useState<NewAssignment>(INITIAL_ASSIGNMENT);
  const [newDT, setNewDT] = useState<DT>(INITIAL_DT);

  const [modalVisible, setModalVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  // Theming
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  // Retrieving assignments from db
  const { data: tasksList } = useLiveQuery(
    db
      .select()
      .from(assignments)
      .orderBy(asc(assignments.complete), asc(assignments.dueDate), asc(assignments.id)),
  );

  const toggleTask = async (task: Assignment) => {
    try {
      await db
        .update(assignments)
        .set({ complete: !task.complete })
        .where(eq(assignments.id, task.id));
    } catch (err) {
      console.error("Failed to toggle assignment:", err);
    }
  };

  const addTask = async (task: NewAssignment) => {
    try {
      await db
        .insert(assignments)
        .values({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          parentTaskId: task.parentTaskId,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error("Failed to add Assignment:", error);
      throw error;
    }
  };

  const parseTime = (time: string) => {
    let cleaned = time.replace(/[^0-9]/g, "");
    // Limit maximum length to 4 digits (HHMM)
    if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 4);
    }
    // Prevent invalid first digits for hour (max 2)
    if (cleaned.length >= 1 && parseInt(cleaned[0]) > 2) {
      return;
    }
    // Prevent invalid second digits if first digit is 2 (max 23 hours)
    if (cleaned.length >= 2 && cleaned[0] === "2" && parseInt(cleaned[1]) > 3) {
      return;
    }
    // Prevent invalid first digit for minutes (max 59 minutes)
    if (cleaned.length >= 3 && parseInt(cleaned[2]) > 5) {
      return;
    }
    // Auto-insert colon after the first two digits
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }
    return formatted;
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Modal for adding assignments */}
      <ThemedModal
        visible={modalVisible}
        title="test"
        onClose={() => setModalVisible(false)}
        onSave={() => {
          // Save the new assignment to the database
          const tempDate = newDT.date || new Date();
          tempDate.setHours(newDT.time.getHours());
          tempDate.setMinutes(newDT.time.getMinutes());
          addTask({ ...newTask, dueDate: tempDate });
          setModalVisible(false);
        }}
      >
        <ThemedText>Add Assignment</ThemedText>
        {/* Assignment Title Input */}
        <ThemedTextInput
          placeholder="Assignment Title"
          value={newTask.title || ""}
          onChangeText={(title) => {
            setNewTask((prev) => ({ ...prev, title }));
          }}
        />
        {/* Assignment Description Input */}
        <ThemedTextInput
          placeholder="Assignment Description"
          value={newTask.description || ""}
          onChangeText={(description) => {
            setNewTask((prev) => ({ ...prev, description }));
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Button to pull up Assignment Date Picker */}
          <Button
            title={newDT.date ? newDT.date.toDateString() : "Set Due Date"}
            onPress={() => setDateVisible(true)}
          />
          {/* Button to pull up Assignment Time Input */}
          <Button
            title={newDT.time.toTimeString().trim().split(" ")[0].slice(0,-3) || "Set Due Time"}
            onPress={() => setTimeVisible(true)}
          />
        </View>
        {dateVisible && (
          <DateTimePicker
            mode="date"
            value={newDT.date || new Date()}
            onValueChange={(event_, date) => {
              setNewDT((prev) => ({ ...prev, date }));
              setDateVisible(false);
            }}
            onDismiss={() => setDateVisible(false)}
            positiveButton={{ label: "Set" }}
          />
        )}
        {timeVisible && (
          <DateTimePicker
            mode="time"
            value={newDT.time || new Date()}
            is24Hour={false}
            presentation="dialog"
            onValueChange={(event_, time) => {
              setNewDT((prev) => ({ ...prev, time }));
              setTimeVisible(false);
            }}
            onDismiss={() => setTimeVisible(false)}
            positiveButton={{ label: "Set" }}
          />
        )}
        <SelectList
          setSelected={(key: string) => {
            setNewTask((prev) => ({
              ...prev,
              parentTaskId: key && key !== "none" ? Number.parseInt(key, 10) : null,
            }));
          }}
          data={[
            { key: "none", value: "-- none --" },
            ...(tasksList?.map((task) => ({ key: task.id.toString(), value: task.title })) ?? []),
          ]}
          save="key"
          onSelect={(key?: string) => {
            setNewTask((prev) => ({
              ...prev,
              parentTaskId: key && key !== "none" ? Number.parseInt(key, 10) : null,
            }));
          }}
        />
      </ThemedModal>
      <ThemedView style={styles.container2}>
        <ThemedText>Active Assignments</ThemedText>
        {/* Button for adding assignments (Triggers Modal Popup) */}
        <Button
          onPress={() => {
            setNewTask(INITIAL_ASSIGNMENT);
            setNewDT(INITIAL_DT);
            setModalVisible(true);
          }}
          title="add +"
          color={theme.primary}
          accessibilityLabel="add an assignment"
        />
      </ThemedView>
      {/* List of assignments (from db) */}
      <Animated.FlatList
        data={tasksList}
        keyExtractor={(item: Assignment) => item.id.toString()}
        itemLayoutAnimation={LinearTransition.delay(50)}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
        ListEmptyComponent={<ThemedText>No assignments found.</ThemedText>}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={`${item.description}\nDue: ${item.dueDate ? new Date(item.dueDate).toLocaleString() : "No due date"}`}
            strikethrough={item.complete}
            onPress={() => {}}
            leading={
              <Checkbox
                value={item.complete}
                onValueChange={() => toggleTask(item)}
                color={item.complete ? theme.primary : undefined}
              />
            }
          />
        )}
      />
    </ThemedView>
  );
}

export type DT = {
  date: Date;
  time: Date;
};

// Awesome Styles that are not evil
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    alignItems: "center",
    justifyContent: "center",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
});

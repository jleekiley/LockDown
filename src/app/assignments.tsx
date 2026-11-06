import DateTimePicker from "@expo/ui/community/datetime-picker";
import { asc, desc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
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
    time: "00:00",
  };

  const [newTask, setNewTask] = useState<NewAssignment>(INITIAL_ASSIGNMENT);
  const [newDT, setNewDT] = useState<DT>(INITIAL_DT);

  const [modalVisible, setModalVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  // Theming
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  // Retrieving assignments from db
  const { data: tasksList } = useLiveQuery(
    db.select().from(assignments).orderBy(asc(assignments.dueDate), desc(assignments.id)),
  );

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

  return (
    <ThemedView style={styles.container}>
      {/* Modal for adding assignments */}
      <ThemedModal
        visible={modalVisible}
        title="test"
        onClose={() => setModalVisible(false)}
        onSave={() => {
          // Save the new assignment to the database
          //
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
          {/* Assignment Time Input */}
          <ThemedTextInput
            placeholder="00:00"
            value={newDT.time}
            keyboardType="numeric"
            onChangeText={(time) => {
              setNewDT((prev) => ({ ...prev, time: time }));
            }}
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
      </ThemedModal>
      <ThemedText>Active Assignments</ThemedText>
      {/* Button for adding assignments (Triggers Modal Popup) */}
      <Button
        onPress={() => {
          setModalVisible(true);
        }}
        title="add +"
        color={theme.primary}
        accessibilityLabel="add an assignment"
      />
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
          <ListItem title={item.title} subtitle={item.description} onPress={() => {}}></ListItem>
        )}
      ></Animated.FlatList>
    </ThemedView>
  );
}

export type DT = {
  date: Date;
  time: string;
};

// Awesome Styles that are not evil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { asc, desc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, TextInput } from "react-native";
import ThemedModal from "@/components/modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";
import { db } from "@/db/client";
//import type { Assignment, NewAssignment } from "@/db/schema";
import { assignments } from "@/db/schema";

export default function Assignments() {
  const theme = useTheme();
  const { data: tasksList } = useLiveQuery(
    db.select().from(assignments).orderBy(asc(assignments.dueDate), desc(assignments.id)),
  );
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <ThemedView style={styles.container}>
      <ThemedModal visible={modalVisible} title="test" onClose={() => setModalVisible(false)}>
        <ThemedText>Add Assignment</ThemedText>
        <TextInput placeholder="Assignment Description" />
        <TextInput placeholder="Due Date" />
      </ThemedModal>
      <ThemedText>Active Assignments</ThemedText>
      <Button
        onPress={() => {
          setModalVisible(true);
        }}
        title="add +"
        color={theme.primary}
        accessibilityLabel="add an assignment"
      />
      <ScrollView>
        <ThemedText>Assignment 1</ThemedText>
      </ScrollView>
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

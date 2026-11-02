import { asc, desc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem } from "@/components/list-item";
import ThemedModal from "@/components/modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";
import { db } from "@/db/client";
import type { Assignment } from "@/db/schema";
import { assignments } from "@/db/schema";

export default function Assignments() {
  const [modalVisible, setModalVisible] = useState(false);
  // Theming
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  // Retrieving assignments from db
  const { data: tasksList } = useLiveQuery(
    db.select().from(assignments).orderBy(asc(assignments.dueDate), desc(assignments.id)),
  );
  return (
    <ThemedView style={styles.container}>
      {/* Modal for adding assignments */}
      <ThemedModal visible={modalVisible} title="test" onClose={() => setModalVisible(false)}>
        <ThemedText>Add Assignment</ThemedText>
        <TextInput placeholder="Assignment Description" />
        <TextInput placeholder="Due Date" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

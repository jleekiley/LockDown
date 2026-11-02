import { useState } from "react";
import { Button, Modal, ScrollView, StyleSheet, TextInput } from "react-native";
import ThemedModal from "@/components/modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";

export default function Assignments() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <ThemedView style={styles.container}>
      <ThemedModal
        visible={modalVisible}
        title="test"
        onClose={() => setModalVisible(false)}
      >
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

interface Assignment {
  description: string;
  dueDate: string;
  extraRequirements: Assignment[];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

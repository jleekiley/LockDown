import { Button, Modal, ScrollView, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";

export default function Assignments() {
  const theme = useTheme();
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Active Assignments</ThemedText>
      <Button
        onPress={() => {
          return (
            <Modal
              animationType="fade"
              transparent={false}
              visible={true}
              onRequestClose={() => {}}
            >
              <ThemedView style={styles.container}>
                <ThemedText>Add Assignment</ThemedText>
                <TextInput placeholder="Assignment Description" />
                <TextInput placeholder="Due Date" />
              </ThemedView>
            </Modal>
          );
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

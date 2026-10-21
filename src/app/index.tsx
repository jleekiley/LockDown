import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}> Welcome to LOCKDOWN </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    height: "80%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
});

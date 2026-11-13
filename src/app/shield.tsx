import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";

export default function ShieldScreen() {
  const theme = useTheme();
  const { appName } = useLocalSearchParams<{ appName: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.icon}>🛑</ThemedText>
      <ThemedText style={styles.title}>LockDown Active</ThemedText>
      <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
        You blocked{" "}
        <ThemedText style={{ color: theme.primary, fontWeight: "bold" }}>
          {appName || "this app"}
        </ThemedText>{" "}
        to stay focused.
      </ThemedText>

      <Pressable
        onPress={() => router.replace("/")}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <ThemedText style={styles.buttonText}>Return to Home</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

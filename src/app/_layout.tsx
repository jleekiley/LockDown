import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import {
  DarkTheme,
  DefaultTheme,
  SplashScreen,
  ThemeProvider,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  DevSettings,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import migrations from "@/../drizzle/migrations";
import AppTabs from "@/components/app-tabs";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { db, resetDatabase } from "@/db/client";

SplashScreen.preventAutoHideAsync();

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    let causeMessage: string | null = null;
    let current: unknown = err.cause;
    while (current) {
      if (current instanceof Error) {
        causeMessage = current.message;
        current = current.cause;
      } else if (
        typeof current === "object" &&
        current !== null &&
        "message" in current
      ) {
        causeMessage = String((current as { message: unknown }).message);
        break;
      } else {
        causeMessage = String(current);
        break;
      }
    }

    if (causeMessage) {
      return `${causeMessage}\n\n${err.message}`;
    }
    return err.message;
  }
  return String(err);
}

export default function RootLayout() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    migrate(db, migrations)
      .then(() => {
        setSuccess(true);
        SplashScreen.hideAsync();
      })
      .catch((err) => {
        console.error("Migration error:", err);
        if (err instanceof Error && err.cause) {
          console.error("Migration error cause:", err.cause);
        }
        setError(new Error(getErrorMessage(err)));
        SplashScreen.hideAsync();
      });
  }, []);

  const handleDeleteDatabase = () => {
    Alert.alert(
      "Delete Database",
      "Are you sure you want to delete the local database? All local data will be reset.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            try {
              resetDatabase();
              if (DevSettings.reload) {
                DevSettings.reload();
              } else {
                setError(null);
                setSuccess(false);
                migrate(db, migrations)
                  .then(() => {
                    setSuccess(true);
                  })
                  .catch((err) => {
                    console.error("Migration error:", err);
                    if (err instanceof Error && err.cause) {
                      console.error("Migration error cause:", err.cause);
                    }
                    setError(new Error(getErrorMessage(err)));
                  });
              }
            } catch (e) {
              console.error("Failed to delete database:", e);
              Alert.alert("Error", e instanceof Error ? e.message : String(e));
            }
          },
        },
      ],
    );
  };

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Migration error: {error.message}
        </ThemedText>
        <Pressable style={styles.deleteButton} onPress={handleDeleteDatabase}>
          <ThemedText style={styles.deleteButtonText}>
            Delete Database
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (!success) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppTabs />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#e53935",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

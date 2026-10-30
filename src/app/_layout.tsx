import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import {
  DarkTheme,
  DefaultTheme,
  SplashScreen,
  ThemeProvider,
} from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import migrations from "@/../drizzle/migrations";
import AppTabs from "@/components/app-tabs";
import { ThemedText } from "@/components/themed-text";
import { db } from "@/db/client";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [success, setSucess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    migrate(db, migrations)
      .then(() => {
        setSucess(true);
        SplashScreen.hideAsync();
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        SplashScreen.hideAsync();
      });
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText>Migration error: {error.message}</ThemedText>
      </View>
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

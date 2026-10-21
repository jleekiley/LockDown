import { useColorScheme } from "react-native";

export const Colors = {
  light: {
    background: "#F7F8FA",
    backgroundElement: "#ECEEF2",
    backgroundSelected: "#DCE0E7",
    text: "#11181C",
    textSecondary: "#687076",
    primary: "#a21191",
    tap: "#D0D4DC",
  },
  dark: {
    background: "#0F1115",
    backgroundElement: "#181B20",
    backgroundSelected: "#2A2F38",
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    primary: "#a21191",
    tap: "#252A34",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useTheme() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === "dark" ? "dark" : "light"];
}

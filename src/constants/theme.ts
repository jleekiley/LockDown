import { useColorScheme } from "react-native";

export const Colors = {
  light: {
    background: "#F7F8FA",
    backgroundElement: "#ECEEF2",
    backgroundSelected: "#FFFFFF",
    text: "#11181C",
    textSecondary: "#687076",
    primary: "#a21191",
  },
  dark: {
    background: "#0F1115",
    backgroundElement: "#181B20",
    backgroundSelected: "#262A32",
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    primary: "#a21191",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useTheme() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === "dark" ? "dark" : "light"];
}

import { useColorScheme } from "react-native";

export const Colors = {
  light: {
    background: "#ffffff",
    background2: "#F0F0F3",
    text: "#000000",
  },
  dark: {
    background: "#000000",
    background2: "#212225",
    text: "#ffffff",
  },
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useTheme() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === "dark" ? "dark" : "light"];
}

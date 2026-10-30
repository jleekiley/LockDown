import { memo, ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export interface ListItemProps {
  title: string;
  subtitle?: string | null;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  strikethrough?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ListItem = memo(function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  strikethrough,
  style,
}: ListItemProps) {
  const theme = useTheme();

  return (
    <ThemedView
      style={[styles.card, { backgroundColor: theme.backgroundElement }, style]}
    >
      {leading ? <View style={styles.leadingContainer}>{leading}</View> : null}
      <Pressable
        style={[styles.contentContainer, strikethrough && { opacity: 0.5 }]}
        onPress={onPress}
      >
        <ThemedText style={strikethrough ? styles.strikethrough : undefined}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        ) : null}
      </Pressable>
      {trailing ? (
        <View style={styles.trailingContainer}>{trailing}</View>
      ) : null}
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  leadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  trailingContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  subtitle: {
    opacity: 0.65,
    marginTop: 4,
    fontSize: 13,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
});

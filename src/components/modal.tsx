import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/constants/theme";

interface ThemedModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  children: ReactNode;
}

export default function ThemedModal({
  visible,
  onClose,
  onSave,
  title,
  children,
}: ThemedModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      navigationBarTranslucent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}
      >
        <ThemedView style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12}>
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              size={24}
              tintColor={theme.text}
            ></SymbolView>
          </Pressable>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {onSave && (
            <Pressable onPress={onSave} hitSlop={12}>
              <ThemedText type="smallBold" themeColor="primary">
                Save
              </ThemedText>
            </Pressable>
          )}
        </ThemedView>
        {children}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
  },
});

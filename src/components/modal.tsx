import type { ReactNode } from "react";
import { KeyboardAvoidingView, Modal, StyleSheet } from "react-native";
import { useTheme } from "@/constants/theme";

interface ThemedModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function ThemedModal({
  visible,
  onClose,
  title,
  children,
}: ThemedModalProps) {
  const theme = useTheme();
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        {children}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

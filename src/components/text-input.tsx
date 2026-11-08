import { useState } from "react";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { useTheme } from "@/constants/theme";

export type ThemedTextInputProps = TextInputProps;

export function ThemedTextInput({
  style,
  onFocus,
  onBlur,
  ...props
}: ThemedTextInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      cursorColor={theme.primary}
      selectionColor={theme.primary}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[
        styles.input,
        {
          color: theme.text,
          borderColor: focused ? theme.primary : theme.textSecondary,
          borderWidth: 1,
          outlineColor: theme.primary,
          outlineWidth: focused ? 2 : 0,
          outlineOffset: -2,
        },
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 56,
    paddingHorizontal: 16,
  },
});

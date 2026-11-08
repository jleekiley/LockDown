import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTheme } from "@/constants/theme";

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs
      labelVisibilityMode="labeled"
      backgroundColor={theme.backgroundElement}
      indicatorColor={theme.backgroundSelected}
      rippleColor={theme.tap}
      labelStyle={{
        default: { color: theme.textSecondary },
        selected: { color: theme.text },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="home"
          renderingMode="template"
          selectedColor={theme.primary}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="goals">
        <NativeTabs.Trigger.Label>Goals</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="target"
          renderingMode="template"
          selectedColor={theme.primary}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="assignments">
        <NativeTabs.Trigger.Label>Assignments</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="assignment"
          renderingMode="template"
          selectedColor={theme.primary}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="reminders">
        <NativeTabs.Trigger.Label>Reminders</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md={"notifications"}
          renderingMode="template"
          selectedColor={theme.primary}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

import { Text, View, StyleSheet } from "react-native";

export default function Assignments() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/assignments.tsx to edit this screen.</Text>
    </View>
  );
}

interface Assignment {
  description: string;
  dueDate: string;
  extraRequriements: Assignment[];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Text, View, StyleSheet, Button, ScrollView, Modal, TextInput } from "react-native";

export default function Assignments() {
  return (
    <View style={styles.container}>
      <Text>
        Active Assignments
      </Text>
      <Button
        onPress={() => {
          return(
            <Modal
              animationType="fade"
              transparent={false}
              visible={true}
              onRequestClose={() => {}}
            >
              <View style={styles.container}>
                <Text>
                  Add Assignment
                </Text>
                <TextInput
                  placeholder="Assignment Description"
                />
                <TextInput
                  placeholder="Due Date"
                />
              </View>
            </Modal>
          );
        }}
        title="add +"
        color="#841584"
        accessibilityLabel="add an assignment"
      />
      <ScrollView>
        <Text> 
          Assignment 1
        </Text>
      </ScrollView>
    </View>
  );
}

interface Assignment {
  description: string;
  dueDate: string;
  extraRequirements: Assignment[];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

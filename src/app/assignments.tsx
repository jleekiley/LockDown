import { useState } from "react";
import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Assignments() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.container}>
          <Text>Add Assignment</Text>
          <TextInput placeholder="Assignment Description" />
          <TextInput placeholder="Due Date" />
        </View>
      </Modal>
      <Text>Active Assignments</Text>
      <Button
        onPress={() => {
          setModalVisible(true);
        }}
        title="add +"
        color="#841584"
        accessibilityLabel="add an assignment"
      />
      <ScrollView>
        <Text>Assignment 1</Text>
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

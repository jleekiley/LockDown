import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

function CreateReminder() {
  return (
    <ThemedView style={styles.container}>
      {/* I want this to be a box that shows up in the middle of the screen over top the current
      reminders tab and I will be working on creating that next */}
      <Pressable
        //what happens when the button is pressed
        onPress={() => {
          //show a textbox for name, a button for if it repeats, which shows a new line of buttons for the week days
        }}
      >
        <ThemedView type="primary" style={styles.button}>
          <ThemedText style={styles.buttonText}>Create Reminder</ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

class Reminder {
  name: string;
  repeats: boolean;
  rep_list: boolean[];
  curr_day: number = 3; //testing value, should be set for days of the week

  /*for starting purposes kept as 3 seperate values,
   *could be set as one fixed length string of numbers in the
   *format of:
   *{1-digit: day}{2-digit: hour}{2-digit: minute}
   */
  time_day: number;
  time_hour: number;
  time_minute: number;
  constructor(
    name: string,
    day: number,
    hour: number,
    min: number,
    rep: boolean,
    rep_list: boolean[],
  ) {
    this.name = name;
    this.time_day = day;
    this.time_hour = hour;
    this.time_minute = min;

    this.repeats = rep;
    this.rep_list = rep_list;
  }
}

export default function Index() {
  //main function
  const [repeats, enableRepeat] = useState(false);
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.heading}>This is the reminders tab</ThemedText>

      <Pressable
        //what happens when the button is pressed
        onPress={() => {
          CreateReminder();
        }}
      >
        <ThemedView type="primary" style={styles.button}>
          <ThemedText style={styles.buttonText}>Create Reminder</ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

//layouts and styling
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fills the entire screen
    alignItems: "center", // Centers items horizontally
    justifyContent: "center", // Centers items vertically
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

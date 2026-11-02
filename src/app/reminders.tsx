import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../constants/theme";

//Key Variables
const { width, height } = Dimensions.get("window");
/**
function getCurrDate() {
  //create a new date object to store the current time
  //these will be used to set the saved reminders time value
  const curr = new Date();
  curr_month: curr.getMonth();
  //getting the date (1-31) allows a reminder to be set on a specific day when not repeating and is easier i think
  curr_date: curr.getDate();
  //these 3 will be needed for determining when reminders are shown and reset.
  curr_day: curr.getDay();
  curr_hour: curr.getHours();
  curr_min: curr.getMinutes();
} */

//current time values should be moved to a different function
function CreateReminder(
  name: string,
  month: number,
  date: number,
  weekday: number,
  hour: number,
  dayHalf: boolean,
  min: number,
  repeating: boolean,
  repeatList: boolean[],
) {
  //this function should control the popup view for entering info
  //main page or app should wait for
  if (!dayHalf) {
    hour += 12;
  }
  console.log(
    "Added reminder with:\n" +
      "name: " +
      name +
      " month: " +
      month +
      " date: " +
      date +
      " weekday: " +
      weekday +
      " hour: " +
      hour +
      " min: " +
      min +
      " repeating: " +
      repeating,
  );
  new Reminder(name, month, date, weekday, hour, min, false, []);
}
/**
function testing() {
  const [popup, setPopup] = useState(false);
  return (
    <View style={styles.container}>
      <Pressable onPress={() => setPopup(true)}>
        <Text>ya boy is testing</Text>
      </Pressable>

      {popup && (
        <View style={styles.button}>
          <Text>will this show up</Text>
          <Pressable onPress={() => setPopup(false)}>
            <Text style={styles.button}>close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}*/

class Reminder {
  name: string;
  repeats: boolean;
  rep_list: boolean[];
  curr_day: number = 3; //testing value, should be set for days of the week
  name: string;
  repeats: boolean;
  rep_list: boolean[];
  curr_day: number = 3; //testing value, should be set for days of the week

  /*for starting purposes kept as 3 seperate values,
   *could be set as one fixed length string of numbers in the
   *format of:
   *{1-digit: day}{2-digit: hour}{2-digit: minute}
   */
  time_month: number;
  time_date: number;
  time_weekday: number;
  time_hour: number;
  time_minute: number;

  constructor(
    name: string,
    month: number,
    date: number,
    weekday: number,
    hour: number,
    min: number,
    repeating: boolean,
    repeatList: boolean[],
  ) {
    this.name = name;
    this.time_month = month;
    this.time_date = date;
    this.time_weekday = weekday;
    this.time_hour = hour;
    this.time_minute = min;

    this.repeats = repeating;
    this.rep_list = repeatList;
  }
}

/*
const createRemWindow = () => {
  return (

  );
};
*/

function checkNum(text: string, min: number, max: number) {
  text = text.replace(/[^0-9]/g, "");
  let val = Number(text);
  val = val > max ? max : val;
  val = val < min ? min : val;
  return String(val);
}

export default function NotificationsTab() {
  //main function output to the screen
  const curr = new Date();
  const theme = useTheme();
  const reminders = [];
  const [repeats, setRepeat] = useState(false);
  const repeatList = Array(7).fill(false);
  const [name, setName] = useState("");
  const [hour, setHour] = useState(12);
  const [min, setMin] = useState(0);
  const [half, setHalf] = useState(false);
  const [course, setCourse] = useState("");
  const [popup, setPopup] = useState(false);
  const [remindMonth, selectMonth] = useState(curr.getMonth() + 1);
  const [remindStart, setStartDate] = useState(curr.getDate());

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={styles.heading}>This is the reminders tab</Text>

      {/**dissapear when adding */}
      {!popup && (
        <Pressable
          //what happens when the button is pressed
          onPress={() => {
            setPopup(true);
          }}
          //determines look of the button
          style={({ pressed }) => [styles.button, { backgroundColor: "#4f6eb7" }]}
        >
          {({ pressed }) => (
            <Text style={styles.buttonText}>
              {reminders.length == 0 ? "Add Reminder" : "Num reminders: " + reminders.length}
            </Text>
          )}
        </Pressable>
      )}

      {popup && (
        //popup box and general styling
        <KeyboardAvoidingView style={[styles.popup, { backgroundColor: theme.background2 }]}>
          {/*popup line specific styling*/}
          <View style={[styles.closeButton, { backgroundColor: theme.background2 }]}>
            <Pressable onPress={() => setPopup(false)}>
              <Text style={[styles.roundButton, { color: theme.text, backgroundColor: "red" }]}>
                X
              </Text>
            </Pressable>
          </View>
          {/**first line of popup*/}
          <View
            style={[
              styles.rowPop,
              { backgroundColor: theme.background2, flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Reminder name:</Text>
            <TextInput
              placeholder="Enter reminder name"
              placeholderTextColor={theme.text}
              onChangeText={(newText) => setName(newText)}
              defaultValue={name}
              style={[styles.defaultText, { borderColor: theme.text, color: theme.text }]}
            />
          </View>
          {/*second line of popup, may remove*/}
          <View
            style={[
              styles.rowPop,
              { backgroundColor: theme.background2, flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Course Name:</Text>
            <TextInput
              placeholder="Enter course name"
              placeholderTextColor={theme.text}
              onChangeText={(newText) => setCourse(newText)}
              defaultValue={course}
              style={[styles.defaultText, { borderColor: theme.text, color: theme.text }]}
            />
          </View>
          {/*third line of popup, time*/}
          <View
            style={[
              styles.rowPop,
              { backgroundColor: theme.background2, flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Enter time:</Text>
            <TextInput
              placeholder="Hour"
              placeholderTextColor={theme.text}
              onChangeText={(newText) => setHour(Number(checkNum(newText, 1, 12)))}
              defaultValue={"12"}
              keyboardType="number-pad"
              style={[styles.defaultText, { borderColor: theme.text, color: theme.text }]}
            />
            <Text style={[styles.buttonText, { color: theme.text }]}>:</Text>
            <TextInput
              placeholder="Minute"
              placeholderTextColor={theme.text}
              onChangeText={(newText) => setMin(Number(checkNum(newText, 0, 60)))}
              defaultValue={"00"}
              keyboardType="number-pad"
              style={[styles.defaultText, { borderColor: theme.text, color: theme.text }]}
            />
            <Pressable onPress={() => setHalf(!half)}>
              <Text style={[styles.roundButton, { color: theme.text, backgroundColor: "grey" }]}>
                {half ? "AM" : "PM"}
              </Text>
            </Pressable>
          </View>
          {/*fourth line of popup, date*/}
          <View
            style={[
              styles.rowPop,
              { backgroundColor: theme.background2, flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Start date(M/D): </Text>
            <TextInput
              placeholder="Month"
              placeholderTextColor={theme.text}
              onChangeText={(newText) => selectMonth(Number(checkNum(newText, 1, 12)))}
              defaultValue={String(remindMonth)}
              keyboardType="number-pad"
              style={[styles.defaultText, { borderColor: theme.text, color: theme.text }]}
            />
            <Text style={[styles.buttonText, { color: theme.text }]}>/</Text>
            <TextInput
              placeholder="Day"
              placeholderTextColor={theme.text}
              //edit parameter 31 to adjust to the month selected later
              onChangeText={(newText) => setStartDate(Number(checkNum(newText, 1, 31)))}
              defaultValue={String(remindStart)}
              keyboardType="number-pad"
              style={[styles.defaultText, { borderColor: theme.text, color: theme.text }]}
            />
          </View>
          {/*fifth line of popup*/}
          <View
            style={[
              styles.rowPop,
              { backgroundColor: theme.background2, flexDirection: "column", alignItems: "center" },
            ]}
          >
            {/**this one should add another row of 7 buttons representing days
             *so we know what days of the week it repeats on
             */}
            <Pressable onPress={() => setRepeat(!repeats)}>
              <Text
                style={[
                  styles.roundButton,
                  { color: theme.text, backgroundColor: !repeats ? "red" : "blue" },
                ]}
              >
                {!repeats ? "Does not repeat" : "Repeats on:"}
              </Text>
            </Pressable>
            {repeats && (
              <View
                style={[
                  styles.rowPop,
                  {
                    backgroundColor: theme.background2,
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <Pressable onPress={() => (repeatList[0] = !repeatList[0])}>
                  <Text
                    style={[
                      styles.roundButton,
                      { color: theme.text, backgroundColor: repeatList[0] ? "green" : "grey" },
                    ]}
                  >
                    Sun
                  </Text>
                </Pressable>
                <Pressable onPress={() => (repeatList[1] = !repeatList[1])}>
                  <Text
                    style={[
                      styles.roundButton,
                      { color: theme.text, backgroundColor: repeatList[1] ? "green" : "grey" },
                    ]}
                  >
                    Mon
                  </Text>
                </Pressable>
                <Pressable onPress={() => (repeatList[2] = !repeatList[2])}>
                  <Text
                    style={[
                      styles.roundButton,
                      { color: theme.text, backgroundColor: repeatList[2] ? "green" : "grey" },
                    ]}
                  >
                    Tue
                  </Text>
                </Pressable>
                <Pressable onPress={() => (repeatList[3] = !repeatList[3])}>
                  <Text
                    style={[
                      styles.roundButton,
                      { color: theme.text, backgroundColor: repeatList[3] ? "green" : "grey" },
                    ]}
                  >
                    Wed
                  </Text>
                </Pressable>
                <Pressable onPress={() => (repeatList[4] = !repeatList[4])}>
                  <Text
                    style={[
                      styles.roundButton,
                      { color: theme.text, backgroundColor: repeatList[4] ? "green" : "grey" },
                    ]}
                  >
                    Thu
                  </Text>
                </Pressable>
                <Pressable onPress={() => (repeatList[5] = !repeatList[5])}>
                  <Text
                    style={[
                      styles.roundButton,
                      { color: theme.text, backgroundColor: repeatList[5] ? "green" : "grey" },
                    ]}
                  >
                    Fri
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    repeatList[6] = !repeatList[6];
                  }}
                >
                  <Text
                    style={[
                      styles.roundButton,
                      { color: theme.text, backgroundColor: repeatList[6] ? "green" : "grey" },
                    ]}
                  >
                    Sat
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
          {/**should be bottom of box to finally add the reminder using user info */}
          <View>
            {/*button to actually use input*/}
            <Pressable
              //what happens when the button is pressed
              onPress={() => {
                const month = curr.getMonth();
                const date = curr.getDate();
                //new Reminder(name, month, date, weekday, hour, dayHalf, min, false, []);
                reminders.push(
                  CreateReminder(
                    name,
                    remindMonth,
                    remindStart,
                    0 /**this is day of week */,
                    hour,
                    half,
                    min,
                    false,
                    [],
                  ),
                );
              }} //determines look of the button
              style={({ pressed }) => [styles.button, { backgroundColor: "#4f6eb7" }]}
            >
              {({ pressed }) => (
                <Text style={styles.buttonText}>
                  {reminders.length == 0 ? "Create Reminder" : "Num reminders: " + reminders.length}
                </Text>
              )}
            </Pressable>
          </View>

          {/**closes popup view bracket*/}
        </KeyboardAvoidingView>
      )}
      {/**
      *<ScrollView>
        <Text style={[styles.buttonText, {color: theme.text}]}>
          hi
        </Text>
      </ScrollView>
      */}
    </View>
  );
}

//layouts and styling
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fills the entire screen
    alignItems: "center", // Centers items horizontally
    justifyContent: "center", // Centers items vertically
  },
  popup: {
    width: width * 0.95,
    position: "relative",
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 4 / 3,
    fontSize: 16,
    borderWidth: 3,
    borderColor: "green",
    borderRadius: 10,
  },
  rowPop: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 4 / 3,
    fontSize: 16,
    minWidth: "100%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  button: {
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
  roundButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  buttonText: {
    color: "#fff",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  defaultText: {
    height: 40,
    padding: 10,
    marginHorizontal: 8,
    marginVertical: 10,
    borderWidth: 1,
  },
});

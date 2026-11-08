import DateTimePicker from "@expo/ui/community/datetime-picker";
import { asc, desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Checkbox } from "expo-checkbox";
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
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem } from "@/components/list-item";
import ThemedModal from "@/components/modal";
import { ThemedTextInput } from "@/components/text-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { db } from "@/db/client";
import type { NewReminder, Reminder } from "@/db/schema";
import { reminders } from "@/db/schema";
import { useTheme } from "../constants/theme";

//Key Variables
const { width, height } = Dimensions.get("window");
const DEFAULT_REMINDER: NewReminder = {
  name: "TEST1",
  month: 6,
  date: 1,
  weekday: 0,
  hour: 12,
  min: 0,
  repeating: false,
  repeatList: [],
};

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

/*function checkRepetition() {}*/

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
  new Reminder_class(name, month, date, weekday, hour, min, repeating, repeatList);

  const added_reminder: NewReminder = {
    name: name,
    month: month,
    date: date,
    weekday: weekday,
    hour: hour,
    min: min,
    repeating: repeating,
    repeatList: repeatList,
  };

  storeRem(added_reminder);
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

class Reminder_class {
  name: string;
  repeats: boolean;
  rep_list: boolean[];
  curr_day: number = 3; //testing value, should be set for days of the week

  /*for starting purposes kept as seperate values,
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

async function storeRem(reminder: NewReminder) {
  try {
    await db.insert(reminders).values(reminder);
  } catch (error) {
    console.error(error);
  }
}

function checkNum(text: string, min: number, max: number) {
  text = text.replace(/[^0-9]/g, "");
  let val = Number(text);
  val = val > max ? max : val;
  val = val < min ? min : val;
  return String(val);
}

export default function NotificationsTab() {
  //main function output to the screen
  const [newRem, setNewRem] = useState<NewReminder>(DEFAULT_REMINDER);
  const { data: notifList } = useLiveQuery(
    db.select().from(reminders).orderBy(asc(reminders.month), asc(reminders.date)),
  );
  const curr = new Date();
  const theme = useTheme();
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
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/**dissapear when adding */}
      {!popup && (
      <ThemedView style={styles.createButton}>
      <Pressable
        //what happens when the button is pressed
        onPress={() => {
          setPopup(true);
        }}
        //determines look of the button
        style={({ pressed }) => [styles.button, { backgroundColor: "#4f6eb7" }]}
      >
        {({ pressed }) => <Text style={styles.buttonText}>New Reminder</Text>}
      </Pressable>
      </ThemedView>
    )}

      {/**reworking popup to match format of other tabs */}
      {/**
      <ThemedModal
        visible={modalVisible}
        title="Create Reminder"
        onClose={() => setModalVisible(false)}
        onSave={() => {
          // Save the new reminder to the database

          setModalVisible(false);
        }}
      >
        <ThemedText>Add Reminder</ThemedText>
        {/* Assignment Title Input *}
        <ThemedTextInput
          placeholder="Reminder name"
          value={newRem.name || ""}
          onChangeText={(title) => {
            setNewRem((prev) => ({ ...prev, title }));
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Button to open date selection *}
          <Button
            title={newDT.date ? newDT.date.toDateString() : "Set Due Date"}
            onPress={() => setDateVisible(true)}
          />
          {/* Assignment Time Input *}
          <ThemedTextInput
            placeholder="00:00"
            value={newDT.time}
            keyboardType="numeric"
            onChangeText={(time) => {
              time = parseTime(time) || newDT.time;
              setNewDT((prev) => ({ ...prev, time: time }));
            }}
          />
        </View>
        {dateVisible && (
          <DateTimePicker
            mode="date"
            value={newDT.date || new Date()}
            onValueChange={(event_, date) => {
              setNewDT((prev) => ({ ...prev, date }));
              setDateVisible(false);
            }}
            onDismiss={() => setDateVisible(false)}
            positiveButton={{ label: "Set" }}
          />
        )}
      </ThemedModal>
      */}

      {/* List of reminders (from db) */}
      <Animated.FlatList
        data={notifList}
        keyExtractor={(item: Reminder) => item.name}
        itemLayoutAnimation={LinearTransition.delay(50)}
        contentContainerStyle={{
          paddingTop: 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
        ListEmptyComponent={<ThemedText>No Reminders Yet.</ThemedText>}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            onPress={() => {}}
          
          />
        )}
      ></Animated.FlatList>

      {popup && (
        //popup box and general styling
        <KeyboardAvoidingView style={[styles.popup, { backgroundColor: theme.backgroundElement }]}>
          {/*popup line specific styling*/}
          <View style={[styles.closeButton, { backgroundColor: theme.backgroundElement }]}>
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
              {
                backgroundColor: theme.backgroundElement,
                flexDirection: "row",
                alignItems: "center",
              },
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
              {
                backgroundColor: theme.backgroundElement,
                flexDirection: "row",
                alignItems: "center",
              },
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
              {
                backgroundColor: theme.backgroundElement,
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Enter time:</Text>
            <TextInput
              placeholder="Hour"
              placeholderTextColor={theme.text}
              onChangeText={(newText) => setHour(Number(checkNum(newText, 1, 12)))}
              defaultValue={String(hour)}
              keyboardType="number-pad"
              style={[styles.defaultText, { borderColor: theme.text, color: theme.text }]}
            />
            <Text style={[styles.buttonText, { color: theme.text }]}>:</Text>
            <TextInput
              placeholder="Minute"
              placeholderTextColor={theme.text}
              onChangeText={(newText) => setMin(Number(checkNum(newText, 0, 59)))}
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
              {
                backgroundColor: theme.backgroundElement,
                flexDirection: "row",
                alignItems: "center",
              },
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
              {
                backgroundColor: theme.backgroundElement,
                flexDirection: "column",
                alignItems: "center",
              },
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
                    backgroundColor: theme.backgroundElement,
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
                const today = curr.getDay();
                //creates a reminder class object locally

                //adds a reminder to the database:
                CreateReminder(
                  name,
                  remindMonth,
                  remindStart,
                  today,
                  hour,
                  half,
                  min,
                  repeats,
                  repeatList,
                );
              }} //determines look of the button
              style={({ pressed }) => [styles.button, { backgroundColor: "#4f6eb7" }]}
            >
              {({ pressed }) => <Text style={styles.buttonText}>"Create Reminder"</Text>}
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
     // Centers items vertically
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
  roundButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
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
  createButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    height: 56,
    borderRadius: 8,
    zIndex: 10,
  },
  resetButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    height: 56,
    borderRadius: 8,
    zIndex: 10,
  }
});

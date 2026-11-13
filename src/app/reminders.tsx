import DateTimePicker from "@expo/ui/community/datetime-picker";
import { asc, desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Checkbox } from "expo-checkbox";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
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
  date: new Date(),
  weekday: 0,
  time: new Date(),
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
  date: Date,
  weekday: number,
  time: Date,
  repeating: boolean,
  repeatList: boolean[],
) {
  //this function should control the popup view for entering info
  //main page or app should wait for
  new Reminder_class(name, date, weekday, time, repeating, repeatList);

  const added_reminder: NewReminder = {
    name: name,
    date: date,
    weekday: weekday,
    time: time,
    repeating: repeating,
    repeatList: repeatList,
  };

  storeRem(added_reminder);
}


class Reminder_class {
  name: string;
  date: Date;
  weekday: number;
  time: Date;
  repeats: boolean;
  rep_list: boolean[];

  constructor(
    name: string,
    date: Date,
    weekday: number,
    time: Date,
    repeating: boolean,
    repeatList: boolean[],
  ) {
    this.name = name;
    this.date = date;
    this.weekday = weekday;
    this.time = time;
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
/*
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
*/

async function clearRemList() {
  try {
    await db.delete(reminders);
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
    db.select().from(reminders).orderBy(asc(reminders.date)),
  );
  const curr = new Date();
  const theme = useTheme();
  const [repeats, setRepeat] = useState(false);
  const [repeatList, resetList] = useState(Array(7).fill(false));
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState("");
  const [selectedTime, setSelectedTime] = useState(curr);
  const [course, setCourse] = useState("");
  const [monthDate, setMonthDate] = useState(curr);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [clockVisible, setClockVisible] = useState(false);
  /*
  useEffect(() => {
    // 2. Request permissions on component mount
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permission required", "Failed to get push token for notifications!");
      return;
    }
  }*/
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {!popup && (
        <ThemedView style={styles.resetButton}>
          <Pressable
            //what happens when the button is pressed
            onPress={() => {
              clearRemList();
            }}
            //determines look of the button
            style={({ pressed }) => [styles.button, { backgroundColor: "#4f6eb7" }]}
          >
            {({ pressed }) => <Text style={styles.buttonText}>Clear ALL</Text>}
          </Pressable>
        </ThemedView>
      )}
      {/**dissapear when adding */}
      {!popup && (
        <ThemedView style={styles.createButton}>
          <Pressable
            //what happens when the button is pressed
            onPress={() => {
              setModalVisible(true);
            }}
            //determines look of the button
            style={({ pressed }) => [styles.button, { backgroundColor: "#4f6eb7" }]}
          >
            {({ pressed }) => <Text style={styles.buttonText}>New Reminder</Text>}
          </Pressable>
        </ThemedView>
      )}

      {/**reworking popup to match format of other tabs */}

      <ThemedModal
        visible={modalVisible}
        title="Create Reminder"
        onClose={() => setModalVisible(false)}
        onSave={() => {
          // Save the new reminder to the database
          const weekday = monthDate.getDay();
          //creates a reminder class object locally, and adds reminder to the database
          CreateReminder(name, monthDate, weekday, selectedTime, repeats, repeatList);
          setName("");
          setMonthDate(curr);
          setSelectedTime(curr);
          setRepeat(false);
          resetList(Array(7).fill(false));
          setModalVisible(false);
        }}
      >
        <ThemedText>Add Reminder</ThemedText>
        {/* Reminder Name Input */}
        <ThemedTextInput
          placeholder="Reminder Name"
          value={name || ""}
          onChangeText={(title) => {
            setName(title);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Button to open date selection */}
          <Button
            title={`Remind me on: ${(monthDate.getMonth() + 1)}/${monthDate.getDate()}`}
            onPress={() => setDateVisible(true)}
          />
          <Button
            title={`AT: ${selectedTime.toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit', hour12: true})}`}
            onPress={() => setClockVisible(true)}
          />
        </View>
        {/* Reminder Time Input */}
          {clockVisible && (
          <DateTimePicker
            mode="time"
            value={selectedTime}
            is24Hour={false}
            presentation="dialog"
            onValueChange={(event, date) => {
              setSelectedTime(date);
              setClockVisible(false);
            }}
            onDismiss={() => setClockVisible(false)}
            positiveButton={{ label: "Set" }}
          />
          )}
        {dateVisible && (
          <DateTimePicker
            mode="date"
            value={monthDate}
            onValueChange={(event, date) => {
              setMonthDate(date);
              setDateVisible(false);
            }}
            onDismiss={() => setDateVisible(false)}
            positiveButton={{ label: "Set" }}
          />
        )}
      </ThemedModal>

      {/* List of reminders (from db) */}
      <Animated.FlatList
        data={notifList}
        keyExtractor={(item: Reminder) => item.name}
        itemLayoutAnimation={LinearTransition.delay(50)}
        contentContainerStyle={{
          paddingTop:  useSafeAreaInsets().top + 10,
          paddingHorizontal: 16,
          gap: 8,
        }}
        ListEmptyComponent={<ThemedText>No Reminders Yet.</ThemedText>}
        renderItem={({ item }) => 
        <ListItem 
          title={item.name} 
          subtitle={`${(item.date).getMonth() + 1}/${(item.date).getDate()} 
${selectedTime.toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit', hour12: true})}`}
          onPress={() => {}} />}
          
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
          
          {/*fourth line of popup, date*/}
          
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
                const today = monthDate.getDay();
                //creates a reminder class object locally, and adds reminder to the database
                CreateReminder(name, monthDate, today, selectedTime, repeats, repeatList);
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
    left: 16,
    height: 56,
    borderRadius: 8,
    zIndex: 10,
  },
});

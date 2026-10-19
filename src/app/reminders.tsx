import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';



function CreateReminder(){
    return (
    <View style={styles.container}>
    
    // I want this to be a box that shows up in the middle of the screen over top the current reminders tab and I will be working on creating that next   
     
     <Pressable 
     //what happens when the button is pressed
     onPress={() => {
        //show a textbox for name, a button for if it repeats, which shows a new line of buttons for the week days
     }}

     //determines look of the button
     style={({ pressed }) => [
          styles.button,
          { backgroundColor: '#a21191' }
        ]}>
            <Text style={styles.buttonText}>Create Reminder</Text>
        
    </Pressable>
      
    </View>
  );
}

class Reminder {
    name: String
    repeats: Boolean
    rep_list: Array<boolean>
    curr_day: Number = 3; //testing value, should be set for days of the week

    /*for starting purposes kept as 3 seperate values, 
    *could be set as one fixed length string of numbers in the 
    *format of:
    *{1-digit: day}{2-digit: hour}{2-digit: minute}
    */
    time_day: Number
    time_hour: Number
    time_minute: Number
    constructor
    (name:String, day:Number, hour:Number, min:Number, rep:Boolean,rep_list:boolean[]) {
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
  const[repeats, enableRepeat] = useState(false);
  return (
    <View style={styles.container}>
        
      <Text style={styles.heading}>This is the reminders tab</Text>
     
     <Pressable 
     //what happens when the button is pressed
     onPress={() => {
        CreateReminder();
     }}

     //determines look of the button
     style={({ pressed }) => [
          styles.button,
          { backgroundColor: '#a21191' }
        ]}>
            <Text style={styles.buttonText}>Create Reminder</Text>
        
    </Pressable>
      
    </View>
  );
}


//layouts and styling
const styles = StyleSheet.create({
  container: {
    flex: 1,                 // Fills the entire screen
    alignItems: 'center',    // Centers items horizontally
    justifyContent: 'center',// Centers items vertically
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
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
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

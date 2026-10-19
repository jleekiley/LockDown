import { StyleSheet, Text, View } from "react-native";




export default function Index() {
  return (
    <View style={styles.container} >
      <Text style={styles.title}> Welcome to LOCKDOWN </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
  title: {
    height: "80%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",

    fontSize: 20
  }

});

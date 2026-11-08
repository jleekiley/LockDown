import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { db } from "@/db/client";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { goals } from "@/db/schema";
import {useState,useEffect} from 'react';
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { asc,desc } from "drizzle-orm";
import { Assignment } from "@/db/schema";
import { assignments } from "@/db/schema";
import { ListItem } from "@/components/list-item";
import { Goal } from "@/db/schema";
import Checkbox from "expo-checkbox";
import { ScrollView } from "react-native";




export default function Index() {
  const {data: goallist} = useLiveQuery(
    db.select().from(goals).orderBy(asc(goals.complete),desc(goals.title))
    )
  const {data: assignmentlist} = useLiveQuery(
    db.select().from(assignments).orderBy(desc(assignments.dueDate),desc(assignments.title))
    )
  return(
  <ThemedView style={[styles.list]}>
    <ThemedText>Welcome to LockDown</ThemedText>
    <ScrollView style = {[styles.list]}>
    <Animated.FlatList
            data={assignmentlist}
            keyExtractor={(item: Assignment) => item.id.toString()}
            itemLayoutAnimation={LinearTransition.delay(50)}
            ListEmptyComponent={<ThemedText>No assignments found.</ThemedText>}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                subtitle={item.description}
                onPress={() => {}}
              />
            )}
          ></Animated.FlatList>
    </ScrollView>
    <ScrollView style = {[styles.list]}>
    <Animated.FlatList
            data={goallist}
            keyExtractor={(item: Goal) => item.id.toString()}
            itemLayoutAnimation={LinearTransition.delay(50)}
            ListEmptyComponent={<ThemedText>No goals found.</ThemedText>}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                subtitle={item.description}
                onPress={() => {}}
              />
            )}
          ></Animated.FlatList> 
      </ScrollView>  
            
      </ThemedView>)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list:
  {
    flex: 1
  },
  title: {
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  subtitle: {
    fontSize: 18,
  },
});

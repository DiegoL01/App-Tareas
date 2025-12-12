import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import EditTask from "../../src/components/EditTask";
import ReadTask from "@/src/components/ReadTask";

export default function TaskDetail() {
  const { idTask } = useLocalSearchParams<{ idTask: string }>();
  const [isRead, setIsRead] = useState(true);

  if (!idTask) return null;

  return (
    <View className=" flex-1 p-4 flex-col flex pt-30 bg-gray-100">
      <View className="absolute top-20 right-4 z-10 flex-row bg-white rounded-lg shadow overflow-hidden">
        <Pressable
          onPress={() => setIsRead(true)}
          className={`px-4 py-2 ${isRead ? "bg-blue-600" : "bg-gray-200"}`}
        >
          <Text className={`text-sm font-medium ${isRead ? "text-white" : "text-gray-700"}`}>
            Leer
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setIsRead(false)}
          className={`px-4 py-2 ${!isRead ? "bg-blue-600" : "bg-gray-200"}`}
        >
          <Text className={`text-sm font-medium ${!isRead ? "text-white" : "text-gray-700"}`}>
            Editar
          </Text>
        </Pressable>
      </View>

      {isRead ? (
        <ReadTask id={idTask} onDone={() => setIsRead(false)} />
      ) : (
        <EditTask id={idTask} onDone={() => setIsRead(true)} />
      )}
    </View>
  );
}
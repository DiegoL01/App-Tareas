import React from "react";
import { View } from "react-native";
import TaskForm from "../components/TaskForm";

const AddTaskScreen = () => {

  return (
    <View className="flex-1 bg-gray-100 p-4 top-60">
      <TaskForm />
    </View>
  );
};

export default AddTaskScreen;

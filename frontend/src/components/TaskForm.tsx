import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useTasks } from "../context/TaskContext";

const TaskForm: React.FC = () => {
  const { dispatch } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
    setTitle("");
    setDescription("");
  };

  return (
    <View className="w-full p-4 bg-white rounded-lg shadow mb-4">
      <TextInput
        placeholder="Título de la tarea"
        value={title}
        onChangeText={setTitle}
        className="border border-gray-200 rounded p-3 mb-3"
      />
      <TextInput
        placeholder="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        className="border border-gray-200 rounded p-3 mb-3 h-20"
        multiline
      />
      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.8}
        className="bg-blue-600 py-3 rounded"
      >
        <Text className="text-center text-white font-semibold">Agregar tarea</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskForm;

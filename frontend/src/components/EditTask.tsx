import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useTasks } from "../context/TaskContext";
import { useRouter } from "expo-router";

type Props = {
  id: string;
  onDone?: () => void;
};

const EditTask= ({ id, onDone } : Props) => {
const router = useRouter();
  const { state, dispatch } = useTasks();
  const task = state.tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
  }, [id, task]);

  if (!task) {
    return (
      <View className="p-4">
        <Text className="text-center text-gray-500">Tarea no encontrada</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Validación", "El título no puede estar vacío");
      return;
    }

    dispatch({ type: "EDIT_TASK", payload: { id, title: title.trim(), description: description.trim() } });
    if (onDone) onDone();
  };

  return (
    <View className="p-4">
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        className="border border-gray-300 rounded p-3 mb-3"
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción (opcional)"
        className="border border-gray-300 rounded p-3 mb-3 h-28"
        multiline
      />

      <TouchableOpacity onPress={handleSave} className="bg-green-600 py-3 rounded mb-2">
        <Text className="text-center text-white font-semibold">Guardar cambios</Text>
      </TouchableOpacity>

      
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="bg-gray-300 py-3 rounded"
        >
          <Text className="text-center">Cancelar</Text>
        </TouchableOpacity>
      
    </View>
  );
};

export default EditTask;

import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useTasks } from "../context/TaskContext";
import { Link } from "expo-router";
import { Categorias } from "../components/Categorias"
const HomeScreen = () => {
  const { state, dispatch } = useTasks();

  return (
    <View className="flex-1 bg-gray-100 p-4" >
      <View className="mb-5 mt-5">
        <Categorias />
      </View>
      <Text className="text-xl font-semibold mb-2 border-b-2 border-gray-300 pb-2">Mis tareas</Text>
      <FlatList
        data={state.tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded mb-2 flex-row justify-between items-center shadow-slate-950 shadow-1">
            <Link className="flex-1" href={`/Task/${item.id}`}>
              <View >
                <Text className="font-medium">{item.title}</Text>
                {item.description ? (
                  <Text className="text-sm text-gray-500">{item.description}</Text>
                ) : null}
              </View>
            </Link>
            <TouchableOpacity
              onPress={() => dispatch({ type: "REMOVE_TASK", payload: item.id })}
              className="bg-red-500 px-3 py-1 rounded"
            >
              <Text className="text-white">Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

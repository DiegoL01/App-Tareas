import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, FlatList } from "react-native";
import { useTasks } from "../context/TaskContext";

type CategoryItem = { id: number | null; name: string; color?: string };

export const Categorias = ({ onSelect }: { onSelect: (catId: number | null) => void }) => {
  const { getCategories } = useTasks();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const allItem: CategoryItem = { id: null, name: "Todas", color: undefined };
  const displayList: CategoryItem[] = [allItem, ...categories];

  const handlePress = (item: CategoryItem) => {
    onSelect(item.id);
    setOpen(false);
  };

  return (
    <View className="w-full px-4">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between bg-white rounded-lg px-4 py-3 shadow-md"
      >
        <View>
          <Text className="text-base font-medium">Categorías</Text>
          <Text className="text-sm text-gray-500">Elige una categoría</Text>
        </View>
        <View className="bg-blue-500 rounded-full px-3 py-1">
          <Text className="text-white font-semibold">{open ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {open ? (
        <View className="mt-2 bg-white rounded-lg shadow-md overflow-hidden">
          <FlatList
            data={displayList}
            keyExtractor={(item) => String(item.id ?? "all")}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePress(item)}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-gray-700">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
    </View>
  );
};
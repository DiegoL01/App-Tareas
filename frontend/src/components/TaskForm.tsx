import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, Modal, FlatList } from "react-native";
import { useTasks } from "../context/TaskContext";

type Category = {
  id: number;
  name: string;
  color?: string;
};

const TaskForm: React.FC = () => {
  const { createTask, getCategories, getOrCreateCategory } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "El nombre de la categoría no puede estar vacío");
      return;
    }

    setLoading(true);
    try {
      const category = await getOrCreateCategory(newCategoryName.trim());
      if (category) {
        setCategories([...categories, category]);
        setSelectedCategory(category);
        setShowCreateCategory(false);
        setNewCategoryName("");
        Alert.alert("Éxito", "Categoría creada correctamente");
      } else {
        Alert.alert("Error", "La categoría ya existe. Por favor, selecciónala de la lista.");
        // Recargar categorías
        await loadCategories();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validación", "El título no puede estar vacío");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Validación", "Debes seleccionar una categoría");
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category_id: selectedCategory.id,
      });
      setTitle("");
      setDescription("");
      setSelectedCategory(null);
      Alert.alert("Éxito", "Tarea creada correctamente");
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full p-4 bg-white rounded-lg shadow mb-4">
      <TextInput
        placeholder="Título de la tarea *"
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

      {/* Selector de categoría */}
      <TouchableOpacity
        onPress={() => setShowCategoryModal(true)}
        className="border border-gray-200 rounded p-3 mb-3 bg-gray-50"
        activeOpacity={0.7}
      >
        <Text className="text-gray-500 text-sm mb-1">Categoría *</Text>
        <Text className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
          {selectedCategory ? selectedCategory.name : "Selecciona una categoría"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={loading}
        className={`py-3 rounded ${loading ? "bg-gray-400" : "bg-blue-600"}`}
      >
        <Text className="text-center text-white font-semibold">
          {loading ? "Creando..." : "Agregar tarea"}
        </Text>
      </TouchableOpacity>

      {/* Modal para seleccionar categoría */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Seleccionar categoría</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text className="text-blue-600 text-lg">Cerrar</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCategory(item)}
                  className={`p-4 mb-2 rounded-lg ${
                    selectedCategory?.id === item.id ? "bg-blue-100" : "bg-gray-50"
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedCategory?.id === item.id ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 py-4">
                  No hay categorías disponibles
                </Text>
              }
            />

            <TouchableOpacity
              onPress={() => {
                setShowCategoryModal(false);
                setShowCreateCategory(true);
              }}
              className="mt-4 bg-green-600 py-3 rounded-lg"
            >
              <Text className="text-center text-white font-semibold">
                + Crear nueva categoría
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para crear categoría */}
      <Modal
        visible={showCreateCategory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateCategory(false)}
      >
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold mb-4">Crear nueva categoría</Text>
            <TextInput
              placeholder="Nombre de la categoría"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              className="border border-gray-300 rounded p-3 mb-4"
              autoCapitalize="characters"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowCreateCategory(false);
                  setNewCategoryName("");
                }}
                className="flex-1 bg-gray-300 py-3 rounded-lg"
              >
                <Text className="text-center font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateCategory}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-green-600"}`}
              >
                <Text className="text-center text-white font-semibold">
                  {loading ? "Creando..." : "Crear"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskForm;

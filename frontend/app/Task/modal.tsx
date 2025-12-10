import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-black/50">
      <View className="w-11/12 bg-white rounded-lg p-6">
        <Text className="text-lg font-semibold mb-4">Modal</Text>
        <Text className="text-gray-600 mb-6">Este es el contenido del modal.</Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 py-3 rounded"
        >
          <Text className="text-center text-white font-semibold">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

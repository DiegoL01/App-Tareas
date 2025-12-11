import React, { useState } from "react";
import { TouchableOpacity, View, Text, FlatList } from "react-native";

const CATEGORIES = [
	"Trabajo",
	"Personal",
	"Estudios",
	"Compras",
	"Salud",
	"Otros",
];

 export const Categorias = () => {
	const [open, setOpen] = useState(false);

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
						data={CATEGORIES}
						keyExtractor={(item) => item}
						renderItem={({ item }) => (
							<View className="px-4 py-3 border-b border-gray-100">
								<Text className="text-gray-700">{item}</Text>
							</View>
						)}
					/>
				</View>
			) : null}
		</View>
	);
};



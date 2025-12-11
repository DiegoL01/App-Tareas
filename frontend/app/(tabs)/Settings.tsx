import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";

const Settings = () => {
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [autoSync, setAutoSync] = useState(true);

	return (
		<View className="flex-1 bg-gray-100 p-4">
			<Text className="text-2xl font-bold mb-4">Ajustes (esto es simulado)</Text>

			<View className="bg-white rounded-lg p-4 mb-3 shadow">
				<View className="flex-row justify-between items-center mb-3">
					<View>
						<Text className="text-base font-medium">Notificaciones</Text>
						<Text className="text-sm text-gray-500">Recibir notificaciones push</Text>
					</View>
					<Switch
						value={notifications}
						onValueChange={setNotifications}
						thumbColor={notifications ? "#2563eb" : "#f4f3f4"}
					/>
				</View>

				<View className="flex-row justify-between items-center mb-3">
					<View>
						<Text className="text-base font-medium">Modo oscuro</Text>
						<Text className="text-sm text-gray-500">Ajusta la apariencia de la app</Text>
					</View>
					<Switch
						value={darkMode}
						onValueChange={setDarkMode}
						thumbColor={darkMode ? "#111827" : "#f4f3f4"}
					/>
				</View>

				<View className="flex-row justify-between items-center">
					<View>
						<Text className="text-base font-medium">Sincronización automática</Text>
						<Text className="text-sm text-gray-500">Sincroniza tareas en segundo plano</Text>
					</View>
					<Switch
						value={autoSync}
						onValueChange={setAutoSync}
						thumbColor={autoSync ? "#10b981" : "#f4f3f4"}
					/>
				</View>
			</View>

			<View className="bg-white rounded-lg p-4 mb-3 shadow">
				<Text className="text-base font-medium mb-3">Cuenta</Text>
				<TouchableOpacity className="py-3 border-t border-gray-100">
					<Text className="text-gray-700">Cambiar correo electrónico</Text>
				</TouchableOpacity>
				<TouchableOpacity className="py-3 border-t border-gray-100">
					<Text className="text-gray-700">Cambiar contraseña</Text>
				</TouchableOpacity>
				<TouchableOpacity className="py-3 border-t border-gray-100">
					<Text className="text-red-600">Cerrar sesión</Text>
				</TouchableOpacity>
			</View>

			<View className="bg-white rounded-lg p-4 shadow">
				<Text className="text-base font-medium mb-3">Avanzado</Text>
				<TouchableOpacity className="py-3 border-t border-gray-100">
					<Text className="text-gray-700">Exportar datos</Text>
				</TouchableOpacity>
				<TouchableOpacity className="py-3 border-t border-gray-100">
					<Text className="text-gray-700">Importar datos</Text>
				</TouchableOpacity>
				<TouchableOpacity className="py-3 border-t border-gray-100">
					<Text className="text-gray-700">Borrar caché</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Settings;


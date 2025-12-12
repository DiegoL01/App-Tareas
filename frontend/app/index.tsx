import { Redirect } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import { View } from "react-native";
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { state: { loading, initializing, user, token } } = useAuth();

  // Mostrar loading mientras se carga el token guardado
  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Si no hay usuario o token, redirigir a login
  if (!user && !token) {
    return <Redirect href="/(auth)/Login" />;
  }

  // Si hay usuario y token, redirigir a Home
  return <Redirect href="/(tabs)/Home" />;
}

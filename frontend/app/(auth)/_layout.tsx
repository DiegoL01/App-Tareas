import { Slot, Redirect } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { state: { user, token, initializing } } = useAuth();

  // Mostrar loading mientras se carga el token guardado
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Si ya está autenticado, redirigir a Home
  if (user && token) {
    return <Redirect href="/(tabs)/Home" />;
  }

  // Si no está autenticado, mostrar las pantallas de auth
  return <Slot />;
}

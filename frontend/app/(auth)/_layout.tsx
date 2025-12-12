import { Slot, Redirect } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { state: { user, token, initializing } } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user && token) {
    return <Redirect href="/(tabs)/Home" />;
  }

  return <Slot />;
}

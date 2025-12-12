import { Redirect } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import { View } from "react-native";
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { state: { loading, initializing, user, token } } = useAuth();

  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user && !token) {
    return <Redirect href="/(auth)/Login" />;
  }

  return <Redirect href="/(tabs)/Home" />;
}

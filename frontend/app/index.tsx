import { Slot ,Redirect } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import { View } from "react-native/Libraries/Components/View/View";
import { ActivityIndicator } from "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator";

export default function Index() {
  const {state : {loading , user} } = useAuth();

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  // if (!user) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(tabs)/Home" />;
}

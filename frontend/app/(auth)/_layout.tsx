import { Slot, Redirect } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";

export default function AuthLayout() {
  const { state : {user} } = useAuth();

  if (user) return <Redirect href="/(tabs)/Home" />;

  return <Slot />;
}

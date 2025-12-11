import { Stack } from "expo-router";
import "./global.css";

import { TaskProvider } from "../src/context/TaskContext";
import { AuthProvider } from "@/src/context/AuthContext";

export default function RootLayout() {


  return (
    <AuthProvider>
      <TaskProvider>
        <Stack screenOptions={{ presentation: "modal", headerShown: false }} />
      </TaskProvider>
    </AuthProvider>
  );
}

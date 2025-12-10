import { Stack } from "expo-router";
import "./global.css";

import { TaskProvider } from "../src/context/TaskContext";


export default function RootLayout() {


  return (
    <TaskProvider>
      <Stack screenOptions={{ presentation: "modal", headerShown: false }} />
    </TaskProvider>
  );
}

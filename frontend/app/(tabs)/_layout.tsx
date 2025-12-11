import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import CenterTabButton from "../../src/components/CenterTabButton";
import { Text , Button } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";
import { BackButton } from "@/src/components/BackButton";
function logout() {
    const { logout } = useAuth();
    logout();
}

export default function Layout() {
    return (
        <Tabs
            screenOptions={(navigation)=>({
                headerTitle:()=><Text>Hola Diego</Text>,
                headerRight: () => <Button  title="Cerrar Sesión"  onPress={logout}/>,
                headerLeft: () => <BackButton />,
                headerStyle: {
                    backgroundColor: "#f9fafb",
                    borderBottomColor: "#e5e7eb",
                    borderBottomWidth: 1,
                },
                // stilos de tab bar
                    tabBarStyle: {
                        backgroundColor: "white",
                        borderTopColor: "#e5e7eb",
                        borderTopWidth: 1,
                        height: 60,
                        paddingBottom: 6,
                        // iOS shadow
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 6,
                        // Android shadow
                        elevation: 8,
                    }, tabBarActiveTintColor: "#60a5fa",   // azul bonito
                    tabBarInactiveTintColor: "#94a3b8", // gris claro
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                })}
        >
            <Tabs.Screen name="Home" options={{
                title: "Inicio",
                tabBarIcon: ({ color, size }) => (
                    <AntDesign name="home" color={color} size={size} />
                )
            }} />
            <Tabs.Screen
                name="AddTask"
                options={{
                    title: "Agregar Tarea",
                    tabBarIcon: () => null,
                    tabBarButton: (props) => <CenterTabButton {...props} />,
                }}
            />
            <Tabs.Screen name="Settings" options={{
                title: "Ajustes",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings-outline" color={color} size={size} />
                )
            }} />
        </Tabs>
    );
}

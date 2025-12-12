import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import CenterTabButton from "../../src/components/CenterTabButton";
import { Text , Button, View, ActivityIndicator } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";
import { BackButton } from "@/src/components/BackButton";
import { LogOut } from "@/src/components/LogOut";

export default function Layout() {
    const { logout, state: { user: name, token, initializing } } = useAuth();

    // Proteger las rutas: si no hay token o usuario, redirigir a login
    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!token || !name) {
        return <Redirect href="/(auth)/Login" />;
    }

   
    return (
        <Tabs
            screenOptions={(navigation)=>({
                headerTitle:()=><Text style={{color: "#000", fontWeight: "bold" ,fontSize: 18}}>Hola {name?.name}</Text>,
                headerRight: () => <LogOut />,
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
                headerLeft: () => null,
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

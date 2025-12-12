import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { useRouter } from "expo-router";

export default function Register() {
  const { register, state: { loading, error } } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Completa todos los campos");
      return;
    }

    await register(name, email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/task/icon.png')} style={styles.image} />
        <Text style={styles.title}>Crear Cuenta</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Registrarme" onPress={handleRegister} />
      )}
      <View style={{ marginTop: 20 }}>
        <Text>
          ¿Ya tienes una cuenta?{" "}
          <Text
            style={{ color: "blue" }}
            onPress={() => router.push("/(auth)/Login")}
          >
            Inicia sesión
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    padding: 10,
    marginTop: -60,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

});

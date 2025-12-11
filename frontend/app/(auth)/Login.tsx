import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet , Image} from "react-native";
import { useAuth } from "../../src/hooks/useAuth";
import {useRouter} from "expo-router";


const Login = () => {
  const { login, state: { loading, error } } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return alert("Rellena todos los campos");

    await login(email, password);
  };

  return (
    <View style={styles.container}>
     <View style={styles.imageContainer}>
      <Image source={require('../../assets/task/icon.png')} style={styles.image} />
      <Text style={styles.title}>Iniciar sesión</Text>
      </View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Ingresar" onPress={handleSubmit} />
      )}
      <View style={{ marginTop: 20 }}>
        <Text>
          ¿No tienes una cuenta?{" "}
          <Text
            style={{ color: "blue" }}
            onPress={() => router.push("/(auth)/Register")}
          >
            Regístrate
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
    marginTop:-80,
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
    flexDirection: 'column', // Alinea los elementos horizontalmente
    alignItems: 'center', // Centra verticalmente imagen y texto
    justifyContent: 'flex-start', // Alinea al inicio (puedes cambiarlo a 'center' si quieres centrado)
    padding: 10,
    marginTop: -60,
    // marginBottom: 20,
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
export default Login;
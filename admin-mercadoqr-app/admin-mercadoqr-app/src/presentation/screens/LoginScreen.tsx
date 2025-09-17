import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackAuthRepository } from "../../infrastructure/auth/BackAuthRepository";

export default function LoginScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");


  React.useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace("HomeTabs");
      }
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    const repo = new BackAuthRepository();
    try {

      const result = await repo.login(name, password);
      if (result.success && result.data) {
        await AsyncStorage.setItem('token', result.data.token);
        navigation.replace("HomeTabs");
      } else {
        console.log("Login failed:", result.error);
        alert("Error al iniciar sesión: " + (result.error?.message || "Credenciales inválidas"));
    }
    } catch (error) {
      alert("Error en llamada a login: " + error);
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <View style={{ height: 20 }} />

      <Text>Nombre sucursal</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <View />
      <View style={{ height: 20 }} />
      <Text>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View />

      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
});

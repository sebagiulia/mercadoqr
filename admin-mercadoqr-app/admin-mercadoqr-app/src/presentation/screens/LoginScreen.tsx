import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackAuthRepository } from "../../infrastructure/auth/BackAuthRepository";

export default function LoginScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const repo = new BackAuthRepository();
    const result = await repo.login(name, password);
    if (result.success && result.data) {
      await AsyncStorage.setItem('token', result.data.token);
      navigation.replace("Home");
    } else {
      alert("Error al iniciar sesión: " + result.error);
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

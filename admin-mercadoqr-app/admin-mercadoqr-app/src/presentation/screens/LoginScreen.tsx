import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackAuthRepository } from "../../infrastructure/auth/BackAuthRepository";

export default function LoginScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null); // limpiar error previo
    try {
      const result = await repo.login(name, password);
      if (result.success && result.data) {
        await AsyncStorage.setItem('token', result.data.token);
        navigation.replace("HomeTabs");
      } else {
        console.log("Login failed:", result.error);
        setError("Credenciales inválidas o error en el servidor.");
      }
    } catch (err: any) {
      setError("Error en llamada a login: " + (err.message || err.toString()));
    } finally {
      setLoading(false);
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

      <View style={{ height: 20 }} />

      <Text>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Error visible en pantalla */}
      {error && <Text style={styles.error}>{error}</Text>}

      <View style={{ marginTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Ingresar" onPress={handleLogin} />
        )}
      </View>
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
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

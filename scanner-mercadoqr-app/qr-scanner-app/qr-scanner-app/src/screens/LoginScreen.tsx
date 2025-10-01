import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useLogin } from "../hooks/useLogin";
import { useAuthToken } from "../hooks/useAuthToken";

export default function LoginScreen({ navigation }: any) {
  const { token, setToken } = useAuthToken(navigation, ()=>{});
  const { login, loading, error } = useLogin();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) navigation.replace("Home");
  }, [token]);

  const handleLogin = async () => {
    const t = await login(name, password);
    if (t) setToken(t);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <View style={{ marginVertical: 8 }}>
        <Text style={styles.label}>Nombre scanner</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder=""
        />
      </View>

      <View style={{ marginVertical: 8 }}>
        <Text style={styles.label}>Codigo de acceso</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder=""
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={{ marginTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#4caf50" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#f2f2f2" },
  title: { fontSize: 24, marginBottom: 24, textAlign: "center", fontWeight: "bold", color: "#333" },
  label: { marginBottom: 4, color: "#555", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  error: {
    color: "red",
    marginTop: 12,
    textAlign: "center",
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLogin } from "../hooks/useLogin";
import { useAuthToken } from "../hooks/useAuthToken";

export default function LoginScreen({ navigation }: any) {
  const { token, setToken } = useAuthToken(navigation, () => {});
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Iniciar sesión</Text>

          <View style={{ marginVertical: 8, width: "100%" }}>
            <Text style={styles.label}>Nombre scanner</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />
          </View>

          <View style={{ marginVertical: 8, width: "100%" }}>
            <Text style={styles.label}>Código de acceso</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={{ marginTop: 20, width: "100%" }}>
            {loading ? (
              <ActivityIndicator size="large" color="#4caf50" />
            ) : (
              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Ingresar</Text>
              </Pressable>
            )}
          </View>

          {/* Branding al final */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>mercadoQR Scanner</Text>
            <Text style={styles.footerSubtitle}>
              El validador oficial de mercadoQR
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    marginTop: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    marginBottom: 4,
    color: "#555",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    width: "100%",
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
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  footerSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});

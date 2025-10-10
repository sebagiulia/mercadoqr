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
import { useLogin } from "../../hooks/useLogin";
import { useAuthToken } from "../../hooks/useAuthToken";
import {EyeIcon} from "../../application/other/icons";
import {EyeOffIcon} from "../../application/other/icons";

export default function LoginScreen({ navigation }: any) {
  const { token, setToken } = useAuthToken(navigation, () => {});
  const { login, loading, error } = useLogin();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) navigation.replace("HomeTabs");
  }, [token]);

  const handleLogin = async () => {
    const t = await login(name, password);
    if (t) setToken(t);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Iniciar sesión</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre sucursal</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre sucursal"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Contraseña"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                {showPassword ? <EyeOffIcon color="#888" size={24} /> : <EyeIcon color="#888" size={24} />}
              </Pressable>
            </View>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={{ marginTop: 20 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#4caf50" />
            ) : (
              <Pressable
                style={styles.button}
                onPress={handleLogin}
                android_ripple={{ color: "#388e3c" }}
              >
                <Text style={styles.buttonText}>Ingresar</Text>
              </Pressable>
            )}
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
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    color: "#555",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingRight: 8,
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginVertical: 16,
    textAlign: "center",
  },
});

// src/screens/LoginScreen.tsx
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { login } from "../services/authService";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const success = await login(username, password);
      if (success) {
        navigation.navigate("Scanner"); // ir a la pantalla de escáner
      } else {
        Alert.alert("Error", "Credenciales incorrectas");
      }
    } catch (err) {
      Alert.alert("Error", "Ocurrió un problema al iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingrese credenciales</Text>
      <TextInput
        style={styles.input}
        placeholder="Sucursal"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Credencial"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  TextInput,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Place } from "../../domain/entities/Place";
import { BackPlaceRepository } from "../../infrastructure/place/BackPlaceRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

const repository = new BackPlaceRepository();

export default function PlaceScreen({ navigation }: any) {
  const [place, setPlace] = useState<Place | null>(null);
  const [form, setForm] = useState<Partial<Place>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mpModalVisible, setMpModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [mpAnimation] = useState(new Animated.Value(0));
  const [token, setToken] = useState<string>("");
  const [mpToken, setMpToken] = useState<string>("");

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);

      let storedToken = token;
      if (!storedToken) {
        storedToken = (await AsyncStorage.getItem("token")) || "";
        if (storedToken) {
          setToken(storedToken);
          return;
        } else {
          navigation.replace("Login");
          return;
        }
      }

      try {
        const response = await repository.getPlaceData(storedToken);
        if (response.success && response.data) {
          setPlace(response.data);
          setForm(response.data);
        } else {
          console.error("Error en la respuesta del servidor:", response.message);
          if (response.message === "Token inválido o expirado") {
            navigation.replace("Login");
          }
        }
      } catch (err) {
        console.error("Error cargando sucursal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [token]);

  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const mpModalScale = mpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const openModal = () => {
    setForm(place || {});
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const openMpModal = () => {
    setMpModalVisible(true);
    Animated.timing(mpAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeMpModal = () => {
    Animated.timing(mpAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMpModalVisible(false));
  };

  const savePlace = async () => {
    if (!form.name || !form.address) return;
    setSaving(true);
    if (token === "") {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        navigation.replace("Login");
        setSaving(false);
        return;
      }
      setToken(storedToken);
    }

    try {
      const response = await repository.updatePlaceData(token, form as Place);
      if (response.success && response.data) {
        setPlace(response.data);
        closeModal();
      } else {
        console.error("Error en la respuesta del servidor:", response.message);
        if (response.message === "Token inválido o expirado") {
          navigation.replace("Login");
        }
      }
    } catch (err) {
      console.error("Error guardando sucursal:", err);
    } finally {
      setSaving(false);
      closeModal();
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  const saveMpToken = async () => {
    if (!place) return;
  
    const updatedForm = { ...form, mpToken }; // construyo el form actualizado
  
    setSaving(true);
    try {
      const response = await repository.updatePlaceData(token, updatedForm as Place);
      if (response.success && response.data) {
        setPlace(response.data); // actualizo el estado local
        setForm(response.data);  // también actualizo el form
        closeMpModal();
      } else {
        console.error("Error guardando token de MP:", (response.error?.message || "Error del servidor"));
      }
    } catch (err) {
      console.error("Error guardando token de MP:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !place) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  const renderLabelInput = (
    label: string,
    value: string | undefined,
    onChangeText: (text: string) => void
  ) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: place.img }} style={styles.placeImage} />

      <View style={styles.infoSection}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeDescription}>{place.description}</Text>
        <Text style={styles.placeAddress}>Dirección: {place.address}</Text>
      </View>

      <Pressable style={styles.editButton} onPress={openModal}>
        <Text style={styles.editButtonText}>Editar Información</Text>
      </Pressable>

      <Pressable
        style={[styles.editButton, { backgroundColor: "#009ee3" }]}
        onPress={openMpModal}
      >
        <Text style={styles.editButtonText}>Mercado Pago Token</Text>
        <View style={styles.mpTokenContainer}>
          <Text
            style={styles.mpTokenText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {place.mpToken ? place.mpToken : "No configurado"}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={[styles.editButton, { backgroundColor: "red" }]}
        onPress={logout}
      >
        <Text style={styles.editButtonText}>Cerrar sesión</Text>
      </Pressable>

      {/* Modal sucursal */}
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalContainer, { transform: [{ scale: modalScale }] }]}
          >
            <Text style={styles.modalTitle}>Editar Información</Text>
            {renderLabelInput("Nombre", form.name, (text) =>
              setForm({ ...form, name: text })
            )}
            {renderLabelInput("Descripción", form.description, (text) =>
              setForm({ ...form, description: text })
            )}
            {renderLabelInput("Dirección", form.address, (text) =>
              setForm({ ...form, address: text })
            )}
            {renderLabelInput("Imagen (URL)", form.img, (text) =>
              setForm({ ...form, img: text })
            )}

            {saving && (
              <ActivityIndicator
                size="large"
                color="#4caf50"
                style={{ marginVertical: 10 }}
              />
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButton}
                onPress={savePlace}
                disabled={saving}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                onPress={closeModal}
                disabled={saving}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal MP */}
      <Modal transparent visible={mpModalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalContainer, { transform: [{ scale: mpModalScale }] }]}
          >
            <Text style={styles.modalTitle}>Actualizar Token de Mercado Pago</Text>
            {renderLabelInput("Token", mpToken, setMpToken)}
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={saveMpToken}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                onPress={closeMpModal}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  placeImage: {
    width: "100%",
    maxWidth: 600,
    height: 250,
    resizeMode: "cover",
  },
  infoSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16,
  },
  placeName: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  placeDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  placeAddress: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mpTokenContainer: {
    backgroundColor: "#e6f7fb",
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    width: "100%",
  },
  mpTokenText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#003f5c",
    marginTop: 4,
  },
});

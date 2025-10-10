import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Place } from "../../domain/entities/Place";
import { BackPlaceRepository } from "../../infrastructure/place/BackPlaceRepository";

import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, HomeTabParamList } from "../navigation/types";

import { useAuthToken } from "../../hooks/useAuthToken";
import { usePlace } from "../../hooks/usePlace";

type PlaceScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Sucursal">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: PlaceScreenNavigationProp;
};

const repository = new BackPlaceRepository();

export default function PlaceScreen({ navigation }: Props) {
  const { token, logout } = useAuthToken(navigation, () => navigation.replace("Login"));
  const { place, loading, updatePlace } = usePlace(token, () => logout());

  const [form, setForm] = useState<Partial<Place>>({});
  const [mpToken, setMpToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingPlace, setSavingPlace] = useState(false);
  const [savingMpToken, setSavingMpToken] = useState(false);

  const [placeModalVisible, setPlaceModalVisible] = useState(false);
  const [mpModalVisible, setMpModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const openPlaceModal = () => {
    setForm(place || {});
    setPlaceModalVisible(true);
  };

  const closePlaceModal = () => {
    setErrorMessage(null);
    setPlaceModalVisible(false);
  };

  const openMpModal = () => {
    setMpToken(place?.mpToken || "");
    setMpModalVisible(true);
  };

  const closeMpModal = () => {
    setErrorMessage(null);
    setMpModalVisible(false);
  };

  const openLogoutModal = () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  const savePlace = async () => {
    if (!form.name || !form.address) {
      setErrorMessage("El nombre y la dirección son obligatorios.");
      return;
    }
    try {
      setSavingPlace(true);
      await updatePlace(form);
      closePlaceModal();
    } catch {
      setErrorMessage("Error al actualizar la sucursal");
    } finally {
      setSavingPlace(false);
    }
  };

  const saveMpToken = async () => {
    if (!place) return;
    try {
      setSavingMpToken(true);
      await updatePlace({ ...place, mpToken });
      closeMpModal();
    } catch {
      setErrorMessage("Error al actualizar el token");
    } finally {
      setSavingMpToken(false);
    }
  };

  const handleLogout = () => {
    closeLogoutModal();
    logout();
  };

  if (!place) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#4caf50" />
        ) : (
          <Text style={{ color: "red", fontSize: 16 }}>Error desconocido, intente más tarde.</Text>
        )}
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
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={{ uri: place.img }} style={styles.placeImage} />
        <View style={styles.infoSection}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeDescription}>{place.description}</Text>
          <Text style={styles.placeAddress}>Dirección: {place.address}</Text>
        </View>

        <Pressable style={styles.editButton} onPress={openPlaceModal}>
          <Text style={styles.editButtonText}>Editar Información</Text>
        </Pressable>

        <Pressable style={[styles.editButton, { backgroundColor: "#009ee3" }]} onPress={openMpModal}>
          <Text style={styles.editButtonText}>Mercado Pago Token</Text>
          <View style={styles.mpTokenContainer}>
            <Text style={styles.mpTokenText} numberOfLines={1} ellipsizeMode="tail">
              {place.mpToken ? place.mpToken : "No configurado"}
            </Text>
          </View>
        </Pressable>

        <Pressable style={[styles.editButton, { backgroundColor: "red" }]} onPress={openLogoutModal}>
          <Text style={styles.editButtonText}>Cerrar sesión</Text>
        </Pressable>

        {/* Modal Place */}
        <Modal
          isVisible={placeModalVisible}
          onBackdropPress={closePlaceModal}
          backdropOpacity={0.4}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Información</Text>
            {renderLabelInput("Nombre", form.name, (text) => setForm({ ...form, name: text }))}
            {renderLabelInput("Descripción", form.description, (text) => setForm({ ...form, description: text }))}
            {renderLabelInput("Dirección", form.address, (text) => setForm({ ...form, address: text }))}
            {renderLabelInput("Imagen (URL)", form.img, (text) => setForm({ ...form, img: text }))}
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={savePlace} disabled={savingPlace}>
                {savingPlace ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalButtonText}>Guardar</Text>}
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closePlaceModal} disabled={savingPlace}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal MP */}
        <Modal
          isVisible={mpModalVisible}
          onBackdropPress={closeMpModal}
          backdropOpacity={0.4}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Actualizar Token de Mercado Pago</Text>
            {renderLabelInput("Token", mpToken, setMpToken)}
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={saveMpToken} disabled={savingMpToken}>
                {savingMpToken ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalButtonText}>Guardar</Text>}
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeMpModal} disabled={savingMpToken}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Modal Logout */}
        <Modal
          isVisible={logoutModalVisible}
          onBackdropPress={closeLogoutModal}
          backdropOpacity={0.4}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar cierre de sesión</Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              ¿Estás seguro que deseas cerrar sesión?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, { backgroundColor: "red" }]} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Sí, cerrar sesión</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeLogoutModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  placeImage: { width: "100%", maxWidth: 600, height: 250, resizeMode: "cover" },
  infoSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16,
  },
  placeName: { fontWeight: "bold", fontSize: 24, marginBottom: 8 },
  placeDescription: { fontSize: 16, color: "#555", marginBottom: 12 },
  placeAddress: { fontSize: 14, color: "#333", marginBottom: 8 },
  editButton: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" },
  modalContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  modalButton: { flex: 1, backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  mpTokenContainer: { backgroundColor: "#e6f7fb", padding: 8, borderRadius: 8, marginTop: 6, width: "100%" },
  mpTokenText: { fontSize: 12, fontWeight: "400", color: "#003f5c", marginTop: 4 },
  errorText: { color: "red", fontSize: 14, marginVertical: 8, textAlign: "center", fontWeight: "500" },
});

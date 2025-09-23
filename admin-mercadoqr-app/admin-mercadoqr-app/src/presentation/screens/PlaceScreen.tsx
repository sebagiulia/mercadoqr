import React, { useState } from "react";
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
  FlatList,
} from "react-native";
import { Place } from "../../domain/entities/Place";
import { BackPlaceRepository } from "../../infrastructure/place/BackPlaceRepository";
import Scanner from "../../domain/entities/Scanner";

import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, HomeTabParamList } from "../navigation/types";

import { useAuthToken } from "../../hooks/useAuthToken";
import { usePlace } from "../../hooks/usePlace";
import { useScanners } from "../../hooks/useScanners";
import { useModalAnimation } from "../../hooks/useModalAnimation";

type PlaceScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Sucursal">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: PlaceScreenNavigationProp;
};

const repository = new BackPlaceRepository();

  export default function PlaceScreen({ navigation }: Props) {
    // Token y autenticación
    const { token, logout } = useAuthToken(navigation, () => navigation.replace("Login"));
  
    // Datos de la sucursal
    const { place, loading, updatePlace } = usePlace(token, () => logout());
  
    // Scanners
    const { scanners, addScanner, removeScanner } = useScanners(token, place?.id, () => logout());
  
    // Modales con animación
    const placeModal = useModalAnimation();
    const mpModal = useModalAnimation();
    const scannerModal = useModalAnimation();
    const scannerDetailModal = useModalAnimation();

      // Form states locales para inputs
    const [form, setForm] = useState<Partial<Place>>({});
    const [mpToken, setMpToken] = useState<string>("");
    const [selectedScanner, setSelectedScanner] = useState<Scanner | null>(null);
    const [scannerName, setScannerName] = useState<string>("");
    const [scannerCategory, setScannerCategory] = useState<string>("");
  

  // Funciones para abrir/cerrar modales
  const openModal = () => {
    setForm(place || {});
    placeModal.open();
  };

  const closeModal = () => {
    placeModal.close();
  };

  const openMpModal = () => {
    setMpToken(place?.mpToken || "");
    mpModal.open();
  };

  const closeMpModal = () => {
    mpModal.close();
  };

  const openScannerModal = () => {
    setScannerName("");
    setScannerCategory("");
    scannerModal.open();
  };

  const closeScannerModal = () => {
    scannerModal.close();
  };

  const openScannerDetailModal = (scanner: Scanner) => {
    setSelectedScanner(scanner);
    scannerDetailModal.open();
  };

  const closeScannerDetailModal = () => {
    setSelectedScanner(null);
    scannerDetailModal.close();
  };

  // Funciones para guardar datos
  const savePlace = async () => {
    if (!form.name || !form.address) return;
    await updatePlace(form);
    placeModal.close();
  };

  const saveMpToken = async () => {
    if (!place) return;
    await updatePlace({ ...place, mpToken });
    mpModal.close();
  };

  const saveScanner = async () => {
    if (!scannerName || !scannerCategory) return;
    await addScanner({ name: scannerName, category: parseInt(scannerCategory, 10) });
    scannerModal.close();
  };

  // Función para eliminar scanner
  const deleteScanner = async (scannerId: number) => {
    await removeScanner(scannerId);
    scannerDetailModal.close();
  };

  if (loading || !place) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
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
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
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

      <Pressable style={[styles.editButton, { backgroundColor: "#009ee3" }]} onPress={openMpModal}>
        <Text style={styles.editButtonText}>Mercado Pago Token</Text>
        <View style={styles.mpTokenContainer}>
          <Text style={styles.mpTokenText} numberOfLines={1} ellipsizeMode="tail">
            {place.mpToken ? place.mpToken : "No configurado"}
          </Text>
        </View>
      </Pressable>

      {/* Lista de Scanners */}
      <View style={styles.scannerSection}>
        <Text style={styles.sectionTitle}>Tus Scanners</Text>
        {scanners.length === 0 ? (
          <Text style={styles.noScanners}>No hay scanners registrados</Text>
        ) : (
          <FlatList
            data={scanners}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => openScannerDetailModal(item)}>
                <View style={styles.scannerItem}>
                  <Text style={styles.scannerName}>{item.name}</Text>
                  <Text style={styles.scannerCategory}>Categoría: {item.category}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>

      {/* Botón agregar scanner */}
      <Pressable style={[styles.editButton, { backgroundColor: "purple" }]} onPress={openScannerModal}>
        <Text style={styles.editButtonText}>Agregar Scanner</Text>
      </Pressable>

      <Pressable style={[styles.editButton, { backgroundColor: "red" }]} onPress={logout}>
        <Text style={styles.editButtonText}>Cerrar sesión</Text>
      </Pressable>

      {/* Modal sucursal */}
      <Modal transparent visible={placeModal.visible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: placeModal.scale }] }]}>
            <Text style={styles.modalTitle}>Editar Información</Text>
            {renderLabelInput("Nombre", form.name, (text) => setForm({ ...form, name: text }))}
            {renderLabelInput("Descripción", form.description, (text) => setForm({ ...form, description: text }))}
            {renderLabelInput("Dirección", form.address, (text) => setForm({ ...form, address: text }))}
            {renderLabelInput("Imagen (URL)", form.img, (text) => setForm({ ...form, img: text }))}
            
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={savePlace} >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal MP */}
      <Modal transparent visible={mpModal.visible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: mpModal.scale }] }]}>
            <Text style={styles.modalTitle}>Actualizar Token de Mercado Pago</Text>
            {renderLabelInput("Token", mpToken, setMpToken)}
            
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={saveMpToken}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeMpModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal Scanner */}
      <Modal transparent visible={scannerModal.visible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: scannerModal.scale }] }]}>
            <Text style={styles.modalTitle}>Agregar Scanner</Text>
            {renderLabelInput("Nombre", scannerName, setScannerName)}
            {renderLabelInput("Categoría", scannerCategory, setScannerCategory)}
            
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={saveScanner}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeScannerModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal Detalles Scanner */}
      <Modal transparent visible={scannerDetailModal.visible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: scannerDetailModal.scale }] }]}>
            <Text style={styles.modalTitle}>Detalles del Scanner</Text>
            
            {selectedScanner && (
              <View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nombre:</Text>
                  <Text style={styles.detailValue}>{selectedScanner.name}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Categoría:</Text>
                  <Text style={styles.detailValue}>{selectedScanner.category}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Código de Acceso:</Text>
                  <Text style={styles.detailValue}>{selectedScanner.accessCode}</Text>
                </View>
                
                <View style={[styles.modalButtons, { marginTop: 20 }]}>
                  <Pressable 
                    style={[styles.modalButton, { backgroundColor: "red" }]} 
                    onPress={() => deleteScanner(selectedScanner.id)}
                  >
                    <Text style={styles.modalButtonText}>Eliminar</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.modalButton, { backgroundColor: "#aaa" }]} 
                    onPress={closeScannerDetailModal}
                  >
                    <Text style={styles.modalButtonText}>Cerrar</Text>
                  </Pressable>
                </View>
              </View>
            )}
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
  // Estilos de Scanners
  scannerSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noScanners: {
    fontSize: 14,
    color: "#666",
  },
  scannerItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  scannerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  scannerCategory: {
    fontSize: 14,
    color: "#555",
  },
  // Estilos para detalles del scanner
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
  },
});
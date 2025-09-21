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
  FlatList,
  Alert,
} from "react-native";
import { Place } from "../../domain/entities/Place";
import { BackPlaceRepository } from "../../infrastructure/place/BackPlaceRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

const repository = new BackPlaceRepository();

type Scanner = {
  id: number;
  name: string;
  category: number;
  accessCode: string;
};

export default function PlaceScreen({ navigation }: any) {
  const [place, setPlace] = useState<Place | null>(null);
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [form, setForm] = useState<Partial<Place>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mpModalVisible, setMpModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [scannerDetailModalVisible, setScannerDetailModalVisible] = useState(false);
  const [selectedScanner, setSelectedScanner] = useState<Scanner | null>(null);
  
  // Animaciones
  const [animation] = useState(new Animated.Value(0));
  const [mpAnimation] = useState(new Animated.Value(0));
  const [productAnimation] = useState(new Animated.Value(0));
  const [scannerDetailAnimation] = useState(new Animated.Value(0));
  
  const [token, setToken] = useState<string>("");
  const [mpToken, setMpToken] = useState<string>("");
  
  // estado para scanner form
  const [scannerName, setScannerName] = useState<string>("");
  const [scannerCategory, setScannerCategory] = useState<string>("");

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
          fetchScanners(storedToken, response.data.id);
        } else {
          console.error("Error en la respuesta del servidor:", response.error?.message || "Error desconocido");
          if (response.message === "Token inválido") {
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

  // 🚩 Handler para traer scanners del backend
  const fetchScanners = async (authToken: string, placeId: number) => {
    try {
      const response = await repository.getScanners(authToken);
      if (response.success && response.data) {
        setScanners(response.data);
      }
    } catch (err) {
      console.error("Error obteniendo scanners:", err);
    }
  };

  // Animaciones para modales
  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const mpModalScale = mpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const productModalScale = productAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const scannerDetailModalScale = scannerDetailAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  // Funciones para abrir/cerrar modales
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

  const openScannerModal = () => {
    setScannerName("");
    setScannerCategory("");
    setProductModalVisible(true);
    Animated.timing(productAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeScannerModal = () => {
    Animated.timing(productAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setProductModalVisible(false));
  };

  const openScannerDetailModal = (scanner: Scanner) => {
    setSelectedScanner(scanner);
    setScannerDetailModalVisible(true);
    Animated.timing(scannerDetailAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeScannerDetailModal = () => {
    Animated.timing(scannerDetailAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setScannerDetailModalVisible(false);
      setSelectedScanner(null);
    });
  };

  // Funciones para guardar datos
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
    const updatedForm = { ...form, mpToken };
    setSaving(true);
    try {
      const response = await repository.updatePlaceData(token, updatedForm as Place);
      if (response.success && response.data) {
        setPlace(response.data);
        setForm(response.data);
        closeMpModal();
      } else {
        console.error("Error guardando token de MP:", response.error?.message || "Error del servidor");
      }
    } catch (err) {
      console.error("Error guardando token de MP:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveScanner = async () => {
    if (!place) return;
    const scanner = {
      name: scannerName,
      category: parseInt(scannerCategory, 10),
      id: 0,
      accessCode: ""
    };
    setSaving(true);
    try {
      const response = await repository.createScanner(token, scanner);
      if (response.success && response.data) {
        console.log("Scanner creado");
        setScanners([...scanners, response.data]);
        closeScannerModal();
      } else {
        console.error("Error guardando scanner:", response.error?.message || "Error del servidor");
      }
    } catch (err) {
      console.error("Error guardando scanner:", err);
    } finally {
      setSaving(false);
    }
  };

  // Función para eliminar scanner
  const deleteScanner = async (scannerId: number) => {
    try {
      const response = await repository.deleteScanner(token, scannerId);
      if (response.success) {
        // Actualizar lista de scanners
        setScanners(scanners.filter(scanner => scanner.id !== scannerId));
        closeScannerDetailModal();
      } else {
        console.error("Error eliminando scanner:", response.error?.message || "Error del servidor");
        Alert.alert("Error", "No se pudo eliminar el scanner");
      }
    } catch (err) {
      console.error("Error eliminando scanner:", err);
      Alert.alert("Error", "Ocurrió un error al eliminar el scanner");
    }
  }

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
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: modalScale }] }]}>
            <Text style={styles.modalTitle}>Editar Información</Text>
            {renderLabelInput("Nombre", form.name, (text) => setForm({ ...form, name: text }))}
            {renderLabelInput("Descripción", form.description, (text) => setForm({ ...form, description: text }))}
            {renderLabelInput("Dirección", form.address, (text) => setForm({ ...form, address: text }))}
            {renderLabelInput("Imagen (URL)", form.img, (text) => setForm({ ...form, img: text }))}
            
            {saving && <ActivityIndicator size="large" color="#4caf50" style={{ marginVertical: 10 }} />}
            
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={savePlace} disabled={saving}>
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
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: mpModalScale }] }]}>
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
      <Modal transparent visible={productModalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: productModalScale }] }]}>
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
      <Modal transparent visible={scannerDetailModalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: scannerDetailModalScale }] }]}>
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
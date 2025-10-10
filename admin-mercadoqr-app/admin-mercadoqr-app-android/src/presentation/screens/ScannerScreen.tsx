import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import Scanner from "../../domain/entities/Scanner";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useScanners } from "../../hooks/useScanners";

type Props = {
  placeId: number;
  navigation: any;
};

export default function ScannersScreen({ navigation }: Props) {
  const { token, logout } = useAuthToken(navigation, () => navigation.replace("Login"));
  const { scanners, addScanner, removeScanner } = useScanners(token, () => logout());

  const [scannerModalVisible, setScannerModalVisible] = useState(false);
  const [scannerDetailModalVisible, setScannerDetailModalVisible] = useState(false);

  const [scannerName, setScannerName] = useState<string>("");
  const [scannerCategory, setScannerCategory] = useState<string>("");
  const [selectedScanner, setSelectedScanner] = useState<Scanner | null>(null);

  const [savingScanner, setSavingScanner] = useState(false);
  const [removingScanner, setRemovingScanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openScannerModal = () => {
    setScannerName("");
    setScannerCategory("");
    setErrorMessage(null);
    setScannerModalVisible(true);
  };

  const closeScannerModal = () => {
    setErrorMessage(null);
    setScannerModalVisible(false);
  };

  const openScannerDetailModal = (scanner: Scanner) => {
    setSelectedScanner(scanner);
    setErrorMessage(null);
    setScannerDetailModalVisible(true);
  };

  const closeScannerDetailModal = () => {
    setErrorMessage(null);
    setSelectedScanner(null);
    setScannerDetailModalVisible(false);
  };

  const saveScanner = async () => {
    if (!scannerName || !scannerCategory) {
      setErrorMessage("Nombre y categoría son obligatorios");
      return;
    }
    try {
      setSavingScanner(true);
      await addScanner({ name: scannerName, category: parseInt(scannerCategory, 10) });
      closeScannerModal();
    } catch {
      setErrorMessage("Error al agregar el scanner");
    } finally {
      setSavingScanner(false);
    }
  };

  const deleteScanner = async (scannerId: number) => {
    try {
      setRemovingScanner(true);
      await removeScanner(scannerId);
      closeScannerDetailModal();
    } catch {
      setErrorMessage("Error al eliminar el scanner");
    } finally {
      setRemovingScanner(false);
    }
  };

  const renderLabelInput = (label: string, value: string, onChange: (text: string) => void) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );

  const renderScannerItem = ({ item }: { item: Scanner }) => (
    <Pressable onPress={() => openScannerDetailModal(item)} style={styles.scannerCard} android_ripple={{ color: "#ccc" }}>
      <View style={styles.scannerCardHeader}>
        <Text style={styles.scannerName}>{item.name}</Text>
        <Text style={styles.scannerCategory}>{`Categoría: ${item.category}`}</Text>
      </View>
      {item.accessCode && <Text style={styles.scannerAccessCode}>{`Código: ${item.accessCode}`}</Text>}
    </Pressable>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Tus Scanners</Text>

        {!scanners ? (
          <ActivityIndicator size="large" color="#4caf50" />
        ) : scanners.length === 0 ? (
          
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.noScanners}>No hay scanners registrados</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 16 }}
            data={scanners}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderScannerItem}
          />
        )}

        <Pressable style={[styles.editButton, { backgroundColor: "purple" }]} onPress={openScannerModal}>
          <Text style={styles.editButtonText}>Agregar Scanner</Text>
        </Pressable>

        {/* Modal Agregar Scanner */}
        <Modal
          isVisible={scannerModalVisible}
          onBackdropPress={closeScannerModal}
          backdropOpacity={0.4}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Agregar Scanner</Text>
              {renderLabelInput("Nombre", scannerName, setScannerName)}
              {renderLabelInput("Categoría", scannerCategory, setScannerCategory)}

              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              <Pressable style={styles.modalButton} onPress={saveScanner} disabled={savingScanner}>
                {savingScanner ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalButtonText}>Guardar</Text>}
              </Pressable>

              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeScannerModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Modal Detalles Scanner */}
        <Modal
          isVisible={scannerDetailModalVisible}
          onBackdropPress={closeScannerDetailModal}
          backdropOpacity={0.4}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.modalContainer}>
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
                    <Text style={styles.detailValue}>{selectedScanner.accessCode || "No asignado"}</Text>
                  </View>

                  {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                  <Pressable
                    style={[styles.modalButton, { backgroundColor: "red" }]}
                    onPress={() => deleteScanner(selectedScanner.id)}
                    disabled={removingScanner}
                  >
                    {removingScanner ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalButtonText}>Eliminar</Text>}
                  </Pressable>

                  <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeScannerDetailModal}>
                    <Text style={styles.modalButtonText}>Cerrar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#333" },
  noScanners: { fontSize: 14, color: "#666", marginBottom: 12, textAlign: "center" },

  // Scanner card
  scannerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scannerCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scannerName: { fontSize: 16, fontWeight: "600", color: "#333" },
  scannerCategory: { fontSize: 14, color: "#555" },
  scannerAccessCode: { fontSize: 13, color: "#888" },

  editButton: { backgroundColor: "#4caf50", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 16, bottom: 0 },
  editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" },

  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
  modalButton: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginVertical: 4, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" },
  errorText: { color: "red", fontSize: 14, marginVertical: 8, textAlign: "center", fontWeight: "500" },

  // Detalles
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  detailLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detailValue: { fontSize: 16, color: "#555" },
});

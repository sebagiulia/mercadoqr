import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Movement } from "../../domain/entities/AnalyticsReport";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAnalyticsReport } from "../../hooks/useAnalyticsReport";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { HomeTabParamList, RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type AnalyticsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Movimientos">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = { navigation: AnalyticsScreenNavigationProp };

export default function AnalyticsScreen({ navigation }: Props) {
  const { token, logout } = useAuthToken(navigation, () => navigation.replace("Login"));
  const { report, allProducts, loading } = useAnalyticsReport(token || "", () => logout());

  const [selectedCategory, setSelectedCategory] = useState<"Consumidos" | "Por consumir">("Consumidos");
  const [selectedMovement, setSelectedMovement] = useState<Movement & { img?: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (movement: Movement & { img?: string }) => {
    setSelectedMovement(movement);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  if (!allProducts || !report) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        {loading ? <ActivityIndicator size="large" color="#4caf50" /> : <Text style={{ color: "red" }}>Error cargando datos. Intente más tarde.</Text>}
      </View>
    );
  }

  const categories: Record<"Consumidos" | "Por consumir", (Movement & { img?: string })[]> = {
    "Por consumir": report.toConsume,
    Consumidos: report.consumed,
  };

  const currentData = categories[selectedCategory] || [];

  return (
    <View style={styles.container}>
      {/* Selector */}
      <View style={styles.selectorContainer}>
        {(["Consumidos", "Por consumir"] as const).map((cat) => (
          <Pressable
            key={cat}
            style={[styles.selectorButton, selectedCategory === cat && styles.selectorButtonActive]}
            onPress={() => setSelectedCategory(cat)}
            android_ripple={{ color: "#a5d6a7" }}
          >
            <Text style={[styles.selectorButtonText, selectedCategory === cat && styles.selectorButtonTextActive]}>
              {cat} ({categories[cat]?.length || 0})
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const product = allProducts.find((p) => p.id === item.prod_id);
          return (
            <Pressable
              style={styles.productCard}
              onPress={() => openModal(item)}
              android_ripple={{ color: "#e0e0e0" }}
            >
              <Image
                source={product?.img ? { uri: product.img } : require("../../../assets/placeholder.png")}
                style={styles.productImage}
              />
              <View style={selectedCategory === "Consumidos" ? styles.productInfoConsumed : styles.productInfo}>
                <Text style={styles.productName}>{product?.name}</Text>
                <Text style={styles.productPrice}>Total: ${item.balance}</Text>
                <Text style={styles.productStock}>Cantidad: {item.prod_quant}</Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>No hay datos para mostrar.</Text>
        }
      />

      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        backdropOpacity={0.4}
        animationIn="zoomIn"
        animationOut="zoomOut"
        useNativeDriver
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Detalle del Movimiento</Text>

            {selectedMovement && (
              <>
                {selectedMovement.img && <Image source={{ uri: selectedMovement.img }} style={styles.modalImage} />}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedMovement.user_email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Teléfono</Text>
                  <Text style={styles.detailValue}>{selectedMovement.user_phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cantidad</Text>
                  <Text style={styles.detailValue}>{selectedMovement.prod_quant}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total</Text>
                  <Text style={styles.detailValue}>${selectedMovement.balance}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado</Text>
                  <Text style={styles.detailValue}>{selectedMovement.status}</Text>
                </View>
              </>
            )}

            <Pressable style={styles.closeButton} onPress={closeModal} android_ripple={{ color: "#66bb6a" }}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  selectorContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  selectorButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#e0e0e0" },
  selectorButtonActive: { backgroundColor: "#4caf50" },
  selectorButtonText: { fontSize: 14, color: "#333" },
  selectorButtonTextActive: { color: "#fff", fontWeight: "bold" },
  productCard: { flexDirection: "row", marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", elevation: 3, overflow: "hidden" },
  productInfoConsumed: { flex: 1, padding: 12, justifyContent: "center", backgroundColor: "#e0e0e0" },
  productInfo: { flex: 1, padding: 12, justifyContent: "center" },
  productImage: { width: 100, height: 100 },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  productPrice: { color: "#2E8B57", fontWeight: "bold", marginBottom: 4 },
  productStock: { color: "#555", marginBottom: 4 },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalImage: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
  closeButton: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 12 },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  detailLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detailValue: { fontSize: 16, color: "#555" },
});

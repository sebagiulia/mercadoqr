import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Animated,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Movement  } from "../../domain/entities/AnalyticsReport";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useAnalyticsReport } from "../../hooks/useAnalyticsReport";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { HomeTabParamList, RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useModalAnimation } from "../../hooks/useModalAnimation";

type AnalyticsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Movimientos">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: AnalyticsScreenNavigationProp;
};

export default function AnalyticsScreen({ navigation }: any) {
  // --- Hooks de autenticación y datos ---
  const { token, logout } = useAuthToken(navigation, () => navigation.replace("Login"));
  const { report, allProducts, loading } = useAnalyticsReport(token || "", () => logout());

  // --- Estado UI ---
  const [selectedMovement, setSelectedMovement] = useState<Movement & { img?: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"Consumidos" | "Por consumir">("Consumidos");

  const animation = useRef(new Animated.Value(0)).current;
  const modalScale = animation.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });

  const modal = useModalAnimation();

  // --- Funciones UI ---
  const openModal = (movement: Movement & { img?: string }) => {
    setSelectedMovement(movement);
    modal.open();
  };

  const closeModal = () => {
    modal.close();
  };

  if(!allProducts) {
    if (loading) {
      return (
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      );
    } else {
      return   (<View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={{ margin: 16 }}>Error cargando datos. Intente mas tarde.</Text>;
                </View>)
      
    }

  } 

  if (!report) return <Text style={{ margin: 16 }}>No hay datos disponibles.</Text>;

  const categories: Record<"Consumidos" | "Por consumir", (Movement & { img?: string })[]> = {
    "Por consumir": report.toConsume,
    Consumidos: report.consumed,
  };

  const currentData = categories[selectedCategory] || [];

  return (
    <ScrollView style={styles.container}>
      {/* Selector de categoría */}
      <View style={styles.selectorContainer}>
        {(["Consumidos", "Por consumir"] as const).map((cat) => (
          <Pressable
            key={cat}
            style={[styles.selectorButton, selectedCategory === cat && styles.selectorButtonActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.selectorButtonText, selectedCategory === cat && styles.selectorButtonTextActive]}>
              {cat} ({categories[cat].length})
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Lista de movimientos */}
      <View style={styles.categorySection}>
        <Text style={styles.productCategory}>{selectedCategory}</Text>
        {currentData.length === 0 ? (
          <Text style={{ marginTop: 12, color: "#777" }}>No hay datos para mostrar.</Text>
        ) : (
          currentData.map((movement) => {
            const product = allProducts.find((p) => p.id === movement.prod_id);
            return (
              <Pressable key={movement.id} style={styles.productCard} onPress={() => openModal(movement)}>
                <Image source={{ uri: product?.img }} style={styles.productImage} />
                <View style={selectedCategory === "Consumidos" ? styles.productInfoConsumed : styles.productInfo}>
                  <Text style={styles.productName}>{product?.name}</Text>
                  <Text style={styles.productPrice}>Total: ${movement.balance}</Text>
                  <Text style={styles.productStock}>Cantidad: {movement.prod_quant}</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {/* Modal detalle */}
      <Modal transparent visible={modal.visible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: modal.scale }] }]}>
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
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// --- Estilos (igual que antes) ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  selectorContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  selectorButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#e0e0e0" },
  selectorButtonActive: { backgroundColor: "#4caf50" },
  selectorButtonText: { color: "#333", fontWeight: "bold" },
  selectorButtonTextActive: { color: "#fff" },
  categorySection: { marginBottom: 24 },
  productCategory: { fontSize: 18, fontWeight: "bold", marginVertical: 8, color: "#333" },
  productCard: { flexDirection: "row", marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, overflow: "hidden" },
  productInfoConsumed: { flex: 1, padding: 12, justifyContent: "center", backgroundColor: "#e0e0e0" },
  productInfo: { flex: 1, padding: 12, justifyContent: "center" },
  productImage: { width: 100, height: 100 },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  productPrice: { color: "#2E8B57", fontWeight: "bold", marginBottom: 4 },
  productStock: { color: "#555", marginBottom: 4 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalImage: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
  closeButton: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 12 },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  detailLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detailValue: { fontSize: 16, color: "#555" },
});

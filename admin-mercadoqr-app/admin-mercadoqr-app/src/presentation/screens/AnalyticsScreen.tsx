import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { AnalyticsReport, Movement } from "../../domain/entities/AnalyticsReport";
import { BackAnalyticsRepository } from "../../infrastructure/analytics/BackAnalyticsRepository";
import { GetSalesStats } from "../../application/analytics/GetSaleStats";
import { Product } from "../../domain/entities/Product";
import { BackProductsRepository } from "../../infrastructure/products/BackProductsRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

const analyticsRepo = new BackAnalyticsRepository();
const analytics = new GetSalesStats(analyticsRepo);
const productRepo = new BackProductsRepository();

export default function AnalyticsScreen({ navigation }: any) {
  const [report, setReport] = useState<
    AnalyticsReport & { allMovements?: (Movement & { img?: string })[] } | null
  >(null);
  const [selectedMovement, setSelectedMovement] = useState<
    Movement & { img?: string } | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<
    "Consumidos" | "Por consumir"
  >("Consumidos");

  useEffect(() => {
    const fetchReport = async () => {
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

      const responseAn = await analytics.execute(token);
      if (!responseAn.success || !responseAn.data) {
        console.error(
          "Failed to fetch analytics data",
          responseAn.error?.message || "Error desconocido"
        );
        setLoading(false);
        return;
      }

      try {
        const response = await productRepo.getAll(storedToken);
        if (response.success && response.data) {
          const products = response.data;
          setAllProducts(products);
          const enrichWithImages = (movements: Movement[]) =>
            movements.map((m) => {
              const product = products.find((p) => p.id === m.prod_id);
              return { ...m, img: product?.img ?? "" };
            });

          setReport({
            consumed: enrichWithImages(responseAn.data.consumed),
            toConsume: enrichWithImages(responseAn.data.toConsume),
            allMovements: enrichWithImages(responseAn.data.allMovements),
          });
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [token]);

  const openModal = (movement: Movement & { img?: string }) => {
    setSelectedMovement(movement);
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

  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  if (loading)
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

  if (!report) return <Text style={{ margin: 16 }}>No hay datos disponibles.</Text>;

  const categories: {
    [key in "Consumidos" | "Por consumir"]: (Movement & { img?: string })[];
  } = {
    "Por consumir": report.toConsume,
    Consumidos: report.consumed,
  };

  const currentData = categories[selectedCategory] || [];

  return (
    <ScrollView style={styles.container}>
      {/* Selector de categoría */}
      <View style={styles.selectorContainer}>
        {(Object.keys(categories) as ("Consumidos" | "Por consumir")[]).map(
          (cat) => (
            <Pressable
              key={cat}
              style={[
                styles.selectorButton,
                selectedCategory === cat && styles.selectorButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  selectedCategory === cat && styles.selectorButtonTextActive,
                ]}
              >
                {cat} ({categories[cat].length})
              </Text>
            </Pressable>
          )
        )}
      </View>

      {/* Lista de movimientos */}
      <View style={styles.categorySection}>
        <Text style={styles.productCategory}>{selectedCategory}</Text>
        {currentData.length === 0 ? (
          <Text style={{ marginTop: 12, color: "#777" }}>
            No hay datos para mostrar.
          </Text>
        ) : (
          currentData.map((movement) => {
            const product = allProducts.find((p) => p.id === movement.prod_id);
            return (
              <Pressable
                key={movement.id}
                style={styles.productCard}
                onPress={() => openModal(movement)}
              >
                <Image
                  source={{ uri: product?.img }}
                  style={styles.productImage}
                />
                <View
                  style={
                    selectedCategory === "Consumidos"
                      ? styles.productInfoConsumed
                      : styles.productInfo
                  }
                >
                  <Text style={styles.productName}>{product?.name}</Text>
                  <Text style={styles.productPrice}>
                    Total: ${movement.balance}
                  </Text>
                  <Text style={styles.productStock}>
                    Cantidad: {movement.prod_quant}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {/* Modal detalle */}
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalContainer, { transform: [{ scale: modalScale }] }]}
          >
            <Text style={styles.modalTitle}>Detalle del Movimiento</Text>
            {selectedMovement && (
              <>
                {selectedMovement.img ? (
                  <Image
                    source={{ uri: selectedMovement.img }}
                    style={styles.modalImage}
                  />
                ) : null}
                <View style={styles.detailRow}></View>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedMovement.user_email}</Text>
                <View/>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Teléfono</Text>
                  <Text style={styles.detailValue}>{selectedMovement.user_phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cantidad</Text>
                  <Text style={styles.detailValue}> {selectedMovement.prod_quant}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total</Text>
                  <Text style={styles.detailValue}>${selectedMovement.balance} </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado</Text>
                  <Text style={styles.detailValue}>{selectedMovement.status} </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  selectorButtonActive: { backgroundColor: "#4caf50" },
  selectorButtonText: { color: "#333", fontWeight: "bold" },
  selectorButtonTextActive: { color: "#fff" },

  categorySection: { marginBottom: 24 },
  productCategory: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#333",
  },
  productCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  productInfoConsumed: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
  productInfo: { flex: 1, padding: 12, justifyContent: "center" },
  productImage: { width: 100, height: 100 },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  productPrice: { color: "#2E8B57", fontWeight: "bold", marginBottom: 4 },
  productStock: { color: "#555", marginBottom: 4 },
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
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

import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Product } from "../../domain/entities/Product";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useProducts } from "../../hooks/useProducts";
import { useModalAnimation } from "../../hooks/useModalAnimation";
import { CompositeNavigationProp } from "@react-navigation/native";
import { HomeTabParamList, RootStackParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type CatalogScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Catalogo">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: CatalogScreenNavigationProp;
};

export default function CatalogScreen({ navigation }: Props) {
  // --- Token y autenticación ---
  const { token,logout } = useAuthToken(navigation, () => navigation.replace("Login"));

  // --- Productos ---
  const { products, loading, saving, saveProduct, deleteProduct } = useProducts(token || "", () => logout());

  // --- Modal de producto ---
  const productModal = useModalAnimation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});

  // --- Funciones de modal ---
  const openModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setForm(product);
    } else {
      setSelectedProduct(null);
      setForm({});
    }
    productModal.open();
  };

  const closeModal = () => {
    productModal.close();
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return;

    const updatedProduct: Product = selectedProduct
      ? { ...selectedProduct, ...form }
      : {
          id: 0,
          place_id: 0,
          name: form.name,
          price: form.price,
          category: form.category,
          description: form.description || "",
          img: form.img || "",
          stock: form.stock || 0,
          start_date: form.start_date || "",
          end_date: form.end_date || "",
        };

    await saveProduct(updatedProduct, !selectedProduct);
    closeModal();
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    await deleteProduct(selectedProduct.id);
    closeModal();
  };

  // --- Productos agrupados por categoría ---
  const grouped = products.reduce((acc: Record<string, Product[]>, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.createButton} onPress={() => openModal()}>
        <Text style={styles.createButtonText}>+ Crear Producto</Text>
      </Pressable>

      {Object.entries(grouped).map(([category, items]) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.productCategory}>{category}</Text>
          {items.map((product) => (
            <Pressable key={product.id} style={styles.productCard} onPress={() => openModal(product)}>
              <Image source={{ uri: product.img }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <Text style={styles.productStock}>Stock: {product.stock}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}

      {/* Modal */}
      <Modal transparent visible={productModal.visible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: productModal.scale }] }]}>
            <Text style={styles.modalTitle}>{selectedProduct ? "Editar Producto" : "Crear Producto"}</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio"
              keyboardType="numeric"
              value={form.price?.toString()}
              onChangeText={(text) => setForm({ ...form, price: Number(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock"
              keyboardType="numeric"
              value={form.stock?.toString()}
              onChangeText={(text) => setForm({ ...form, stock: Number(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Imagen (URL)"
              value={form.img}
              onChangeText={(text) => setForm({ ...form, img: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Categoría"
              value={form.category}
              onChangeText={(text) => setForm({ ...form, category: text })}
            />

            {saving && <ActivityIndicator size="large" color="#4caf50" style={{ marginVertical: 10 }} />}

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleSave} disabled={saving}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>

              {selectedProduct && (
                <Pressable style={[styles.modalButton, { backgroundColor: "#ff6666" }]} onPress={handleDelete} disabled={saving}>
                  <Text style={styles.modalButtonText}>Eliminar</Text>
                </Pressable>
              )}

              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeModal} disabled={saving}>
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
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  createButton: { backgroundColor: "#4caf50", padding: 12, borderRadius: 8, marginBottom: 16, alignItems: "center" },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  categorySection: { marginBottom: 24 },
  productCategory: { fontSize: 18, fontWeight: "bold", marginVertical: 8, color: "#333" },
  productCard: { flexDirection: "row", marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, overflow: "hidden" },
  productImage: { width: 100, height: 100 },
  productInfo: { flex: 1, padding: 12, justifyContent: "center" },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  productDescription: { color: "#777", fontSize: 12 },
  productPrice: { color: "#2E8B57", fontWeight: "bold", marginBottom: 4 },
  productStock: { color: "#555", marginBottom: 4 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 8 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  modalButton: { flex: 1, backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});

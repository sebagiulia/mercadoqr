import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Product } from "../../domain/entities/Product";
import { useAuthToken } from "../../hooks/useAuthToken";
import { useProducts } from "../../hooks/useProducts";
import { CompositeNavigationProp } from "@react-navigation/native";
import { HomeTabParamList, RootStackParamList } from "../navigation/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type CatalogScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, "Catalogo">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = { navigation: CatalogScreenNavigationProp };

export default function CatalogScreen({ navigation }: Props) {
  const { token, logout } = useAuthToken(navigation, () =>
    navigation.replace("Login")
  );

  const { products, loading, saveProduct, deleteProduct } = useProducts(
    token || "",
    () => logout()
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savingProd, setSavingProd] = useState(false);
  const [removingProd, setRemoving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setForm(product);
    } else {
      setSelectedProduct(null);
      setForm({});
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setErrorMsg(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      setErrorMsg("Nombre, precio y categoría son obligatorios.");
      return;
    }

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

    try {
      setSavingProd(true);
      await saveProduct(updatedProduct, !selectedProduct);
      closeModal();
    } catch {
      setErrorMsg("Error al guardar el producto.");
    } finally {
      setSavingProd(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) {
      setErrorMsg("No hay producto seleccionado para eliminar.");
      return;
    }

    try {
      setRemoving(true);
      await deleteProduct(selectedProduct.id);
      setSelectedCategory(products ? products[0].category : null);
      closeModal();
    } catch {
      setErrorMsg("Error al eliminar el producto.");
    } finally {
      setRemoving(false);
    }
  };

  const grouped = products
    ? products.reduce((acc: Record<string, Product[]>, p) => {
        if (!acc[p.category]) acc[p.category] = [];
        acc[p.category].push(p);
        return acc;
      }, {})
    : {};

  const categories = Object.keys(grouped);
  if (selectedCategory === null && categories.length > 0) {
    setSelectedCategory(categories[0]);
  }

  if (!products) {
    return loading ? (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    ) : (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "red", fontSize: 16 }}>
          No se pudieron cargar los productos. Intente mas tarde.
        </Text>
      </View>
    );
  }

  const renderLabelInput = (label: string, value: string | number | undefined, onChangeText: (text: string) => void, keyboardType: any = "default") => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value?.toString()} onChangeText={onChangeText} keyboardType={keyboardType} />
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container}>
        <Pressable style={styles.createButton} onPress={() => openModal()}>
          <Text style={styles.createButtonText}>+ Crear Producto</Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonSelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === cat && styles.categoryButtonTextSelected]}>
                {cat} ({grouped[cat].length})
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {selectedCategory && (
          <View style={styles.categorySection}>
            {grouped[selectedCategory].map((product) => (
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
        )}

        <Modal
          isVisible={modalVisible}
          onBackdropPress={closeModal}
          backdropOpacity={0.4}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedProduct ? "Editar Producto" : "Crear Producto"}</Text>

            {renderLabelInput("Nombre", form.name, (t) => setForm({ ...form, name: t }))}
            {renderLabelInput("Descripción", form.description, (t) => setForm({ ...form, description: t }))}
            {renderLabelInput("Precio", form.price, (t) => setForm({ ...form, price: Number(t) }), "numeric")}
            {renderLabelInput("Stock", form.stock, (t) => setForm({ ...form, stock: Number(t) }), "numeric")}
            {renderLabelInput("Imagen (URL)", form.img, (t) => setForm({ ...form, img: t }))}
            {renderLabelInput("Categoría", form.category, (t) => setForm({ ...form, category: t }))}

            {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleSave} disabled={savingProd}>
                {savingProd ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalButtonText}>Guardar</Text>}
              </Pressable>

              {selectedProduct && (
                <Pressable style={[styles.modalButton, { backgroundColor: "#ff6666" }]} onPress={handleDelete}>
                  {removingProd ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalButtonText}>Eliminar</Text>}
                </Pressable>
              )}

              <Pressable style={[styles.modalButton, { backgroundColor: "#aaa" }]} onPress={closeModal}>
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
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  createButton: { backgroundColor: "#4caf50", padding: 12, borderRadius: 8, marginBottom: 16, alignItems: "center" },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  categorySelector: { marginBottom: 16 },
  categoryButton: { backgroundColor: "#eee", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  categoryButtonSelected: { backgroundColor: "#4caf50" },
  categoryButtonText: { fontSize: 14, color: "#333" },
  categoryButtonTextSelected: { color: "#fff", fontWeight: "bold" },
  categorySection: { marginBottom: 24 },
  productCard: { flexDirection: "row", marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, overflow: "hidden" },
  productImage: { width: 100, height: 100 },
  productInfo: { flex: 1, padding: 12, justifyContent: "center" },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  productDescription: { color: "#777", fontSize: 12 },
  productPrice: { color: "#2E8B57", fontWeight: "bold", marginBottom: 4 },
  productStock: { color: "#555", marginBottom: 4 },
  modalContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  modalButton: { flex: 1, backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  errorMsg: { color: "red", fontSize: 14, marginVertical: 8, textAlign: "center", fontWeight: "500" },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
});

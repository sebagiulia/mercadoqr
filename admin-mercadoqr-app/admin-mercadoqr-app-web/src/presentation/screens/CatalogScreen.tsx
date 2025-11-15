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
  const { token, logout } = useAuthToken(navigation, () =>
    navigation.replace("Login")
  );

  // --- Productos ---
  const { products, loading, saving, saveProduct, deleteProduct } = useProducts(
    token || "",
    () => logout()
  );

  // --- Modal de producto ---
  const productModal = useModalAnimation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});

  // --- Categoría seleccionada ---
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [savingProd, setSavingProd] = useState(false);
  const [removingProd, setRemoving] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);


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
    if (!form.name || !form.price || !form.category) {
      setErrorMsg("Nombre, precio y categoría son obligatorios.");
      return
    };

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
    } catch (error) {
      setErrorMsg("Error al guardar el producto.");
    } finally {
    setSavingProd(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct){ 
      setErrorMsg("No hay producto seleccionado para eliminar.");
      return
    };

    try {
      setRemoving(true);
      await deleteProduct(selectedProduct.id);
      closeModal();
    } catch (error) {
      setErrorMsg("Error al eliminar el producto.");
    } finally {
    setRemoving(false);
    }
  };

  // --- Agrupar productos por categoría ---
  const grouped = products ? products.reduce((acc: Record<string, Product[]>, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {}) : {};

  // --- Categorías disponibles ---
  const categories = Object.keys(grouped);

  // Si no hay categoría seleccionada, elegimos la primera
  if (selectedCategory === null && categories.length > 0) {
    setSelectedCategory(categories[0]);
  }

  if(!products) {
    if (loading) {
      return (
        <View
          style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
        >
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      );
    } else {
      return (
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: "red", fontSize: 16 }}>
            No se pudieron cargar los productos. Intente mas tarde.
          </Text>
        </View>
      );
    }
  }

  return (
    
    <ScrollView style={styles.container}>
      {/* Botón crear producto */}
      <Pressable style={styles.createButton} onPress={() => openModal()}>
        <Text style={styles.createButtonText}>+ Crear Producto</Text>
      </Pressable>

      {/* Selector de categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat && styles.categoryButtonTextSelected,
              ]}
            >
              {cat} ({grouped[cat].length})
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Productos de la categoría seleccionada */}
      {selectedCategory && (
        <View style={styles.categorySection}>
          {grouped[selectedCategory].map((product) => (
            <Pressable
              key={product.id}
              style={styles.productCard}
              onPress={() => openModal(product)}
            >
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

      {/* Modal */}
      <Modal transparent visible={productModal.visible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: productModal.scale }] },
            ]}
          >
            <Text style={styles.modalTitle}>
              {selectedProduct ? "Editar Producto" : "Crear Producto"}
            </Text>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={styles.input}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />
          </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Precio</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.price?.toString()}
              onChangeText={(text) => setForm({ ...form, price: Number(text) })}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.stock?.toString()}
              onChangeText={(text) => setForm({ ...form, stock: Number(text) })}
            />
          </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Imagen (URL)</Text>
              <TextInput
                style={styles.input}
                value={form.img}
                onChangeText={(text) => setForm({ ...form, img: text })}
              />
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Categoría</Text>
              <TextInput
                style={styles.input}
                value={form.category}
                onChangeText={(text) => setForm({ ...form, category: text })}
              />
            </View>

            {errorMsg && (
              <Text style={styles.errorMsg}>{errorMsg}</Text>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButton}
                onPress={handleSave}
                disabled={savingProd}
              >
                {savingProd ? 
                <ActivityIndicator size="small" color="#fff" />
                :
                <Text style={styles.modalButtonText}>Guardar</Text>}
              </Pressable>

              {selectedProduct && (
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#ff6666" }]}
                  onPress={handleDelete}
                >
                  {removingProd ? 
                <ActivityIndicator size="small" color="#fff" />
                :
                  <Text style={styles.modalButtonText}>Eliminar</Text>
                  }
                </Pressable>
              )}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  createButton: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Categorías
  categorySelector: { marginBottom: 16 },
  categoryButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonSelected: { backgroundColor: "#4caf50" },
  categoryButtonText: { fontSize: 14, color: "#333" },
  categoryButtonTextSelected: { color: "#fff", fontWeight: "bold" },

  categorySection: { marginBottom: 24 },
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
  productImage: { width: 100, height: 100 },
  productInfo: { flex: 1, padding: 12, justifyContent: "center" },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  productDescription: { color: "#777", fontSize: 12 },
  productPrice: { color: "#2E8B57", fontWeight: "bold", marginBottom: 4 },
  productStock: { color: "#555", marginBottom: 4 },

  // Modal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
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
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  errorMsg: {
    color: "red",
    fontSize: 14,
    marginVertical: 8,
    textAlign: "center",
    fontWeight: "500",
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
  }
});

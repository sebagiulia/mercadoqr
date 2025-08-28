import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
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
import { MockProductRepository } from "../../infrastructure/products/MockProductsRepository";

const repository = new MockProductRepository();

export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});
  const [animation] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true); // Para cargar productos
  const [saving, setSaving] = useState(false); // Para guardar/eliminar producto

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const list = await repository.getAll();
      setProducts(list);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setForm(product);
    } else {
      setSelectedProduct(null);
      setForm({});
    }
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

  const saveProduct = async () => {
    if (!form.name || !form.price) return;

    setSaving(true);

    if (selectedProduct) {
      await repository.update(selectedProduct.id, { ...selectedProduct, ...form } as Product);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        place_id: 1,
        category: form.category || "Sin categoría",
        name: form.name,
        price: form.price,
        description: form.description || "",
        img: form.img || "",
        start_date: form.start_date || "",
        end_date: form.end_date || "",
        stock: form.stock || 0,
      };
      await repository.create(newProduct);
    }

    const list = await repository.getAll();
    setProducts(list);
    setSaving(false);
    closeModal();
  };

  const deleteProduct = async (id: number) => {
    setSaving(true);
    await repository.delete(id);
    const list = await repository.getAll();
    setProducts(list);
    setSaving(false);
    closeModal();
  };

  const grouped = products.reduce((acc: Record<string, Product[]>, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

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
      ))}

      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalContainer, { transform: [{ scale: modalScale }] }]}
          >
            <Text style={styles.modalTitle}>
              {selectedProduct ? "Editar Producto" : "Crear Producto"}
            </Text>

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

            {saving && (
              <ActivityIndicator size="large" color="#4caf50" style={{ marginVertical: 10 }} />
            )}

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={saveProduct} disabled={saving}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
              {selectedProduct && (
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#ff6666" }]}
                  onPress={() => deleteProduct(selectedProduct.id)}
                  disabled={saving}
                >
                  <Text style={styles.modalButtonText}>Eliminar</Text>
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
  categorySection: { marginBottom: 24 },
  categoryTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  productInfo: { flex: 1, padding: 12, justifyContent: "center" },
  productCard: { flexDirection: "row", marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, overflow: "hidden", },
  productImage: { width: 100, height: 100 },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  productPrice: { color: "#2E8B57", fontWeight: "bold", marginBottom: 4 }, 
  productStock: { color: "#555", marginBottom: 4 }, 
  productDescription: { color: "#777", fontSize: 12 }, 
  productCategory: { fontSize: 18, fontWeight: "bold", marginVertical: 8, color: "#333" },
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  modalButton: {
    flex: 1,
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});

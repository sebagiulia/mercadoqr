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
} from "react-native";
import { Place } from "../../domain/entities/Place";
import { BackPlaceRepository } from "../../infrastructure/place/BackPlaceRepository";
const repository = new BackPlaceRepository();

export default function PlaceScreen() {
  const place_id = "tuevento"; // fijo, se puede cambiar según tu lógica
  const [place, setPlace] = useState<Place | null>(null);
  const [form, setForm] = useState<Partial<Place>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      const data = await repository.getPlaceData("tuevento");
      setPlace(data);
      setForm(data);
      setLoading(false);
    };
    fetchPlace();
  }, []);

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

  const savePlace = async () => {
    if (!form.name || !form.address) return;
    setSaving(true);
    const updated = await repository.updatePlaceData(place_id, form);
    setPlace(updated);
    setSaving(false);
    closeModal();
  };

  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  if (loading || !place) {
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
  }

  return (
    <ScrollView style={styles.container}>
      {/* Imagen superior */}
      <Image source={{ uri: place.img }} style={styles.placeImage} />

      {/* Info */}
      <View style={styles.infoSection}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeDescription}>{place.description}</Text>
        <Text style={styles.placeAddress}>Dirección: {place.address}</Text>
      </View>

      {/* Botón de edición */}
      <Pressable style={styles.editButton} onPress={openModal}>
        <Text style={styles.editButtonText}>Editar Sucursal</Text>
      </Pressable>

      {/* Modal de edición */}
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalBackground}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: modalScale }] },
            ]}
          >
            <Text style={styles.modalTitle}>Editar Sucursal</Text>

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
              placeholder="Dirección"
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Imagen (URL)"
              value={form.img}
              onChangeText={(text) => setForm({ ...form, img: text })}
            />

            {saving && (
              <ActivityIndicator
                size="large"
                color="#4caf50"
                style={{ marginVertical: 10 }}
              />
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButton}
                onPress={savePlace}
                disabled={saving}
              >
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
    marginBottom: 24,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
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
});

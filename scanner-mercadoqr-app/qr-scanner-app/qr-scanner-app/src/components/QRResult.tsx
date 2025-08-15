import React from 'react';
import { Image } from "expo-image"
import { View, Text, StyleSheet } from "react-native";
import Product from '../models/Product';

export default function QRResult({ data }: { data: Product }) {
  return (
    <View style={styles.card}>
      {/* Imagen del producto */}
      <Image source={{ uri: data.prod_img }} style={styles.image} />

      {/* Nombre y sucursal */}
      <Text style={styles.productName}>{data.prod_name}</Text>
      <Text style={styles.place}>{data.place_name}</Text>

      {/* Categoría y precio */}
      <View style={styles.row}>
        <Text style={styles.price}>$ {(data.prod_price * data.prod_cant).toLocaleString()}</Text>
      </View>

      {/* Cantidad y fechas */}
      <View>
        <Text style={styles.quantity}>Cantidad: {data.prod_cant}</Text>
        <Text style={styles.date}>
          {new Date(data.start_date).toLocaleDateString()} -{" "}
          {new Date(data.end_date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  place: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
  quantity: {
    fontSize: 14,
    color: "#444",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  consumeButton: {
    backgroundColor: "#ffc107",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});


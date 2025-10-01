import React from 'react';
import { 
  View, 
  StyleSheet, 
  Pressable, 
  Text, 
  ActivityIndicator, 
  Image, 
  ScrollView 
} from 'react-native';
import { useAuthToken } from '../hooks/useAuthToken';
import { usePlace } from '../hooks/usePlace';
import { useScanner } from '../hooks/useScanner';

// Interfaces
export interface Place {
  id: number;
  name: string;
  description: string;
  address: string;
  img: string;
}

export default interface Scanner { 
  id: number;
  place_id: number;
  name: string;
  level: number;
}

export default function HomeScreen({ navigation }: any) {
  const { token, logout } = useAuthToken(navigation, () => navigation.navigate('Login'));
  const { place, loading, error } = usePlace(token, () => navigation.navigate('Login'));
  const { scanner, loadingScanner, errorScanner } = useScanner(token, () => navigation.navigate('Login'));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Información del Place */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sucursal</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : error ? (
          <Text style={styles.errorText}>Error cargando sucursal</Text>
        ) : place ? (
          <>
            {place.img ? (
              <Image source={{ uri: place.img }} style={styles.image} />
            ) : null}
            <Text style={styles.infoText}><Text style={styles.bold}>Nombre:</Text> {place.name}</Text>
            <Text style={styles.infoText}><Text style={styles.bold}>Dirección:</Text> {place.address}</Text>
            <Text style={styles.infoText}><Text style={styles.bold}>Descripción:</Text> {place.description}</Text>
          </>
        ) : (
          <Text style={styles.infoText}>No hay información de la sucursal</Text>
        )}
      </View>

      {/* Información del Scanner */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tu información</Text>
        {loadingScanner ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : errorScanner ? (
          <Text style={styles.errorText}>Error cargando escáner</Text>
        ) : scanner ? (
          <>
            <Text style={styles.infoText}><Text style={styles.bold}>Nombre:</Text> {scanner.name}</Text>
            <Text style={styles.infoText}><Text style={styles.bold}>Nivel:</Text> {scanner.level}</Text>
          </>
        ) : (
          <Text style={styles.infoText}>No hay información de escáner</Text>
        )}
      </View>

      {/* Botones */}
      <Pressable style={styles.scann_button} onPress={() => navigation.replace("Scanner")}>
        <Text style={styles.buttonText}>Escanear</Text>
      </Pressable>
      <Pressable style={styles.logout_button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    textAlign: 'center',
  },
  logout_button: {
    width: '90%',
    height: 50,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  scann_button: {
    height: 50,
    width: '90%',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});

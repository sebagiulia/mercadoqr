import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRResult from "../components/QRResult";
import { fetchQRData, consumeQrByQrId } from "../services/qrService";
import Product from "../models/Product";
import OverlayQR from "../components/OverlayQR";

const { width } = Dimensions.get("window");

export default function App({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [qrData, setQrData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [consumeLoading, setConsumeLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isConsumed, setIsConsumed] = useState(false);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.infoText}>
            Necesitamos permiso para usar la cámara
          </Text>
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Dar permiso</Text>
          </Pressable>

          {/* Botón volver */}
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!loading && !qrData) {
      setLoading(true);
      setErrorMsg(null);
      setIsScanning(false); // Bloquea nuevas lecturas
      try {
        const result = await fetchQRData(data);
        setQrData(result);
      } catch (err) {
        setErrorMsg("No se pudo obtener la información del QR.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConsume = async (data: string) => {
    setConsumeLoading(true);
    setErrorMsg(null);
    try {
      const result = await consumeQrByQrId(data);
      if (result) setIsConsumed(true);
      else setErrorMsg("No se pudo consumir el QR.");
    } catch (err) {
      setErrorMsg("Error al consumir el QR.");
    } finally {
      setConsumeLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {(loading || consumeLoading) && (
        <ActivityIndicator size="large" color="#000" />
      )}

      {errorMsg && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              setErrorMsg(null);
              setIsScanning(true);
            }}
          >
            <Text style={styles.primaryButtonText}>Seguir escaneando</Text>
          </Pressable>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
        </View>
      )}

      {qrData && !loading && !errorMsg && (
        <View style={styles.centerContent}>
          {isConsumed ? (
            <Text style={styles.successText}>
              QR consumido exitosamente
            </Text>
          ) : (
            <QRResult data={qrData} />
          )}

          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              setLoading(false);
              setQrData(null);
              setIsScanning(true);
              setIsConsumed(false);
            }}
          >
            <Text style={styles.primaryButtonText}>Seguir escaneando</Text>
          </Pressable>

          {!isConsumed && (
            <Pressable
              style={styles.primaryButton}
              onPress={() => handleConsume(qrData.id)}
            >
              <Text style={styles.primaryButtonText}>Consumir</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.backButton}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
        </View>
      )}

      {!qrData && !loading && !errorMsg && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={ref}
            facing={"back"}
            onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />

          <OverlayQR boxSize={width * 0.8} />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Escanee el QR</Text>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.replace("Home")}
            >
              <Text style={styles.backButtonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  successText: {
    color: "green",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  footerText: {
    color: "#000",
    fontSize: 18,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 200,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 200,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

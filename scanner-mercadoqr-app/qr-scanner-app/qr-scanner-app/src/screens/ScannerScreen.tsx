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
import Product from "../models/Product";
import OverlayQR from "../components/OverlayQR";
import { useValidator } from "../hooks/useValidator";
import { useAuthToken } from "../hooks/useAuthToken";

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

  const { token, logout } = useAuthToken(navigation, () => navigation.replace("Login"));
  const { fetchProd, consumeQr } = useValidator(token, logout);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerContent}>
        <Text style={styles.infoText}>
          Necesitamos permiso para usar la cámara
        </Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Dar permiso</Text>
        </Pressable>

        {/* Botón volver */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.replace("Home")}
        >
          <Text style={styles.secondaryButtonText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!loading && !qrData) {
      setErrorMsg(null);
      setLoading(true);
      setIsScanning(false); // Bloquea nuevas lecturas
      const result = await fetchProd(data);
      if (result?.success && result.data) {
        setQrData(result.data);
      } else {
        setErrorMsg(result?.message || "QR inválido");
      }

      setLoading(false);
    }
  };

  const handleConsume = async (data: string) => {
    setConsumeLoading(true);
    setErrorMsg(null);
    const result = await consumeQr(data);
    if (result?.success) 
      setIsConsumed(true);
    else {
      setErrorMsg(result?.message || "No se pudo consumir el QR.");
    }

    setConsumeLoading(false);
    }

  return (
    <SafeAreaView style={styles.fullScreen}>
      {(loading || consumeLoading) && (
        <ActivityIndicator size="large" color="#fff" style={styles.loading} />
      )}

      {errorMsg && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              setErrorMsg(null);
              setIsScanning(true);
              setQrData(null);
            }}
          >
            <Text style={styles.secondaryButtonText}>Seguir escaneando</Text>
          </Pressable>
        </View>
      )}

      {qrData && !loading && !errorMsg && (
        <View style={styles.centerContent}>
          {isConsumed ? (
            <Text style={styles.successText}>QR consumido exitosamente</Text>
          ) : (
            <QRResult data={qrData} />
          )}

          {!isConsumed && (
            <Pressable
              style={styles.primaryButton}
              onPress={() => handleConsume(qrData.id)}
            >
              <Text style={styles.primaryButtonText}>Consumir</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              setLoading(false);
              setQrData(null);
              setIsScanning(true);
              setIsConsumed(false);
            }}
          >
            <Text style={styles.secondaryButtonText}>Seguir escaneando</Text>
          </Pressable>

        </View>
      )}

      {!qrData && !loading && !errorMsg && (
        <View style={styles.cameraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            ref={ref}
            facing="back"
            onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />

          {/* Overlay */}
          <View style={styles.overlayContainer}>
            <OverlayQR boxSize={width * 0.75} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Escanee el QR</Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.replace("Home")}
            >
              <Text style={styles.secondaryButtonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: "black",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "black",
  },
  infoText: {
    fontSize: 16,
    color: "white",
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
    color: "limegreen",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 18,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 200,
    alignItems: "center",
    width: "100%",
    maxWidth: 330,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 200,
    alignItems: "center",
    width: "100%",
    maxWidth: 330,
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

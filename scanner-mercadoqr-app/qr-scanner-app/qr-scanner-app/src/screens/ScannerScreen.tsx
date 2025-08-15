import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRResult from "../components/QRResult";
import { fetchQRData, consumeQrByQrId } from "../services/qrService";
import Product from "../models/Product";
import OverlayQR from "../components/OverlayQR"; // Ajustá la ruta según tu estructura

const { width } = Dimensions.get("window");

export default function App() {
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
        <Text style={{ textAlign: "center" }}>
          Necesitamos permiso para usar la cámara
        </Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </Pressable>
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
      {(loading || consumeLoading) && <ActivityIndicator size="large" color="#000" />}
      
      {errorMsg && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "red", marginBottom: 10 }}>{errorMsg}</Text>
          <Pressable style={styles.button} onPress={() => {setErrorMsg(null); setIsScanning(true)}}>
            <Text style={styles.buttonText}>Seguir escaneando</Text>
          </Pressable>
        </View>
      )}

      {qrData && !loading && !errorMsg && (
        <View style={{ alignItems: "center", justifyContent:"space-between" }}>
          {isConsumed ? (
            <Text style={{ color: "green", marginBottom: 10 }}>QR consumido exitosamente</Text>
          ) : (
            <QRResult data={qrData} />
          )}
          <Pressable
            style={styles.button}
            onPress={() => {
              setLoading(false);
              setQrData(null);
              setIsScanning(true);
              setIsConsumed(false);
            }}
          >
            <Text style={styles.buttonText}>Seguir escaneando</Text>
          </Pressable>
          {!isConsumed && (
            <Pressable style={styles.button} onPress={() => handleConsume(qrData.id)}>
              <Text style={styles.buttonText}>Consumir</Text>
            </Pressable>
          )}
        </View>
      )}

      {!qrData && !loading && !errorMsg && (
        <View style={{ flex: 1 }}>
          <CameraView
            style={styles.camera}
            ref={ref}
            facing={"back"}
            onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />

          <OverlayQR boxSize={width * 0.8}/>

          {/* Footer seguro */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Escanee el QR</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  camera: {
    flex: 1,
  },
  footer: {
    paddingVertical: 15,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  footerText: {
    color: "#000",
    fontSize: 18,
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.05)", // minimalista
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
});

import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { styles } from "./styles/camera.styles";

export default function Camera() {
  const router = useRouter();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState('off');
  const [timerIndex, setTimerIndex] = useState(0);
  const [countdown, setCountdown] = useState(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Precisamos de permissão para usar a câmera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>
            Conceder Permissão
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const extractTextFromUri = async (uri) => {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );

    const formData = new FormData();
    formData.append('file', {
      uri: manipulated.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        apikey: 'helloworld',
      },
      body: formData,
    });

    const result = await response.json();

    let extractedText = '';
    if (result.ParsedResults && result.ParsedResults.length > 0) {
      extractedText = result.ParsedResults[0].ParsedText || '';
    }

    if (extractedText.trim() === '') {
      extractedText =
        'Não foi possível extrair texto claramente.\n\nTente usar uma imagem mais nítida e com boa iluminação.';
    }

    return extractedText.trim();
  };

  const TIMER_OPTIONS = [0, 3, 10];

  const takePictureAndExtractText = async () => {
    if (!cameraRef.current || loading) return;

    const timerSeconds = TIMER_OPTIONS[timerIndex];

    if (timerSeconds > 0) {
      let current = timerSeconds;
      setCountdown(current);
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          current -= 1;
          if (current === 0) {
            clearInterval(interval);
            setCountdown(null);
            resolve();
          } else {
            setCountdown(current);
          }
        }, 1000);
      });
    }

    setLoading(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      const extractedText = await extractTextFromUri(photo.uri);

      router.push({
        pathname: '/new-note',
        params: { extractedText },
      });
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível conectar ao serviço de OCR.\nVerifique sua internet.'
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImageAndExtractText = async () => {
    if (loading) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para selecionar imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (result.canceled) return;

    setLoading(true);
    try {
      const extractedText = await extractTextFromUri(result.assets[0].uri);

      router.push({
        pathname: '/new-note',
        params: { extractedText },
      });
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível conectar ao serviço de OCR.\nVerifique sua internet.'
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const toggleTimer = () => {
    setTimerIndex((current) => (current + 1) % TIMER_OPTIONS.length);
  };

  const flashIcon = flash === 'off' ? 'flash-off-outline' : flash === 'on' ? 'flash' : 'flash-outline';
  const timerSeconds = TIMER_OPTIONS[timerIndex];
  const timerLabel = timerSeconds === 0 ? 'OFF' : `${timerSeconds}s`;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={toggleFlash}
          style={styles.iconButton}
        >
          <Ionicons name={flashIcon} size={28} color={flash === 'on' ? '#FCD34D' : '#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTimer}
          style={styles.iconButton}
        >
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="timer-outline" size={26} color={timerSeconds > 0 ? '#FCD34D' : '#fff'} />
            <Text style={{ color: timerSeconds > 0 ? '#FCD34D' : '#fff', fontSize: 11, fontWeight: '600', marginTop: 1 }}>
              {timerLabel}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      />

      {countdown !== null && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <Text style={{
            fontSize: 96,
            fontWeight: '800',
            color: '#fff',
            opacity: 0.9,
            textShadowColor: 'rgba(0,0,0,0.6)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }}>
            {countdown}
          </Text>
        </View>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={pickImageAndExtractText}
          disabled={loading}
        >
          <Ionicons
            name="images-outline"
            size={32}
            color={loading ? '#93C5FD' : '#1E40AF'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePictureAndExtractText}
          disabled={loading || countdown !== null}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse-outline" size={32} color="#1E40AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
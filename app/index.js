import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { styles } from "./styles/index.styles";

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace('/edit-note');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#0F172A', '#1E40AF', '#3B82F6']}
        style={styles.gradient}
      >
        <View style={styles.middleSection}>
          <Text style={styles.title}>ScanNote</Text>
          <Text style={styles.subtitle}>Loading</Text>

          <ActivityIndicator 
            size="large" 
            color="#1E40AF" 
            style={{ marginTop: 30 }}
          />
        </View>
      </LinearGradient>
    </View>
  );
}


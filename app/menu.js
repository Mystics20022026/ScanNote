import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles/menu.styles";

export default function Menu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome!</Text>
        <Text style={styles.description}>
          Capture, edit and save text easily.
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/camera')}
        >
          <Text style={styles.buttonText}>New Note</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/notebooks')}
        >
          <Text style={styles.buttonText}>See NoteBooks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
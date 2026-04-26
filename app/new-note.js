import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { styles } from "./styles/new-note.styles";

export default function NewNote() {
  const router = useRouter();
  const { extractedText } = useLocalSearchParams();

  const [text, setText] = useState('');

  useEffect(() => {
    if (extractedText) {
      setText(extractedText);
    }
  }, [extractedText]);

  const handleSave = () => {
    if (text.trim() === '') {
      Alert.alert('Atenção', 'O texto está vazio!');
      return;
    }
    Alert.alert('Sucesso', 'Nota guardada com sucesso!');
  };

  const handleDelete = () => {
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>New note</Text>
      </View>

      <View style={styles.textDetectedContainer}>
        <Text style={styles.textDetectedTitle}>Text Detected</Text>
      </View>

      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
        placeholder="This is the text detected"
        placeholderTextColor="#64748B"
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete text</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.back()}>
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/notebooks')}>
          <Text style={styles.footerButtonText}>See Notes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
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

  const handleSave = async () => {
  if (text.trim() === '') {
    Alert.alert('Atenção', 'O texto está vazio!');
    return;
  }

  const { error } = await supabase
    .from('notas')              // ← era 'notes', agora é 'notas'
    .insert([{ 
      title: 'Nota sem título', // ← campo title obrigatório
      content: text.trim(),
      user_id: null
    }]);

  if (error) {
    Alert.alert('Erro', 'Não foi possível guardar a nota.');
    console.error(error);
  } else {
    Alert.alert('Sucesso', 'Nota guardada com sucesso!');
    setText('');
  }
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/edit-note.styles";

export default function EditNote() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  
  const [text, setText] = useState('');
  const [noteName, setNoteName] = useState('');

  useEffect(() => {
    if (noteId) {
      fetchNoteDetails();
    }
  }, [noteId]);

  const fetchNoteDetails = async () => {
    const { data, error } = await supabase
      .from('notas')
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) {
      console.error('Erro ao carregar nota:', error.message);
    } else {
      setNoteName(data.title);
      setText(data.content);
    }
  };

  const handleUpdate = async () => {
    if (text.trim() === '') {
      Alert.alert('Atenção', 'O conteúdo da nota não pode estar vazio.');
      return;
    }

    const { error } = await supabase
      .from('notas')
      .update({ 
        title: noteName.trim() || 'Nota sem título',
        content: text.trim() 
      })
      .eq('id', noteId);

    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a nota.');
    } else {
      Alert.alert('Sucesso', 'Nota atualizada!');
      router.back();
    }
  };

  const handleDeleteText = () => {
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subTitle}>Editar Notas</Text>

        <View style={styles.noteNameContainer}>
          <TextInput
            style={styles.noteNameInput}
            placeholder="Note Name"
            placeholderTextColor="#94A3B8"
            value={noteName}
            onChangeText={setNoteName}
          />
        </View>

        <TextInput
          style={styles.textArea}
          multiline
          value={text}
          onChangeText={setText}
          placeholder="This is the text detected"
          placeholderTextColor="#94A3B8"
          textAlignVertical="top"
        />

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteText}>
            <Text style={styles.deleteButtonText}>Delete Text</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footerSticky}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.newNoteButton} 
          onPress={() => router.push('/new-note')}
        >
          <Text style={styles.newNoteButtonText}>New Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
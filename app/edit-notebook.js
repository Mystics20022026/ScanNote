import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/edit-notebook.styles";

export default function EditNotebook() {
  const router = useRouter();
  const { notebookId } = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (notebookId) {
      fetchNotebookDetails();
    }
  }, [notebookId]);

  const fetchNotebookDetails = async () => {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('id', notebookId)
      .single();

    if (error) {
      console.error('Erro ao carregar caderno:', error.message);
    } else {
      setName(data.name);
      setDescription(data.description || '');
    }
  };

  const handleUpdate = async () => {
    if (name.trim() === '') {
      Alert.alert('Atenção', 'O nome do caderno é obrigatório.');
      return;
    }

    const { error } = await supabase
      .from('notebooks')
      .update({ 
        name: name.trim(),
        description: description.trim() 
      })
      .eq('id', notebookId);

    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o caderno.');
    } else {
      Alert.alert('Sucesso', 'Caderno atualizado!');
      router.back();
    }
  };

  const handleDeleteText = () => {
    setName('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subTitle}>Edit Notebook</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.nameInput}
            placeholder="Notebook Name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
        </View>

        <TextInput
          style={styles.textArea}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição"
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
          style={styles.seeNotebooksButton} 
          onPress={() => router.push('/notebooks')}
        >
          <Text style={styles.seeNotebooksButtonText}>See Notebooks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
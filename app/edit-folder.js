import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/edit-folder.styles";

export default function EditFolder() {
  const router = useRouter();
  const { folderId } = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (folderId) {
      fetchFolderDetails();
    }
  }, [folderId]);

  const fetchFolderDetails = async () => {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', folderId)
      .single();

    if (error) {
      console.error('Erro ao carregar pasta:', error.message);
    } else {
      setName(data.name);
      setDescription(data.description || '');
    }
  };

  const handleUpdate = async () => {
    if (name.trim() === '') {
      Alert.alert('Atenção', 'O nome da pasta é obrigatório.');
      return;
    }

    const { error } = await supabase
      .from('folders')
      .update({ 
        name: name.trim(),
        description: description.trim() 
      })
      .eq('id', folderId);

    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a pasta.');
    } else {
      Alert.alert('Sucesso', 'Pasta atualizada!');
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
        <Text style={styles.subTitle}>Edit Folder</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.nameInput}
            placeholder="Folder Name"
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
          style={styles.seeFoldersButton} 
          onPress={() => router.push('/folders')}
        >
          <Text style={styles.seeFoldersButtonText}>See Folders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
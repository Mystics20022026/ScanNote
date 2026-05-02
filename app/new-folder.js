import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/new-folder.styles";

export default function NewFolder() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Atenção', 'O nome da pasta é obrigatório!');
      return;
    }

    const { error } = await supabase
      .from('folders')
      .insert([{ 
        name: name.trim(),
        description: description.trim()
      }]);

    if (error) {
      Alert.alert('Erro', 'Não foi possível criar a pasta.');
    } else {
      Alert.alert('Sucesso', 'Pasta criada com sucesso!');
      router.push('/notebooks'); // Ou para a lista de pastas
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subTitle}>New Folder</Text>

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
          <TouchableOpacity style={styles.deleteButton} onPress={() => {setName(''); setDescription('');}}>
            <Text style={styles.deleteButtonText}>Delete Text</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footerSticky}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeFoldersButton} onPress={() => router.push('/folders')}>
          <Text style={styles.seeFoldersButtonText}>See Folders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/new-notebook.styles";

export default function NewNotebook() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Atenção', 'O nome do caderno é obrigatório!');
      return;
    }

    const { error } = await supabase
      .from('notebooks')
      .insert([{ 
        name: name.trim(),
        description: description.trim(),
        user_id: null // Adicionar lógica de user_id se necessário
      }]);

    if (error) {
      Alert.alert('Erro', 'Não foi possível criar o caderno.');
      console.error(error);
    } else {
      Alert.alert('Sucesso', 'Caderno criado com sucesso!');
      setName('');
      setDescription('');
      router.push('/notebooks');
    }
  };

  const handleDeleteText = () => {
    setDescription('');
    setName('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subTitle}>New Notebook</Text>

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

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
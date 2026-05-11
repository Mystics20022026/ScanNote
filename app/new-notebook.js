import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/new-notebook.styles";

export default function NewNotebook() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Atenção', 'O nome do caderno é obrigatório!');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Erro', 'Não estás autenticado.');
      return;
    }

    const { error } = await supabase
      .from('notebooks')
      .insert([{ 
        name: name.trim(),
        user_id: user.id
      }]);

    if (error) {
      Alert.alert('Erro', 'Não foi possível criar o caderno.');
      console.error(error);
    } else {
      Alert.alert('Sucesso', 'Caderno criado com sucesso!');
      setName('');
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 30 }}>
        <Text style={styles.subTitle}>New Notebook</Text>

        <TextInput
          style={styles.nameInput}
          placeholder="Notebook Name"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

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
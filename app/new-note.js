import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/new-note.styles";

export default function NewNote() {
  const router = useRouter();
  const { extractedText } = useLocalSearchParams();
  
  const [text, setText] = useState('');
  const [noteName, setNoteName] = useState('');
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [showNotebooks, setShowNotebooks] = useState(false);

  useEffect(() => {
    if (extractedText) {
      setText(extractedText);
    }
    fetchNotebooks();
  }, [extractedText]);

  const fetchNotebooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setNotebooks(data || []);
    }
  };

  const handleSave = async () => {
    if (text.trim() === '') {
      Alert.alert('Atenção', 'O texto detetado está vazio!');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Erro', 'Não estás autenticado.');
      return;
    }

    const finalTitle = noteName.trim() === '' ? 'Nota sem título' : noteName.trim();

    const { error } = await supabase
      .from('notas')
      .insert([{ 
        title: finalTitle,
        content: text.trim(),
        user_id: user.id,
        notebook_id: selectedNotebook ? selectedNotebook.id : null
      }]);

    if (error) {
      Alert.alert('Erro', 'Não foi possível guardar a nota.');
      console.error(error);
    } else {
      Alert.alert('Sucesso', 'Nota guardada com sucesso!');
      setText('');
      setNoteName('');
      setSelectedNotebook(null);
      router.replace('/');
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subTitle}>New Note</Text>

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

        {/* Seleção opcional de notebook */}
        <TouchableOpacity
          style={{
            backgroundColor: '#1E3A5F',
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => setShowNotebooks(!showNotebooks)}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>
            {selectedNotebook ? `Notebook: ${selectedNotebook.name}` : 'Adicionar a um notebook (opcional)'}
          </Text>
          <Text style={{ color: '#94A3B8', fontSize: 18 }}>{showNotebooks ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showNotebooks && (
          <View style={{
            backgroundColor: '#0F2440',
            borderRadius: 8,
            marginTop: 4,
            overflow: 'hidden',
          }}>
            <TouchableOpacity
              style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#1E3A5F' }}
              onPress={() => { setSelectedNotebook(null); setShowNotebooks(false); }}
            >
              <Text style={{ color: '#94A3B8', fontSize: 14 }}>Nenhum notebook</Text>
            </TouchableOpacity>

            {notebooks.map((nb) => (
              <TouchableOpacity
                key={nb.id}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#1E3A5F',
                  backgroundColor: selectedNotebook?.id === nb.id ? '#1E40AF' : 'transparent',
                }}
                onPress={() => { setSelectedNotebook(nb); setShowNotebooks(false); }}
              >
                <Text style={{ color: '#fff', fontSize: 14 }}>{nb.name}</Text>
              </TouchableOpacity>
            ))}

            {notebooks.length === 0 && (
              <Text style={{ color: '#94A3B8', padding: 12, fontSize: 14 }}>
                Não tens notebooks criados.
              </Text>
            )}
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Text</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleSave}>
            <Text style={styles.nextButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footerSticky}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeNotesButton} onPress={() => router.push('/notebooks')}>
          <Text style={styles.seeNotesButtonText}>See Notebooks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
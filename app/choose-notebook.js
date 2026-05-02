import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/choose-notebook.styles";

export default function ChooseNotebook() {
  const router = useRouter();
  const { noteContent, noteTitle } = useLocalSearchParams();

  const [notebooks, setNotebooks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao carregar cadernos:', error.message);
    } else {
      setNotebooks(data || []);
    }
  };

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleSaveNote = async () => {
    if (!selectedId) {
      Alert.alert('Atenção', 'Por favor, seleciona um caderno.');
      return;
    }

    const { error } = await supabase
      .from('notas')
      .insert([{ 
        title: noteTitle || 'Nota sem título',
        content: noteContent,
        notebook_id: selectedId
      }]);

    if (error) {
      Alert.alert('Erro', 'Não foi possível guardar a nota.');
    } else {
      Alert.alert('Sucesso', 'Nota guardada no caderno selecionado!');
      router.push('/notebooks');
    }
  };

  const rows = [];
  for (let i = 0; i < notebooks.length; i += 2) {
    rows.push(notebooks.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <Text style={styles.subTitle}>Choose Notebook</Text>
      <Text style={styles.resumeText}>Resume</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.notebookBox,
                      selectedId === item.id && styles.notebookBoxSelected
                    ]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <Text style={styles.notebookText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
                {row.length === 1 && <View style={[styles.notebookBox, styles.emptyBox]} />}
              </View>
            ))}
          </View>

          <View style={styles.actionButtonsInline}>
            <TouchableOpacity style={styles.inlineActionButton}>
              <Text style={styles.actionTextInline}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inlineActionButton}>
              <Text style={styles.actionTextInline}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerSticky}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleSaveNote}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
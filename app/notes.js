import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/notes.styles";

export default function Notes() {
  const router = useRouter();
  const { notebookId, notebookName } = useLocalSearchParams();

  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notas')
      .select('*')
      .eq('notebook_id', notebookId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar notas:', error.message);
    } else {
      setNotes(data || []);
    }
  };

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async () => {
    if (!selectedId) {
      Alert.alert('Atenção', 'Seleciona uma nota primeiro.');
      return;
    }

    const { error } = await supabase
      .from('notas')
      .delete()
      .eq('id', selectedId);

    if (error) {
      Alert.alert('Erro', 'Não foi possível eliminar a nota.');
    } else {
      fetchNotes();
      setSelectedId(null);
    }
  };

  const rows = [];
  for (let i = 0; i < notes.length; i += 2) {
    rows.push(notes.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <Text style={styles.subTitle}>{notebookName || 'Matemática'}</Text>
      <Text style={styles.resumeText}>Notes</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.noteBox,
                      selectedId === item.id && styles.noteBoxSelected
                    ]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <Text style={styles.noteText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
                {row.length === 1 && <View style={[styles.noteBox, styles.emptyBox]} />}
              </View>
            ))}
          </View>

          <View style={styles.actionButtonsInline}>
            <TouchableOpacity style={styles.inlineActionButton} onPress={handleDelete}>
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
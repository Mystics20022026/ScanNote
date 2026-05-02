import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/see-note.styles";

export default function SeeNote() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  
  const [note, setNote] = useState({ title: '', content: '' });

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const fetchNote = async () => {
    const { data, error } = await supabase
      .from('notas')
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) {
      console.error('Erro ao carregar nota:', error.message);
    } else {
      setNote(data);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Eliminar', 'Tens a certeza que queres apagar esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('notas').delete().eq('id', noteId);
          if (!error) router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.noteTitleDisplay}>{note.title || 'Note Name'}</Text>

        <View style={styles.contentCard}>
          <Text style={styles.contentText}>
            {note.content || 'This is the text detected'}
          </Text>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Text</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => router.push({ pathname: '/edit-note', params: { noteId: noteId } })}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footerSticky}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeNotesButton} onPress={() => router.back()}>
          <Text style={styles.seeNotesButtonText}>See Notes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
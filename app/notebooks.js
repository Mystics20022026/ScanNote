import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/notebooks.styles";

export default function Notebooks() {
  const router = useRouter();

  const [notebooks, setNotebooks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [newNotebookModal, setNewNotebookModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [inputName, setInputName] = useState('');

  const selectedNotebook = notebooks.find((nb) => nb.id === selectedId);

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('notebooks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar notebooks:', error.message);
  } else {
    setNotebooks(data || []);
  }
};

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = () => {
    if (!selectedId) {
      Alert.alert('Atenção', 'Seleciona um caderno primeiro.');
      return;
    }
    Alert.alert(
      'Eliminar',
      `Tens a certeza que queres eliminar "${selectedNotebook?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('notebooks')
              .delete()
              .eq('id', selectedId);

            if (error) {
              Alert.alert('Erro', 'Não foi possível eliminar o caderno.');
            } else {
              fetchNotebooks();
              setSelectedId(null);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!selectedId) {
      Alert.alert('Atenção', 'Seleciona um caderno primeiro.');
      return;
    }
    setInputName(selectedNotebook?.name || '');
    setRenameModal(true);
  };

  const handleRenameConfirm = async () => {
    if (inputName.trim() === '') return;

    const { error } = await supabase
      .from('notebooks')
      .update({ name: inputName.trim() })
      .eq('id', selectedId);

    if (error) {
      Alert.alert('Erro', 'Não foi possível renomear o caderno.');
    } else {
      fetchNotebooks();
      setRenameModal(false);
      setInputName('');
    }
  };

  const handleNewNotebook = async () => {
  if (inputName.trim() === '') return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('notebooks')
    .insert([{ name: inputName.trim(), user_id: user.id }]);

  if (error) {
    Alert.alert('Erro', 'Não foi possível criar o caderno.');
  } else {
    fetchNotebooks();
    setNewNotebookModal(false);
    setInputName('');
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

      <Text style={styles.subTitle}>My Notebooks</Text>
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
                {row.length === 1 && (
                  <View style={[styles.notebookBox, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />
                )}
              </View>
            ))}
          </View>

          <View style={styles.actionButtonsInline}>
            <TouchableOpacity style={styles.inlineActionButton} onPress={handleDelete}>
              <Text style={styles.actionTextInline}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inlineActionButton} onPress={handleEdit}>
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
          style={styles.newFolderButton}
          onPress={() => { setInputName(''); setNewNotebookModal(true); }}
        >
          <Text style={styles.newFolderButtonText}>New Notebook</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={newNotebookModal}
        transparent
        animationType="fade"
        onRequestClose={() => setNewNotebookModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Novo Caderno</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do caderno"
              placeholderTextColor="#94A3B8"
              value={inputName}
              onChangeText={setInputName}
              autoFocus
            />
            <TouchableOpacity style={styles.modalConfirmButton} onPress={handleNewNotebook}>
              <Text style={styles.modalConfirmText}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setNewNotebookModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={renameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Renomear Caderno</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Novo nome"
              placeholderTextColor="#94A3B8"
              value={inputName}
              onChangeText={setInputName}
              autoFocus
            />
            <TouchableOpacity style={styles.modalConfirmButton} onPress={handleRenameConfirm}>
              <Text style={styles.modalConfirmText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setRenameModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
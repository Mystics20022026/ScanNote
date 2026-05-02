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
import { styles } from "./styles/folders.styles";

export default function Folders() {
  const router = useRouter();

  const [folders, setFolders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [inputName, setInputName] = useState('');

  const selectedFolder = folders.find((f) => f.id === selectedId);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from('folders') 
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error.message);
    } else {
      setFolders(data || []);
    }
  };

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = () => {
    if (!selectedId) {
      Alert.alert('Atenção', 'Seleciona uma pasta primeiro.');
      return;
    }
    Alert.alert(
      'Eliminar',
      `Tens a certeza que queres eliminar "${selectedFolder?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('folders')
              .delete()
              .eq('id', selectedId);

            if (error) {
              Alert.alert('Erro', 'Não foi possível eliminar a pasta.');
            } else {
              fetchFolders();
              setSelectedId(null);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!selectedId) {
      Alert.alert('Atenção', 'Seleciona uma pasta primeiro.');
      return;
    }
    setInputName(selectedFolder?.name || '');
    setRenameModal(true);
  };

  const handleRenameConfirm = async () => {
    if (inputName.trim() === '') return;

    const { error } = await supabase
      .from('folders')
      .update({ name: inputName.trim() })
      .eq('id', selectedId);

    if (error) {
      Alert.alert('Erro', 'Não foi possível renomear a pasta.');
    } else {
      fetchFolders();
      setRenameModal(false);
      setInputName('');
    }
  };

  const handleNewFolder = async () => {
    if (inputName.trim() === '') return;

    const { error } = await supabase
      .from('folders')
      .insert([{ name: inputName.trim() }]);

    if (error) {
      Alert.alert('Erro', 'Não foi possível criar a pasta.');
    } else {
      fetchFolders();
      setNewFolderModal(false);
      setInputName('');
    }
  };

  const rows = [];
  for (let i = 0; i < folders.length; i += 2) {
    rows.push(folders.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ScanNote</Text>
      </View>

      <Text style={styles.subTitle}>My Folders</Text>
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
                {row.length === 1 && <View style={[styles.notebookBox, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />}
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
          onPress={() => { setInputName(''); setNewFolderModal(true); }}
        >
          <Text style={styles.newFolderButtonText}>New Folders</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={newFolderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setNewFolderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>New Folder</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Folder name"
              placeholderTextColor="#94A3B8"
              value={inputName}
              onChangeText={setInputName}
              autoFocus
            />
            <TouchableOpacity style={styles.modalConfirmButton} onPress={handleNewFolder}>
              <Text style={styles.modalConfirmText}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setNewFolderModal(false)}>
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
            <Text style={styles.modalTitle}>Rename Folder</Text>
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
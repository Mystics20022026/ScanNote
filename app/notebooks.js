import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Text, TouchableOpacity, View, Modal, TextInput, Alert, ScrollView
} from 'react-native';
import { styles } from "./styles/notebooks.styles";

const INITIAL_NOTEBOOKS = [
  { id: '1', name: 'Notebook 1' },
  { id: '2', name: 'Resumos' },
  { id: '3', name: 'Testes' },
  { id: '4', name: 'Despesas' },
];

export default function Notebooks() {
  const router = useRouter();

  const [notebooks, setNotebooks] = useState(INITIAL_NOTEBOOKS);
  const [selectedId, setSelectedId] = useState(null);
  const [newNotebookModal, setNewNotebookModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [inputName, setInputName] = useState('');

  const selectedNotebook = notebooks.find((nb) => nb.id === selectedId);

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
          onPress: () => {
            setNotebooks((prev) => prev.filter((nb) => nb.id !== selectedId));
            setSelectedId(null);
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

  const handleRenameConfirm = () => {
    if (inputName.trim() === '') return;
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === selectedId ? { ...nb, name: inputName.trim() } : nb))
    );
    setRenameModal(false);
    setInputName('');
  };

  const handleNewNotebook = () => {
    if (inputName.trim() === '') return;
    const newNotebook = { id: Date.now().toString(), name: inputName.trim() };
    setNotebooks((prev) => [...prev, newNotebook]);
    setNewNotebookModal(false);
    setInputName('');
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

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>My Notebooks</Text>
        </View>

        <View style={styles.grid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.notebookBox, selectedId === item.id && styles.notebookBoxSelected]}
                  onPress={() => handleSelect(item.id)}
                >
                  <Text style={styles.notebookText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              {row.length === 1 && <View style={styles.notebookBox} />}
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.back()}>
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.newButton]}
          onPress={() => { setInputName(''); setNewNotebookModal(true); }}
        >
          <Text style={styles.footerButtonText}>New Notebook</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={newNotebookModal}
        transparent
        animationType="slide"
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
        animationType="slide"
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
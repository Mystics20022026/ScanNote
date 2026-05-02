import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styles } from "./styles/choose-folder.styles";

export default function ChooseFolder() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('name', { ascending: true });

    if (!error) {
      setFolders(data || []);
    }
  };

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
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

      <Text style={styles.subTitle}>Choose Folder</Text>
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
                      styles.folderBox,
                      selectedId === item.id && styles.folderBoxSelected
                    ]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <Text style={styles.folderText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
                {row.length === 1 && <View style={[styles.folderBox, styles.emptyBox]} />}
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
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => selectedId && router.push('/choose-notebook')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
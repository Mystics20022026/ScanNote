import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Home() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [notesRes, notebooksRes] = await Promise.all([
      supabase.from('notas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('notebooks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    setNotes(notesRes.data || []);
    setNotebooks(notebooksRes.data || []);
    setLoading(false);
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    const { error } = await supabase.from('notas').delete().eq('id', selectedNote);
    if (error) {
      Alert.alert('Erro', 'Não foi possível eliminar a nota.');
    } else {
      setSelectedNote(null);
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={{ backgroundColor: '#2544AD', paddingVertical: 40, alignItems: 'center', marginHorizontal: 10, marginTop: 10, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff' }}>ScanNote</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: '#CBD5E1', fontSize: 14, fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2544AD" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>

          {/* Ações rápidas */}
          <Text style={{ color: '#555', fontSize: 13, fontWeight: '600', marginBottom: 12, letterSpacing: 1, marginTop: 24 }}>AÇÕES RÁPIDAS</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
            <TouchableOpacity
              onPress={() => router.push('/new-note')}
              style={{ flex: 1, backgroundColor: '#2544AD', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 3 }}
            >
              <Text style={{ fontSize: 24 }}>📝</Text>
              <Text style={{ color: '#fff', fontWeight: '700', marginTop: 6 }}>Nova Nota</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/camera')}
              style={{ flex: 1, backgroundColor: '#2544AD', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 3 }}
            >
              <Text style={{ fontSize: 24 }}>📷</Text>
              <Text style={{ color: '#fff', fontWeight: '700', marginTop: 6 }}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/new-notebook')}
              style={{ flex: 1, backgroundColor: '#2544AD', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 3 }}
            >
              <Text style={{ fontSize: 24 }}>📚</Text>
              <Text style={{ color: '#fff', fontWeight: '700', marginTop: 6 }}>Caderno</Text>
            </TouchableOpacity>
          </View>

          {/* Cadernos */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#555', fontSize: 13, fontWeight: '600', letterSpacing: 1 }}>CADERNOS</Text>
            <TouchableOpacity onPress={() => router.push('/notebooks')}>
              <Text style={{ color: '#2544AD', fontSize: 13, fontWeight: '600' }}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {notebooks.length === 0 ? (
            <Text style={{ color: '#94A3B8', fontSize: 14, marginBottom: 28 }}>Ainda não tens cadernos criados.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 28 }}>
              {notebooks.map((nb) => (
                <TouchableOpacity
                  key={nb.id}
                  onPress={() => router.push({ pathname: '/notes', params: { notebookId: nb.id, notebookName: nb.name } })}
                  style={{ backgroundColor: '#E9F0F8', borderRadius: 12, padding: 16, marginRight: 12, width: 140, elevation: 2 }}
                >
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>📚</Text>
                  <Text style={{ color: '#1E2937', fontWeight: '700', fontSize: 14 }} numberOfLines={1}>{nb.name}</Text>
                  <Text style={{ color: '#555', fontSize: 12, marginTop: 4 }} numberOfLines={2}>{nb.description || 'Sem descrição'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Notas recentes */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#555', fontSize: 13, fontWeight: '600', letterSpacing: 1 }}>NOTAS RECENTES</Text>
            {selectedNote && (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/edit-note', params: { noteId: selectedNote } })}>
                  <Text style={{ color: '#2544AD', fontSize: 13, fontWeight: '600' }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteNote}>
                  <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600' }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {notes.length === 0 ? (
            <Text style={{ color: '#94A3B8', fontSize: 14 }}>Ainda não tens notas criadas.</Text>
          ) : (
            notes.map((note) => (
              <TouchableOpacity
                key={note.id}
                onPress={() => setSelectedNote(selectedNote === note.id ? null : note.id)}
                style={{
                  backgroundColor: selectedNote === note.id ? '#2544AD' : '#E9F0F8',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 10,
                  elevation: 2,
                  borderWidth: selectedNote === note.id ? 1 : 0,
                  borderColor: '#2544AD',
                }}
              >
                <Text style={{ color: selectedNote === note.id ? '#fff' : '#1E2937', fontWeight: '700', fontSize: 15 }}>{note.title}</Text>
                <Text style={{ color: selectedNote === note.id ? '#CBD5E1' : '#555', fontSize: 13, marginTop: 4 }} numberOfLines={2}>{note.content}</Text>
              </TouchableOpacity>
            ))
          )}

        </ScrollView>
      )}

      {/* Botão fixo */}
      <View style={{ position: 'absolute', bottom: 30, left: 20, right: 20 }}>
        <TouchableOpacity
          onPress={() => router.push('/camera')}
          style={{ backgroundColor: '#2544AD', borderRadius: 14, padding: 16, alignItems: 'center', elevation: 4 }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>📷 Detetar Texto</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

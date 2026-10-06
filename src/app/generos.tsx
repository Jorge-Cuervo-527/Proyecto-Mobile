import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { getGeneros, createGenero, updateGenero } from "../api/apiService";

export default function GenerosScreen() {
  const [data, setData] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [descripcion, setDescripcion] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try { const res = await getGeneros(); setData(res.data); } catch (error) { console.log(error); }
  };

  const handleSubmit = async () => {
    if (!nombre) return Alert.alert('Error', 'El nombre es obligatorio');
    try {
      if (editId) await updateGenero(editId, { nombre, estado, descripcion });
      else await createGenero({ nombre, estado, descripcion });
      cargarDatos();
      setNombre(''); setEstado('Activo'); setDescripcion(''); setEditId(null);
    } catch (error) { Alert.alert('Error', 'Fallo al guardar'); }
  };

  const formularioJSX = (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{editId ? 'Editar Género' : 'Crear Género'}</Text>
      <TextInput style={styles.input} placeholder="Nombre (Ej: Acción)" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Estado (Activo/Inactivo)" value={estado} onChangeText={setEstado} />
      <TouchableOpacity style={styles.btnGuardar} onPress={handleSubmit}>
        <Text style={styles.textoBoton}>{editId ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <Text style={styles.header}>Gestión de Géneros</Text>
        <FlatList
          data={data} keyExtractor={(item) => item._id} ListHeaderComponent={formularioJSX}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.tituloTarjeta}>{item.nombre}</Text>
              <Text>{item.descripcion}</Text>
              <Text>Estado: {item.estado}</Text>
              <TouchableOpacity style={styles.btnEditar} onPress={() => { setNombre(item.nombre); setEstado(item.estado); setDescripcion(item.descripcion); setEditId(item._id); }}>
                <Text style={styles.textoBoton}>Editar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Reutiliza exactamente los mismos `styles` del archivo directores.tsx
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 15, paddingTop: 40 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  btnGuardar: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
  tarjeta: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  tituloTarjeta: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 5 },
  btnEditar: { backgroundColor: '#ffc107', padding: 8, borderRadius: 5, marginTop: 10, alignItems: 'center' }
});
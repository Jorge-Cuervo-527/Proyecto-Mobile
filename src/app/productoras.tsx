import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { getProductoras, createProductora, updateProductora } from "../api/apiService";

export default function ProductorasScreen() {
  const [data, setData] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [slogan, setSlogan] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { cargarDatos(); }, []);
  const cargarDatos = async () => { try { const res = await getProductoras(); setData(res.data); } catch (error) { console.log(error); } };

  const handleSubmit = async () => {
    if (!nombre) return Alert.alert('Error', 'El nombre es obligatorio');
    try {
      if (editId) await updateProductora(editId, { nombre, estado, slogan, descripcion });
      else await createProductora({ nombre, estado, slogan, descripcion });
      cargarDatos();
      setNombre(''); setEstado('Activo'); setSlogan(''); setDescripcion(''); setEditId(null);
    } catch (error) { Alert.alert('Error', 'Fallo al guardar'); }
  };

  const formularioJSX = (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{editId ? 'Editar Productora' : 'Crear Productora'}</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Slogan" value={slogan} onChangeText={setSlogan} />
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
        <Text style={styles.header}>Gestión de Productoras</Text>
        <FlatList
          data={data} keyExtractor={(item) => item._id} ListHeaderComponent={formularioJSX}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.tituloTarjeta}>{item.nombre}</Text>
              <Text>Slogan: {item.slogan}</Text>
              <Text>Estado: {item.estado}</Text>
              <TouchableOpacity style={styles.btnEditar} onPress={() => { setNombre(item.nombre); setEstado(item.estado); 
                setSlogan(item.slogan); setDescripcion(item.descripcion); setEditId(item._id); }}>
                <Text style={styles.textoBoton}>Editar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f4f6f8', padding: 15, paddingTop: 40 }, 
header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }, formContainer: 
{ backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 }, formTitle: 
{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }, input: { borderWidth: 1, borderColor: '#ccc', 
borderRadius: 8, padding: 10, marginBottom: 10 }, btnGuardar: { backgroundColor: '#007bff', padding: 12, 
borderRadius: 8, alignItems: 'center' }, textoBoton: { color: '#fff', fontWeight: 'bold' }, tarjeta: 
{ backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 }, tituloTarjeta: 
{ fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 5 }, btnEditar: { backgroundColor: '#ffc107',
 padding: 8, borderRadius: 5, marginTop: 10, alignItems: 'center' } });
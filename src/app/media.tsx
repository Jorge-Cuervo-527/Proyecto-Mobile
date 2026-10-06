import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, Platform, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { getMedia, createMedia, updateMedia, deleteMedia, getDirectores, getGeneros, getProductoras, getTipos } from "../api/apiService";

export default function MediaScreen() {
  const [medias, setMedias] = useState<any[]>([]);
  const [directores, setDirectores] = useState<any[]>([]);
  const [generos, setGeneros] = useState<any[]>([]);
  const [productoras, setProductoras] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);

  const [serial, setSerial] = useState('');
  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [urlPelicula, setUrlPelicula] = useState('');
  const [imagen, setImagen] = useState('');
  const [anioEstreno, setAnioEstreno] = useState('');
  
  const [generoPrincipal, setGeneroPrincipal] = useState('');
  const [directorPrincipal, setDirectorPrincipal] = useState('');
  const [productora, setProductora] = useState('');
  const [tipo, setTipo] = useState('');
  
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { cargarTodosLosDatos(); }, []);

  const cargarTodosLosDatos = async () => {
    try {
      const [resMedia, resDir, resGen, resProd, resTipo] = await Promise.all([
        getMedia(), getDirectores(), getGeneros(), getProductoras(), getTipos()
      ]);
      setMedias(resMedia.data); setDirectores(resDir.data); setGeneros(resGen.data);
      setProductoras(resProd.data); setTipos(resTipo.data);
    } catch (error) { Alert.alert('Error', 'Fallo al cargar bases de datos.'); }
  };

  const handleSubmit = async () => {
    if (!serial || !titulo || !urlPelicula || !generoPrincipal || !directorPrincipal || !productora || !tipo) {
      return Alert.alert('Error', 'Faltan campos obligatorios o selecciones.');
    }

    const payload = { 
      serial, titulo, sinopsis, urlPelicula, imagenPortada: imagen, anioEstreno, 
      genero: generoPrincipal, director: directorPrincipal, productora, tipo 
    };

    try {
      if (editId) {
        await updateMedia(editId, payload);
        Alert.alert('Éxito', 'Media actualizada');
      } else {
        await createMedia(payload);
        Alert.alert('Éxito', 'Media creada');
      }
      cargarTodosLosDatos();
      limpiarFormulario();
    } catch (error: any) {
      console.log("Error detallado:", error.response?.data || error.message);
      Alert.alert('Error', JSON.stringify(error.response?.data) || 'Fallo al guardar');
    }
  };

  const handleEdit = (media: any) => {
    setSerial(media.serial || ''); setTitulo(media.titulo || '');
    setSinopsis(media.sinopsis || ''); setUrlPelicula(media.urlPelicula || '');
    setImagen(media.imagenPortada || media.imagen || ''); setAnioEstreno(media.anioEstreno?.toString() || '');
    setGeneroPrincipal(media.genero?._id || media.genero || '');
    setDirectorPrincipal(media.director?._id || media.director || '');
    setProductora(media.productora?._id || media.productora || '');
    setTipo(media.tipo?._id || media.tipo || '');
    setEditId(media._id);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirmación', '¿Eliminar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          try { await deleteMedia(id); cargarTodosLosDatos(); if (editId === id) limpiarFormulario(); } 
          catch (error) { Alert.alert('Error', 'No se pudo eliminar'); }
        }
      }
    ]);
  };

  const limpiarFormulario = () => {
    setSerial(''); setTitulo(''); setSinopsis(''); setUrlPelicula('');
    setImagen(''); setAnioEstreno(''); setGeneroPrincipal('');
    setDirectorPrincipal(''); setProductora(''); setTipo(''); setEditId(null);
  };

  const directoresActivos = directores.filter(d => d.estado?.toLowerCase() === 'activo');
  const generosActivos = generos.filter(g => g.estado?.toLowerCase() === 'activo');
  const productorasActivas = productoras.filter(p => p.estado?.toLowerCase() === 'activo');

  const formularioJSX = (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{editId ? 'Editar Media' : 'Crear Nueva Producción'}</Text>
      
      <TextInput style={styles.input} placeholder="Serial (Único)" value={serial} onChangeText={setSerial} />
      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Sinopsis" value={sinopsis} onChangeText={setSinopsis} />
      <TextInput style={styles.input} placeholder="URL de la película" value={urlPelicula} onChangeText={setUrlPelicula} />
      <TextInput style={styles.input} placeholder="URL de Imagen de portada" value={imagen} onChangeText={setImagen} />
      <TextInput style={styles.input} placeholder="Año de estreno" value={anioEstreno} onChangeText={setAnioEstreno} keyboardType="numeric" />

      <Text style={styles.label}>Director (Solo activos):</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={directorPrincipal} onValueChange={setDirectorPrincipal}>
          <Picker.Item label="Seleccione un director..." value="" />
          {directoresActivos.map((dir) => <Picker.Item key={dir._id} label={dir.nombres} value={dir._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Género (Solo activos):</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={generoPrincipal} onValueChange={setGeneroPrincipal}>
          <Picker.Item label="Seleccione un género..." value="" />
          {generosActivos.map((gen) => <Picker.Item key={gen._id} label={gen.nombre} value={gen._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Productora (Solo activas):</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={productora} onValueChange={setProductora}>
          <Picker.Item label="Seleccione una productora..." value="" />
          {productorasActivas.map((prod) => <Picker.Item key={prod._id} label={prod.nombre} value={prod._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={tipo} onValueChange={setTipo}>
          <Picker.Item label="Seleccione un tipo..." value="" />
          {tipos.map((t) => <Picker.Item key={t._id} label={t.nombre} value={t._id} />)}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnGuardar} onPress={handleSubmit}>
          <Text style={styles.textoBoton}>{editId ? 'Actualizar' : 'Guardar'}</Text>
        </TouchableOpacity>
        {editId && (
          <TouchableOpacity style={styles.btnCancelar} onPress={limpiarFormulario}>
            <Text style={styles.textoBoton}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <Text style={styles.header}>Catálogo de Media</Text>
        <FlatList
          data={medias} keyExtractor={(item) => item._id} ListHeaderComponent={formularioJSX}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.tituloTarjeta}>{item.titulo} ({item.anioEstreno || 'S/N'})</Text>
              <Text style={styles.cuerpoTarjeta}>{item.sinopsis}</Text>
              <View style={styles.botonesTarjeta}>
                <TouchableOpacity style={styles.btnEditarPequeno} onPress={() => handleEdit(item)}>
                  <Text style={styles.textoBotonPequeno}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnBorrar} onPress={() => handleDelete(item._id)}>
                  <Text style={styles.textoBotonPequeno}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 15, paddingTop: 40 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 5, marginBottom: 5 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff', overflow: 'hidden' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnGuardar: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnCancelar: { backgroundColor: '#6c757d', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
  tarjeta: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  tituloTarjeta: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 5 },
  cuerpoTarjeta: { fontSize: 14, color: '#555', marginBottom: 5 },
  botonesTarjeta: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  btnEditarPequeno: { backgroundColor: '#ffc107', padding: 8, borderRadius: 5, marginRight: 8 },
  btnBorrar: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5 },
  textoBotonPequeno: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de Media</Text>
      <Text style={styles.subtitle}>Panel de Administración</Text>
      <Text style={styles.texto}>Selecciona un módulo en la barra inferior para comenzar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f8', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007bff', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#333', marginBottom: 20 },
  texto: { fontSize: 14, color: '#666', textAlign: 'center' }
});
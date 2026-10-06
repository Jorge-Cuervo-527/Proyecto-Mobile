import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="directores"
        options={{
          title: 'Directores',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="generos"
        options={{
          title: 'Géneros',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="productoras"
        options={{
          title: 'Productoras',
          tabBarIcon: ({ color }) => <Ionicons name="business" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tipos"
        options={{
          title: 'Tipos',
          tabBarIcon: ({ color }) => <Ionicons name="pricetag" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Películas',
          tabBarIcon: ({ color }) => <Ionicons name="film" size={28} color={color} />,
        }}
      />
      
      {/* Ocultamos pestañas extra que Expo pudiera buscar */}
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}
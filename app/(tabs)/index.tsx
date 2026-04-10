import { useEffect, useState } from 'react';
import { View, Text, FlatList, useColorScheme, Image } from 'react-native';
import { getPlatos, Plato } from '../../services/api';

export default function HomeScreen() {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    getPlatos()
      .then((data) => {
        console.log('Platos recibidos:', data);
        setPlatos(data);
      })
      .catch((err) => {
        console.error('Error trayendo platos:', err);
        setError('No se pudieron cargar los platos');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 10, color: isDark ? 'white' : 'black' }}>Platos</Text>

      <FlatList
        data={platos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Image source={{ uri: item.imagenUrl }} style={{ width: 100, height: 100, borderRadius: 8 }} />
            <Text style={{ color: isDark ? 'white' : 'black' }}>{item.nombre}</Text>
            <Text style={{ color: isDark ? 'white' : 'black' }}>{item.descripcion}</Text>
            <Text style={{ color: isDark ? 'white' : 'black' }}>${item.precio}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: isDark ? 'white' : 'black' }}>No hay platos</Text>}
      />
    </View>
  );
}
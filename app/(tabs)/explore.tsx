import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getPlatos, Plato } from '../../services/api';

const PAGE_SIZE = 12;
const ORANGE_MID = '#FF7A00';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const sourceRef = useRef<Plato[]>([]);
  const [items, setItems] = useState<Plato[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const loadingLock = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setInitialLoading(true);
    setError('');
    getPlatos()
      .then((data) => {
        if (cancelled) return;
        sourceRef.current = data;
        const first = data.slice(0, PAGE_SIZE);
        setItems(first);
        setHasMore(first.length < data.length);
      })
      .catch((err) => {
        console.error('Error trayendo platos:', err);
        if (!cancelled) setError('No se pudieron cargar los platos');
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(() => {
    if (loadingLock.current || !hasMore || initialLoading) return;
    const source = sourceRef.current;
    if (source.length === 0) return;

    loadingLock.current = true;
    setLoadingMore(true);

    setTimeout(() => {
      setItems((prev) => {
        const nextStart = prev.length;
        const remaining = source.length - nextStart;
        if (remaining <= 0) {
          setHasMore(false);
          return prev;
        }
        const take = Math.min(PAGE_SIZE, remaining);
        const next = source.slice(nextStart, nextStart + take);
        if (nextStart + take >= source.length) {
          setHasMore(false);
        }
        return [...prev, ...next];
      });
      setLoadingMore(false);
      loadingLock.current = false;
    }, 0);
  }, [hasMore, initialLoading]);

  const renderItem: ListRenderItem<Plato> = useCallback(({ item }) => {
    return (
      <View style={[styles.card, !item.disponible && styles.cardDisabled]}>
        <Image
          source={{ uri: item.imagenUrl }}
          style={styles.cardThumb}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {item.descripcion}
          </Text>
          <Text style={styles.cardPrice}>${item.precio}</Text>
        </View>
      </View>
    );
  }, []);

  const listHeader = (
    <View style={styles.header}>
      <Text style={styles.title}>Explorar Platos</Text>
      <Text style={styles.hint}>
        Para ir probando vamos a cargar de a  {PAGE_SIZE} de lo que se trae de getPlatos del API, pero después lo corregimos según el opptimo que acordemos.
      </Text>
    </View>
  );

  const listFooter =
    loadingMore && hasMore ? (
      <ActivityIndicator style={styles.footerSpinner} color={ORANGE_MID} />
    ) : !hasMore && items.length > 0 ? (
      <Text style={styles.endText}>No hay más platos</Text>
    ) : null;

  if (initialLoading) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={ORANGE_MID} />
        <Text style={styles.loadingText}>Cargando menú…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top, paddingHorizontal: 24 }]}>
        <StatusBar style="dark" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryBtn}
          onPress={() => {
            setError('');
            setInitialLoading(true);
            getPlatos()
              .then((data) => {
                sourceRef.current = data;
                const first = data.slice(0, PAGE_SIZE);
                setItems(first);
                setHasMore(first.length < data.length);
              })
              .catch((err) => {
                console.error('Error trayendo platos:', err);
                setError('No se pudieron cargar los platos');
              })
              .finally(() => setInitialLoading(false));
          }}>
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay platos en el menú</Text>}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  header: {
    paddingVertical: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2D1810',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5C4033',
    opacity: 0.9,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(45,24,16,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: 'rgba(255,122,0,0.2)',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1810',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#5C4033',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: ORANGE_MID,
    marginTop: 6,
  },
  footerSpinner: {
    paddingVertical: 20,
  },
  endText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
    color: '#8E8E93',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5C4033',
  },
  errorText: {
    fontSize: 16,
    color: '#5C4033',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: ORANGE_MID,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 15,
    color: '#8E8E93',
  },
});

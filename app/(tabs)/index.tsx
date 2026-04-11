import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORANGE_DEEP = '#E85D04';
const ORANGE_MID = '#FF7A00';
const ORANGE_LIGHT = '#FF9E2C';
const CREAM = '#FFF8F0';
const TEXT_DARK = '#2D1810';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const onPrimary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onSecondary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[ORANGE_LIGHT, ORANGE_MID, ORANGE_DEEP]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View pointerEvents="none" style={[styles.decorCircle, styles.decorCircleTop]} />
      <View pointerEvents="none" style={[styles.decorCircle, styles.decorCircleBottom]} />

      <View style={[styles.logoWrap, { paddingTop: insets.top + 12 }]}>
        <Image
          source={require('@/assets/images/eating-time-logo.png')}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="EatingTime"
        />
      </View>

      <View style={styles.hero}>
        <View style={styles.badge}>
          <Ionicons name="bicycle" size={18} color={ORANGE_MID} />
          <Text style={styles.badgeText}>Envío a domicilio</Text>
        </View>

        <Text style={styles.subtitle}>
          Explorá los mejores platos y degustalos al instante en tu casa.
        </Text>

        <View style={styles.heroIcons}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="restaurant" size={28} color="#fff" />
          </View>
          <View style={styles.heroIconWrap}>
            <Ionicons name="fast-food" size={28} color="#fff" />
          </View>
          <View style={styles.heroIconWrap}>
            <Ionicons name="home" size={28} color="#fff" />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.sheet,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 12,
          },
        ]}>
        <View style={styles.sheetHandle} />

        <Pressable
          style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
          onPress={onPrimary}>
          <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnPressed]}
          onPress={onSecondary}>
          <Text style={styles.btnSecondaryText}>Crear cuenta</Text>
        </Pressable>

        <Pressable style={styles.linkMuted}>
          <Text style={styles.linkMutedText}>Continuar sin cuenta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ORANGE_DEEP,
  },
  decorCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  decorCircleTop: {
    top: -80,
    right: -60,
  },
  decorCircleBottom: {
    bottom: '38%',
    left: -100,
  },
  logoWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  logo: {
    width: 220,
    height: 72,
  },
  hero: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: ORANGE_MID,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.92)',
    maxWidth: 340,
  },
  heroIcons: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 28,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  sheet: {
    backgroundColor: CREAM,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(45,24,16,0.15)',
    marginBottom: 20,
  },
  btnPrimary: {
    backgroundColor: ORANGE_MID,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: ORANGE_MID,
  },
  btnSecondaryText: {
    color: ORANGE_MID,
    fontSize: 17,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  linkMuted: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  linkMutedText: {
    fontSize: 15,
    color: TEXT_DARK,
    opacity: 0.55,
    fontWeight: '500',
  },
});

import { View, Button, Alert } from 'react-native';
import { registerPushToken } from '@/services/notifications';
import { API_URL } from '@/services/api';

const API_BASE_URL = API_URL;
const TEST_USER_ID = 4;

export default function TestPushScreen() {
  const handleRegisterToken = async () => {
    try {
      const token = await registerPushToken(TEST_USER_ID);
      console.log('Token registrado:', token);
      Alert.alert('OK', `Token registrado:\n${token}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar el token');
    }
  };

  const handleSendTestPush = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/test-push/${TEST_USER_ID}`);
      const text = await response.text();
      console.log('Respuesta test-push:', text);
      Alert.alert('Respuesta backend', text);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo ejecutar el test-push');
    }
  };

  return (
    <View style={{ marginTop: 80, gap: 16, padding: 20 }}>
      <Button title="1. Registrar token" onPress={handleRegisterToken} />
      <Button title="2. Enviar push de prueba" onPress={handleSendTestPush} />
    </View>
  );
}
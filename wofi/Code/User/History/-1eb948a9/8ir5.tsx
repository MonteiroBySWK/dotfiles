import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../presentation/screens/HomeScreen';
import PaymentMethodScreen from '../presentation/screens/PaymentMethodScreen';
import PaymentProcessingScreen from '../presentation/screens/PaymentProcessingScreen';
import ProductSelectionScreen from '../presentation/screens/ProductSelectionScreen';
import SuccessScreen from '../presentation/screens/SuccessScreen';

export type RootStackParamList = {
  Home: undefined;
  Products: undefined;
  PaymentMethod: { productId: string } | undefined;
  Processing: { productId: string; method: 'pix' | 'credito' | 'debito' };
  Success: { productName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductSelectionScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="Processing" component={PaymentProcessingScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { OrderProvider } from './presentation/hooks/useOrder';

export default function App() {
  return (
    <NavigationContainer>
      <OrderProvider>
        <AppNavigator />
      </OrderProvider>
    </NavigationContainer>
  );
}

import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home';
import FavoriteItems from './components/FavoriteItems';
import ArtToolItem from './components/ArtToolItem';

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={Home}
        options={() => ({
          headerShown: true, // Show header on the HomePage
        })}
      />
      <Stack.Screen
        name="ArtToolItemDetail"
        component={ArtToolItem}
        options={() => ({
          headerShown: false, // Hide header on the detail page
        })}
      />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      <PaperProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Favorite') {
                iconName = 'heart';
              }
              return <Entypo name={iconName} size={30} color={color} />;
            },
            tabBarActiveTintColor: '#FF842F', // Màu khi tab được chọn
            tabBarInactiveTintColor: '#808080', // Màu khi tab không được chọn
          })}
          initialRouteName="Home"
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ headerShown: false }} 
          />
          <Tab.Screen name="Favorite" component={FavoriteItems} />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
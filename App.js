import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./components/Home";
import FavoriteItems from "./components/FavoriteItems";
import ArtToolItem from "./components/ArtToolItem";

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Home Page"
        component={Home}
        options={() => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: "#DD803F",
          },
          headerTintColor: "#fff",
        })}
      />
      <Stack.Screen
        name="ArtToolItemDetail"
        component={ArtToolItem}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );

  const FavoriteStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorite Items"
        component={FavoriteItems}
        options={() => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: "#DD803F",
          },
          headerTintColor: "#fff",
        })}
      />

      <Stack.Screen
        name="ArtToolItemDetail"
        component={ArtToolItem}
        options={() => ({
          headerShown: false,
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
              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Favorite") {
                iconName = "heart";
              }
              return <Entypo name={iconName} size={30} color={color} />;
            },
            tabBarActiveTintColor: "#DD803F",
            tabBarInactiveTintColor: "gray",
            unmountOnBlur: true,
          })}
          initialRouteName="Home"
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Favorite"
            component={FavoriteStack}
            options={{
              title: "Favorite Items",
              headerStyle: {
                backgroundColor: "#DD803F",
              },
              headerTintColor: "#fff",
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

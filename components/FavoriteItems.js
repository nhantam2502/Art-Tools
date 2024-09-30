import React from 'react'
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper'; // React Native Paper theme

const FavoriteItems = () => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Favorite Screen</Text>
    </View>
  )
}

export default FavoriteItems;
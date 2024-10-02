import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Home = ({ navigation }) => {
  const [artTools, setArtTools] = useState([]);

  const getItem = async () => {
    try {
      const response = await fetch('https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item');
      const json = await response.json();
      setArtTools(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <FlatList
      data={artTools}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('ArtToolItemDetail', { item })}
          style={styles.pressable}
        >
          <Card style={styles.card}>

            <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />

            <Card.Content>
              <Text variant="titleMedium" style={styles.artName}>
                {item.artName}
              </Text>

              <View style={styles.priceContainer}>
                <Text variant="bodyMedium">${item.price}</Text>

                <View style={styles.saleContainer}>
                  <MaterialCommunityIcons name="sale" size={16} color="#F48E48" />
                  <Text variant="bodyMedium" style={styles.saleText}>
                    {item.limitedTimeDeal}
                  </Text>
                </View>

                <Pressable onPress={() => toggleFavorite(item.id)}>
                  <MaterialCommunityIcons
                    name={item.isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={item.isFavorite ? 'red' : 'gray'}
                  />
                </Pressable>
              </View>
            </Card.Content>
          </Card>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    paddingHorizontal: 10,
  },
  pressable: {
    flex: 1,
    margin: 5,
  },
  card: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
  },
  cardImage: {
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  artName: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleText: {
    marginLeft: 3,
    color: '#F48E48',
  },
  favoriteAndDealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Home;
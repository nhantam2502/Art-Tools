import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import ArtToolItem from './ArtToolItem';

const Home = ({ navigation }) => {
  const [artTools, setArtTools] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const getItem = async () => {
    try {
      const response = await fetch('https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item');
      const json = await response.json();
      console.log("Data fetch: ", json)
      setArtTools(json); 
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <FlatList
      data={artTools}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.id}</Text>
          <Text>{item.artName}</Text>
        </View>
      )}
    />
  );
};

export default Home;

// const handleFavorite = (item) => {
//   if (favorites.includes(item.id)) {
//     setFavorites(favorites.filter(fav => fav !== item.id));
//   } else {
//     setFavorites([...favorites, item.id]);
//   }
// };
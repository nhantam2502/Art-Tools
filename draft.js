import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import ArtToolItem from './ArtToolItem';

const Home = ({ navigation }) => {
  const [artTools, setArtTools] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const getItem = async () => {
    try {
      const response = await fetch('https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item');
      const json = await response.json();
      console.log("Data fetch: ", json)

      if (Array.isArray(json)) {
        setArtTools(json); // Set data if it's an array
      } else if (json && typeof json === 'object') {
        setArtTools([json]); // Convert to an array if it's an object
      } else {
        setArtTools([]); // Set an empty array if the response is neither an array nor an object
      }
    } catch (error) {
      console.error("Loi fetch: ", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <FlatList
      data={artTools}
      keyExtractor={item => item.id.toString()}
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
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import ArtToolItem from './ArtToolItem';

const Home = ({ navigation }) => {
  const [artTools, setArtTools] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const getItem = async () => {
    try {
      const response = await fetch('https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/ite');
      const json = await response.json();
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
        <ArtToolItem
          item={item}
          isFavorite={favorites.includes(item.id)}
          onPress={() => navigation.navigate('ArtToolItem', { item })}
        />
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
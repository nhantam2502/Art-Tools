import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favoriteItem, setFavoriteItem] = useState({});

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("favoriteItem");
        if (jsonValue) {
          setFavoriteItem(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error("Error loading favorite items:", error);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (id) => {
    const updatedFavorites = {
      ...favoriteItem,
      [id]: !favoriteItem[id], 
    };

    setFavoriteItem(updatedFavorites);
    await AsyncStorage.setItem("favoriteItem", JSON.stringify(updatedFavorites));
  };

  return (
    <FavoriteContext.Provider value={{ favoriteItem, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

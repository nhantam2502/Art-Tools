// FavoriteItemsContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a context
export const FavoriteItemsContext = createContext();

// Create a provider component
export const FavoriteItemsProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);

  const getFavoriteItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("favoriteItem");
      if (jsonValue) {
        const favorite = JSON.parse(jsonValue);
        const favoriteID = Object.keys(favorite).filter((key) => favorite[key]);
        
        // Fetch all art tools data from the API
        const response = await fetch("https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item");
        const allItems = await response.json();
        
        // Filter the full items based on favorite IDs
        const filteredFavoriteItems = allItems.filter(item => favoriteID.includes(item.id));
        setFavoriteItems(filteredFavoriteItems);
      }
    } catch (error) {
      console.error("Error loading favorite items:", error);
    }
  };

  useEffect(() => {
    getFavoriteItems();
    const intervalId = setInterval(() => {
        getFavoriteItems(); // Gọi lại hàm này mỗi giây để kiểm tra thay đổi
      }, 1000); // Tùy chỉnh thời gian theo nhu cầu
    
      return () => clearInterval(intervalId); // Dọn dẹp khoảng thời gian khi component bị hủy
  }, []);

  return (
    <FavoriteItemsContext.Provider value={{ favoriteItems, setFavoriteItems }}>
      {children}
    </FavoriteItemsContext.Provider>
  );
};
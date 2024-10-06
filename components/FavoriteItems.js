import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Text } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const FavoriteItems = ({ navigation }) => {
  const [favoriteItem, setFavoriteItem] = useState([]);

  const getFavoriteItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("favoriteItem");
      if (jsonValue) {
        const favorite = JSON.parse(jsonValue);
        const favoriteID = Object.keys(favorite).filter((key) => favorite[key]);

        // Fetch all art tools data from the API
        const response = await fetch(
          "https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item"
        );
        const allItems = await response.json();

        // Filter the full items based on favorite IDs
        const filteredFavoriteItems = allItems.filter((item) =>
          favoriteID.includes(item.id)
        );
        setFavoriteItem(filteredFavoriteItems);
      }
    } catch (error) {
      console.error("Error loading favorite items:", error);
    }
  };

  useEffect(() => {
    getFavoriteItems();
    const intervalId = setInterval(() => {
      getFavoriteItems();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("ArtToolItemDetail", { item })} // Navigate when product is pressed
            style={styles.pressable}
          >
            <Card style={styles.card}>
              <Card.Cover
                source={{ uri: item.image }} // Display image
                style={styles.cardImage}
              />
              <Card.Content>
                <Text variant="bodyLarge" style={styles.artName}>
                  {item.artName} {/* Display product name */}
                </Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.artPrice}>${item.price}</Text>

                  {item.limitedTimeDeal > 0 && (
                    <View style={styles.saleContainer}>
                      <MaterialCommunityIcons
                        name="sale"
                        size={16}
                        color="#F48E48"
                      />
                      <Text variant="bodyMedium" style={styles.saleText}>
                        {Math.round(item.limitedTimeDeal * 100)}
                      </Text>
                    </View>
                  )}

                  <Pressable onPress={() => toggleFavorite(item.id)}>
                    <MaterialCommunityIcons
                      name={favoriteItem[item.id] ? "heart" : "heart-outline"}
                      size={24}
                      color={favoriteItem[item.id] ? "red" : "gray"}
                    />
                  </Pressable>
                </View>
              </Card.Content>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
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
    fontWeight: "bold",
    marginVertical: 5,
  },
  artPrice: {
    color: "#F48E48",
    fontWeight: "bold",
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  saleText: {
    marginLeft: 3,
    color: "#F48E48",
    fontSize: 16,
  },
});

export default FavoriteItems;

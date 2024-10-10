import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Checkbox, Text } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const FavoriteItems = ({ navigation }) => {
  const [favoriteItem, setFavoriteItem] = useState([]);
  const [favoriteState, setFavoriteState] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFavor, setSelectedFavor] = useState({});

  const fetchFavorArtTool = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("favoriteItem");

      if (jsonValue) {
        const favorite = JSON.parse(jsonValue);
        const favoriteID = Object.keys(favorite).filter((key) => favorite[key]);

        const response = await fetch(
          "https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item"
        );
        const allItems = await response.json();

        const filteredFavoriteItem = allItems.filter((item) =>
          favoriteID.includes(item.id)
        );
        setFavoriteItem(filteredFavoriteItem);
        setFavoriteState(favorite);
      }
    } catch (error) {
      console.error("Error loading favorite items:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorArtTool();
    }, [])
  );

  const toggleFavorite = async (itemID) => {
    const updatedFavorites = {
      ...favoriteState,
      [itemID]: !favoriteState[itemID],
    };

    setFavoriteState(updatedFavorites);

    await AsyncStorage.setItem(
      "favoriteItem",
      JSON.stringify(updatedFavorites)
    );
  };

  const toggleSelectFavorite = (itemID) => {
    setSelectedFavor((prev) => ({
      ...prev,
      [itemID]: !prev[itemID],
    }));
  };

  const selectAllItems = () => {
    const updatedSelection = favoriteItem.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
    setSelectedFavor(updatedSelection);
  };

  const deleteSelectedFavor = async () => {
    const updatedFavorites = { ...favoriteState };

    Object.keys(selectedFavor).forEach((itemID) => {
      if (selectedFavor[itemID]) {
        delete updatedFavorites[itemID];
      }
    });

    await AsyncStorage.setItem(
      "favoriteItem",
      JSON.stringify(updatedFavorites)
    );
    setFavoriteState(updatedFavorites);
    setSelectedFavor({});
    fetchFavorArtTool();
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm to delete",
      "Are you sure you want to delete the selected products?",
      [
        { text: "Cancle", style: "cancel" },
        { text: "Delete", onPress: deleteSelectedFavor },
      ]
    );
  };

  const clearSelectedItems = () => {
    setSelectedFavor({});
  };

  const renderFooter = () => {
    return <Text style={styles.noMoreText}>No more product</Text>;
  };

  const calculatePrice = (price, limitedTimeDeal) => {
    return (price - (price * limitedTimeDeal) / 100).toFixed(2);
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    fetchFavorArtTool();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#F48E48" />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.selectAllButton} onPress={selectAllItems}>
              <Text style={styles.selectAllButtonText}>Select All</Text>
            </Pressable>

            <Pressable
              style={styles.clearButton}
              onPress={clearSelectedItems}
              disabled={
                Object.values(selectedFavor).filter(Boolean).length === 0
              }
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={confirmDelete}
              disabled={
                Object.values(selectedFavor).filter(Boolean).length === 0
              }
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>

          <FlatList
            data={favoriteItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl loading={loading} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("ArtToolItemDetail", { item })
                }
                style={styles.pressable}
              >
                <Card style={styles.card}>
                  <Checkbox
                    status={selectedFavor[item.id] ? "checked" : "unchecked"}
                    onPress={() => toggleSelectFavorite(item.id)}
                    color={selectedFavor[item.id] ? "#F48E48" : "gray"} 
                  />

                  <Card.Cover
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                  />
                  <Card.Content>
                    <Text variant="bodyLarge" style={styles.artName}>
                      {item.artName}
                    </Text>

                    <View style={styles.priceContainer}>
                      <Text style={styles.artPrice}>
                        $${calculatePrice(item.price, item.limitedTimeDeal)}
                      </Text>

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
                          name={
                            favoriteState[item.id] ? "heart" : "heart-outline"
                          }
                          size={24}
                          color={favoriteState[item.id] ? "red" : "gray"}
                        />
                      </Pressable>
                    </View>
                  </Card.Content>
                </Card>
              </Pressable>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
  },
  pressable: {
    marginVertical: 10,
    flex: 1,
    margin: 5,
    maxWidth: "50%",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
  noMoreText: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
  },
  deleteButton: {
    width: 90,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    marginRight: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  selectAllButton: {
    width: 90,
    backgroundColor: "#F48E48",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    marginRight: 5,
  },
  selectAllButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  clearButton: {
    width: 90,
    marginRight: 5,
    backgroundColor: "gray",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  clearButtonText: {
    color: "#fff", // Màu chữ
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default FavoriteItems;

import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  FlatList,
  Pressable,
  View,
  StyleSheet,
  Button,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, Card, Searchbar, Text } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [artTools, setArtTools] = useState([]);
  const [filteredArtTools, setFilteredArtTools] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [favoriteItem, setFavoriteItem] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const getItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item"
      );

      const json = await response.json();
      setArtTools(json);
      setFilteredArtTools(json);

      const artToolBrand = [...new Set(json.map((item) => item.brand))];
      setBrands(artToolBrand);
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favoriteItem");
      if (favorites) {
        setFavoriteItem(JSON.parse(favorites));
      }
    } catch (error) {
      console.error("Error loading favorite items:", error);
    }
  };

  const saveFavoriteItem = async (items) => {
    try {
      const jsonValue = JSON.stringify(items);
      await AsyncStorage.setItem("favoriteItem", jsonValue);
    } catch (error) {
      console.error("Error saving favorite items:", error);
    }
  };

  const toggleFavorite = async (id) => {
    const updatedFavorites = {
      ...favoriteItem,
      [id]: !favoriteItem[id],
    };

    setFavoriteItem(updatedFavorites);
    await saveFavoriteItem(updatedFavorites);
  };

  const filterByBrand = (brand) => {
    if (brand === selectedBrand) {
      setSelectedBrand(null);
      setFilteredArtTools(artTools);
    } else {
      setSelectedBrand(brand);
      const filtered = artTools.filter((item) => item.brand === brand);
      setFilteredArtTools(filtered);
    }
  };

  const filterBySearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = artTools.filter((item) =>
        item.artName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArtTools(filtered);
    } else {
      setFilteredArtTools(artTools);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    getItem();
    loadFavorites();
  }, []);

  const renderFooter = () => {
    return <Text style={styles.noMoreText}>No more product</Text>;
  };

  const calculatePrice = (price, limitedTimeDeal) => {
    return (price - (price * limitedTimeDeal) / 100).toFixed(2);
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    getItem();
    loadFavorites();

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
          <View style={styles.filterContainer}>
            {brands.map((brand) => (
              <Button
                key={brand}
                title={brand}
                onPress={() => filterByBrand(brand)}
                color={selectedBrand === brand ? "#F48E48" : "#ccc"}
              />
            ))}
          </View>

          <Searchbar
            placeholder="Search"
            onChangeText={filterBySearch}
            value={searchQuery}
            style={styles.searchBar}
          />

          <FlatList
            data={filteredArtTools}
            keyExtractor={(item) => item.id}
            numColumns={2}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl loading={loading} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("ArtToolItemDetail", {
                    item,
                    favoriteItem,
                  })
                }
                style={styles.pressable}
              >
                <Card style={styles.card}>
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
                        ${calculatePrice(item.price, item.limitedTimeDeal)}
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
                            favoriteItem[item.id] ? "heart" : "heart-outline"
                          }
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 5,
  },
  searchBar: {
    backgroundColor: "#fff",
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 5,
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
});

export default Home;

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Card, IconButton, Text, Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feedback from "./Feedback";

const ArtToolDetail = ({ route, navigation }) => {
  const { item } = route.params;
  const [favoriteItem, setFavoriteItem] = useState(false);
  const [loading, setLoading] = useState(false);

  const feedbacks = [
    { id: 1, rating: 5, username: "nhantam2502", comment: "Amazing tool!" },
    {
      id: 2,
      rating: 4,
      username: "minhhoang123",
      comment: "Very good, but can be improved.",
    },
    {
      id: 3,
      rating: 3,
      username: "linhtran99",
      comment: "Average experience.",
    },
    {
      id: 4,
      rating: 5,
      username: "ducanh85",
      comment: "Excellent quality and performance!",
    },
    {
      id: 5,
      rating: 2,
      username: "ngocanh100",
      comment: "Not what I expected.",
    },
    {
      id: 6,
      rating: 4,
      username: "quanghuy88",
      comment: "Great value for the price.",
    },
    {
      id: 8,
      rating: 3,
      username: "phuongthao111",
      comment: "It’s okay, nothing special.",
    },
    {
      id: 10,
      rating: 1,
      username: "vananh222",
      comment: "Very disappointing experience.",
    },
  ];

  const loadFavorStatus = async () => {
    try {
      setLoading(true);
      const favorite = await AsyncStorage.getItem("favoriteItem");
      const parsedFavorite = favorite ? JSON.parse(favorite) : {};

      setFavoriteItem(parsedFavorite[item.id] || false);
    } catch (error) {
      console.error("Error loading favorite status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorStatus();
  }, [item.id]);

  const toggleFavorite = async () => {
    try {
      const favorite = await AsyncStorage.getItem("favoriteItem");
      const parsedFavorite = favorite ? JSON.parse(favorite) : {};

      const updatedFavorites = {
        ...parsedFavorite,
        [item.id]: !favoriteItem,
      };

      await AsyncStorage.setItem(
        "favoriteItem",
        JSON.stringify(updatedFavorites)
      );

      setFavoriteItem(!favoriteItem);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const calculatePrice = (price, limitedTimeDeal) => {
    return (price - (price * limitedTimeDeal) / 100).toFixed(2);
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    loadFavorStatus();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F48E48" />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.headerTitle}>Art Tool Details</Text>
            <IconButton
              icon={favoriteItem ? "heart" : "heart-outline"}
              size={24}
              onPress={toggleFavorite}
              color={favoriteItem ? "red" : "gray"}
            />
          </View>

          <Card style={styles.imageCard}>
            <Card.Cover source={{ uri: item.image }} style={styles.mainImage} />
          </Card>

          <View style={styles.infoContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.brand}>Brand: {item.brand}</Text>
              <View style={styles.sale}>
                <Text style={styles.saleText}>
                  Limited Time Deal: {Math.round(item.limitedTimeDeal * 100)}
                </Text>
                <MaterialCommunityIcons name="sale" size={24} color="#F48E48" />
              </View>
            </View>

            <View style={styles.titleContainer}>
              <Text variant="titleLarge" style={styles.artName}>
                {item.artName}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.originPriceContainer}>
              <Text variant="labelMedium" style={styles.originPrice}>
                ${item.price}
              </Text>
            </View>

            <View style={styles.priceGlassRow}>
              <Text variant="titleLarge" style={styles.salePrice}>
                ${calculatePrice(item.price, item.limitedTimeDeal)}
              </Text>

              {item.glassSurface ? (
                <View style={styles.glassSurfaceContainer}>
                  <MaterialCommunityIcons
                    name="check-decagram-outline"
                    size={24}
                    color="green"
                    marginLeft={1}
                  />
                  <Text style={styles.glassSurfaceText}>Glass Surface</Text>
                </View>
              ) : (
                <View style={styles.noGlassSurfaceContainer}>
                  <MaterialCommunityIcons
                    name="alert-decagram"
                    size={24}
                    color="#FF2400"
                    marginLeft={1}
                  />
                  <Text style={styles.noGlassSurfaceText}>
                    No Glass Surface
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buyButtonContainer}>
            <Button
              mode="contained"
              onPress={() => console.log("Pressed")}
              contentStyle={styles.buyButtonContent}
              labelStyle={styles.buyButtonLabel}
              icon={() => (
                <MaterialCommunityIcons
                  name="shopping"
                  size={20}
                  color="white"
                />
              )}
            >
              Buy Now
            </Button>
          </View>
          <Feedback feedbacks={feedbacks} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageCard: {
    marginVertical: 10,
  },
  mainImage: {
    height: 300,
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  brand: {
    fontSize: 15,
    color: "#FE954D",
  },
  titleContainer: {
    marginVertical: 5,
  },
  artName: {
    fontWeight: "bold",
    flexShrink: 1,
  },
  sale: {
    flexDirection: "row",
    alignItems: "center",
  },
  saleText: {
    marginRight: 3,
    fontSize: 15,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    color: "#666",
  },
  originPriceContainer: {
    marginTop: 10,
  },
  originPrice: {
    textDecorationLine: "line-through",
    fontSize: 16,
    color: "red",
  },
  priceGlassRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  salePrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginRight: 20,
  },
  glassSurfaceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    borderWidth: 2,
    borderColor: "green",
  },
  glassSurfaceText: {
    fontSize: 15,
    color: "green",
    marginLeft: 2,
    marginRight: 2,
  },
  noGlassSurfaceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    borderWidth: 2,
    borderColor: "#FF2400",
  },
  noGlassSurfaceText: {
    fontSize: 15,
    color: "#FF2400",
    marginLeft: 2,
    marginRight: 2,
  },
  buyButtonContainer: {
    marginTop: 10,
  },
  buyButtonContent: {
    paddingVertical: 3,
    backgroundColor: "#FE954D",
  },
  buyButtonLabel: {
    fontSize: 16,
    color: "white",
  },
  price: {
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
  },
});

export default ArtToolDetail;

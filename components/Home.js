import React, { useState, useEffect } from "react";
import { FlatList, Pressable, View, StyleSheet, Button } from "react-native";
import { Card, Text } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [artTools, setArtTools] = useState([]);
  const [filteredArtTools, setFilteredArtTools] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [favoriteItem, setFavoriteItem] = useState({});

  // Hàm lấy danh sách sản phẩm
  const getItem = async () => {
    try {
      const response = await fetch(
        "https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item"
      );
      const json = await response.json();
      setArtTools(json);
      setFilteredArtTools(json); // Hiển thị tất cả ban đầu

      // Tạo danh sách các brand từ dữ liệu artTools
      const artToolBrand = [...new Set(json.map((item) => item.brand))];
      setBrands(artToolBrand);
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm tải danh sách sản phẩm yêu thích từ AsyncStorage
  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favoriteItem');
      if (favorites) {
        setFavoriteItem(JSON.parse(favorites));
      }
    } catch (error) {
      console.error('Error loading favorite items:', error);
    }
  };

  // Sử dụng useEffect để lấy dữ liệu ban đầu
  useEffect(() => {
    getItem();
    loadFavorites(); 
  }, []);

  // Lọc sản phẩm theo brand được chọn
  const filterByBrand = (brand) => {
    if (brand === selectedBrand) {
      setSelectedBrand(null); // Xóa bộ lọc nếu brand đã được chọn
      setFilteredArtTools(artTools); // Hiển thị tất cả sản phẩm
    } else {
      setSelectedBrand(brand); // Đặt brand đã chọn
      const filtered = artTools.filter((item) => item.brand === brand);
      setFilteredArtTools(filtered);
    }
  };

  // Hàm lưu sản phẩm yêu thích vào AsyncStorage
  const saveFavoriteItem = async (items) => {
    try {
      await AsyncStorage.setItem('favoriteItem', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving favorite items:', error);
    }
  };

  // Cập nhật hàm toggleFavorite
  const toggleFavorite = async (id) => {
    const updatedFavorites = {
      ...favoriteItem,
      [id]: !favoriteItem[id], // Đảo ngược trạng thái yêu thích
    };

    setFavoriteItem(updatedFavorites); // Cập nhật trạng thái yêu thích trong state
    await saveFavoriteItem(updatedFavorites); // Lưu vào AsyncStorage
  };

  // Hàm render footer cho FlatList
  const renderFooter = () => {
    return (
      <Text style={styles.noMoreText}>No more product</Text>
    );
  };

  return (
    <View style={styles.container}>
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

      <FlatList
        data={filteredArtTools}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("ArtToolItemDetail", { item })}
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
        ListFooterComponent={renderFooter} // Thêm component footer
      />
    </View>
  );
};

// Các style cho component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 5,
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
  noMoreText: { 
    textAlign: "center",
    fontSize: 18,
    color: "#999",
    marginVertical: 10,
  },
});

export default Home;
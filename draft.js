import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, View, StyleSheet, Button } from 'react-native';
import { Card, Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Home = ({ navigation }) => {
  const [artTools, setArtTools] = useState([]);
  const [filteredArtTools, setFilteredArtTools] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const getItem = async () => {
    try {
      const response = await fetch('https://66e99bdc87e41760944a27ed.mockapi.io/api/artTools/item');
      const json = await response.json();
      setArtTools(json);
      // Tạo danh sách các brand từ dữ liệu artTools
      const uniqueBrands = [...new Set(json.map(item => item.brand))];
      setBrands(uniqueBrands);
      setFilteredArtTools(json); // Hiển thị tất cả ban đầu
    } catch (error) {
      console.error(error);
    }
  };

  const filterByBrand = (brand) => {
    if (brand === selectedBrand) {
      setSelectedBrand(null);
      setFilteredArtTools(artTools); // Hiển thị tất cả nếu brand đã được chọn
    } else {
      setSelectedBrand(brand);
      const filtered = artTools.filter(item => item.brand === brand);
      setFilteredArtTools(filtered);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {brands.map(brand => (
          <Button
            key={brand}
            title={brand}
            onPress={() => filterByBrand(brand)}
            color={selectedBrand === brand ? '#F48E48' : '#ccc'}
          />
        ))}
      </View>

      <FlatList
        data={filteredArtTools}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ArtToolItemDetail', { item })}
            style={styles.pressable}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
              <Card.Content>
                <Text variant="titleMedium" style={styles.artName}>
                  {item.artName}
                </Text>
                <View style={styles.priceContainer}>
                  <Text variant="bodyMedium">${item.price}</Text>
                  <View style={styles.saleContainer}>
                    <MaterialCommunityIcons name="sale" size={16} color="#F48E48" />
                    <Text variant="bodyMedium" style={styles.saleText}>
                      {item.limitedTimeDeal}
                    </Text>
                  </View>
                  <Pressable onPress={() => toggleFavorite(item.id)}>
                    <MaterialCommunityIcons
                      name={item.isFavorite ? 'heart' : 'heart-outline'}
                      size={24}
                      color={item.isFavorite ? 'red' : 'gray'}
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
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  columnWrapper: {
    paddingHorizontal: 10,
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
    fontWeight: 'bold',
    marginVertical: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleText: {
    marginLeft: 3,
    color: '#F48E48',
  },
  favoriteAndDealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Home;
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, IconButton, Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

const ArtToolDetail = ({ route, navigation }) => {
    const { item } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Art Tool Details</Text>
                <IconButton icon="heart-outline" size={24} onPress={() => { }} />
            </View>

            {/* Main Product Image */}
            <Card style={styles.imageCard}>
                <Card.Cover source={{ uri: item.image }} style={styles.mainImage} />
            </Card>

            {/* Product Information */}
            <View style={styles.infoContainer}>

                <View style={styles.rowContainer}>
                    <Text style={styles.brand}>Brand: {item.brand}</Text>
                    <View style={styles.sale}>
                        <Text style={styles.saleText}>Limited Time Deal: {item.limitedTimeDeal}</Text>
                        <MaterialCommunityIcons name="sale" size={24} color="#F48E48" />
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text variant="titleLarge" style={styles.title}>{item.artName}</Text>
                </View>

                <Text style={styles.sectionTitle}>Product Details</Text>
                <Text style={styles.description}>{item.description}</Text>

                <Text variant="titleLarge" style={styles.price}>Price: ${item.price}</Text>
            </View>

            <View style={styles.buyButtonContainer}>
                <Button
                    mode="contained"
                    onPress={() => console.log('Pressed')}
                    contentStyle={styles.buyButtonContent}
                    labelStyle={styles.buyButtonLabel}
                    icon={() => (
                        <MaterialCommunityIcons
                            name="shopping" // Tên icon
                            size={20} // Kích thước của icon
                            color="white" // Màu của icon (nếu muốn)
                        />
                    )}
                >
                    Buy Now
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    brand: {
        fontSize: 15,
        color: '#FE954D',
    },
    titleContainer: {
        marginVertical: 5,
    },
    title: {
        fontWeight: 'bold',
        flexShrink: 1,
    },
    sale: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saleText: {
        marginRight: 5,
        fontSize: 15,
        color: '#666',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        color: '#666',
    },
    buyButtonContainer: {
        marginTop: 20,
    },
    buyButtonContent: {
        paddingVertical: 3,
        backgroundColor: '#FE954D',
    },
    buyButtonLabel: {
        fontSize: 16,
        color: 'white',
    },
    price: {
        fontWeight: 'bold',
        color: '#000', 
        marginTop: 8, 
    }
});

export default ArtToolDetail;
// components/ArtToolItem.js
import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

const ArtToolItem = ({ item, isFavorite,onPress }) => {
    return (
        <Card onPress={onPress} style={{ marginVertical: 10 }}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Card.Cover source={{ uri: item.imageUrl }} style={{ width: 80, height: 80 }} />
                
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text variant="titleMedium">{item.artName}</Text>
                    <Text variant="bodyMedium">${item.price}</Text>
                    {item.limitedTimeDeal && (
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>
                            {item.limitedTimeDeal}% Off!
                        </Text>
                    )}
                </View>

                <IconButton
                    icon={isFavorite ? 'heart' : 'heart-outline'}
                    color={isFavorite ? 'red' : 'gray'}
                    size={24}
                    // onPress={onFavorite}
                />
            </Card.Content>
        </Card>
    );
};

export default ArtToolItem;
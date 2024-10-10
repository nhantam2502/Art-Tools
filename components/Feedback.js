import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Text, Button, IconButton } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Feedback = ({ feedbacks }) => {
  const [selectedRating, setSelectedRating] = useState(null);

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;

    const totalRating = feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );
    return (totalRating / feedbacks.length).toFixed(1);
  };
  const averageRating = calculateAverageRating();

  const filterFeedbacks = () => {
    if (selectedRating) {
      return feedbacks.filter((feedback) => feedback.rating === selectedRating);
    }
    return feedbacks;
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Feedbacks
      </Text>

      <View style={styles.averageRatingContainer}>
        <Text style={styles.averageRatingText}>
          Average Rating: {averageRating}
        </Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <MaterialCommunityIcons
              key={index}
              name={index < averageRating ? "star" : "star-outline"}
              size={24}
              color={index < averageRating ? "#F48E48" : "#ccc"}
            />
          ))}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <IconButton
          icon="filter-remove"
          onPress={() => setSelectedRating(null)}
          style={styles.clearFilterButton}
        />
        <ScrollView horizontal>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              mode={selectedRating === rating ? "contained" : "outlined"}
              onPress={() => setSelectedRating(rating)}
              style={styles.filterButton}
            >
              {rating} Stars
            </Button>
          ))}
        </ScrollView>
      </View>

      <ScrollView>
        {filterFeedbacks().map((feedback) => (
          <Card key={feedback.id} style={styles.card}>
            <Card.Title
              title={
                <View style={styles.titleContainer}>
                  <Text style={styles.user}>{feedback.username}</Text>
                  <View style={styles.starsContainer}>
                    {[...Array(5)].map((_, index) => (
                      <MaterialCommunityIcons
                        key={index}
                        name={index < feedback.rating ? "star" : "star-outline"}
                        size={24}
                        color={index < feedback.rating ? "#F48E48" : "#ccc"}
                      />
                    ))}
                  </View>
                </View>
              }
            />
            <Card.Content>
              <Text>{feedback.comment}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  averageRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#DD803F",
    borderRadius: 8,
  },
  averageRatingText: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    margin: 4,
  },
  clearFilterButton: {
    marginLeft: 8,
  },
  card: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  user: {
    marginRight: 8,
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
  },
});

export default Feedback;

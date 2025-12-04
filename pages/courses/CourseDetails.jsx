import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Fonts, FontSizes, FontWeights } from "../../theme";

export function CourseDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.medium,
    color: Colors.foreground,
  },
});

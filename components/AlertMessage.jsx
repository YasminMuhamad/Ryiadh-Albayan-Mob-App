// components/AlertMessage.jsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function AlertMessage({ message, type = "success", duration = 3000, onClose }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto close after duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (onClose) onClose();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const backgroundColor =
    type === "success" ? "#16a34a" :
    type === "error" ? "#ef4444" :
    "#fbbf24"; // warning

  return (
    <Animated.View style={[styles.container, { backgroundColor, opacity: fadeAnim }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    zIndex: 999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: "#FFFDF8",
    fontWeight: "600",
    textAlign: "center",
  },
});

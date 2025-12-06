// components/RNButton.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function RNButton({ children, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        disabled ? styles.disabled : null,
        style ? style : null,
      ]}
    >
      <View style={{ alignItems: "center" }}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabled: { opacity: 0.6 },
});

import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function RNButton({ children, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled ? styles.disabled : null, style]}
    >
      {typeof children === "string" ? 
        <Text style={styles.btnText}>{children}</Text>
       : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#FFFDF8",
    fontWeight: "600",
    fontSize: 16,
  },
  disabled: { opacity: 0.6 },
});

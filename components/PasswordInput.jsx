// components/PasswordInput.jsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";

export default function PasswordInput({ value, onChangeText, placeholder, style, onBlur }) {
  const [secure, setSecure] = useState(true);
  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={styles.input}
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onBlur={onBlur}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => setSecure((s) => !s)} style={styles.toggle}>
        <Text>{secure ? "Show" : "Hide"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: "row", alignItems: "center", borderWidth: 0 },
  input: { flex: 1, paddingVertical: 10 },
  toggle: { paddingHorizontal: 10, paddingVertical: 6 },
});

import React, { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChatWidget() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  return (
    <Pressable onPress={() => navigation.navigate('Chat')} style={styles.floatingButton}>
      <Text style={styles.text}>💬</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0E7C7B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: { fontSize: 24, color: '#fff' },
});

import React from 'react';
import { View, Text } from 'react-native';

export const About = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--background)' }}>
      <Text style={{ fontSize: 24, fontWeight: '500' }}>
        About Page
      </Text>
    </View>
  );
};

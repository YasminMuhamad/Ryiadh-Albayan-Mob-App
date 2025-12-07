import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useNotifications } from '../context/NotificationsContext';

export const NotificationIcon = ({ navigation }) => {
  const { unreadCount } = useNotifications();

  return (
    <Pressable onPress={() => navigation.navigate('Notifications')} style={{ marginRight: 16 }}>
      <Feather name="bell" size={24} color="#fff" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});

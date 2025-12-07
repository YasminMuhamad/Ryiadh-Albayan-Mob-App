import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNotifications } from '../../context/NotificationsContext';
import { markNotificationsAsRead, addNotification } from '../../services/notificationService';
import { Colors } from '../../theme';

export default function NotificationsScreen({ navigation }) {
  const { notifications, setNotifications, loading } = useNotifications();

  const handleMarkAsRead = async (id) => {
    await markNotificationsAsRead([id]);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyText}>No notifications</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={[styles.notifCard, !item.read && styles.unread]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
          <Pressable onPress={() => handleMarkAsRead(item.id)} style={styles.markReadButton}>
            <Text style={styles.markReadText}>✓</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  notifCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unread: { borderLeftWidth: 4, borderLeftColor: Colors.primary },
  title: { fontWeight: 'bold', marginBottom: 4, color: Colors.cardForeground },
  message: { color: Colors.mutedForeground },

  markReadButton: {
    marginLeft: 12,
    padding: 6,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markReadText: { color: Colors.primaryForeground, fontWeight: 'bold', fontSize: 16 },

  emptyText: { fontSize: 16, color: Colors.mutedForeground },
  loadingText: { fontSize: 14, color: Colors.mutedForeground, marginTop: 8 },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  closeText: { color: Colors.primaryForeground, fontWeight: 'bold', fontSize: 25 },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { queryCourse } from '../../services/chatService';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    // Scroll to bottom on new message
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await queryCourse(input);

      if (!response) {
        setMessages((prev) => [...prev, { type: 'bot', text: 'Sorry, no suitable course found.' }]);
      } else {
        // Add bot course card
        setMessages((prev) => [
          ...prev,
          {
            type: 'course',
            title: response.title,
            description: response.description,
            thumbnail: response.thumbnail || response.image,
            price: response.price,
            studentsCount: response.studentsCount,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Something went wrong while fetching the course.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === 'user') {
      return (
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{item.text}</Text>
        </View>
      );
    }
    if (item.type === 'bot') {
      return (
        <View style={styles.botBubble}>
          <Text style={styles.botText}>{item.text}</Text>
        </View>
      );
    }
    if (item.type === 'course') {
      return (
        <View style={styles.courseCard}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseDesc}>{item.description}</Text>
          <Text style={styles.courseInfo}>
            {item.studentsCount || 0} students | ${item.price || 0}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
      />

      {loading && <ActivityIndicator size="large" color="#0E7C7B" style={{ marginBottom: 10 }} />}

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          style={styles.input}
          onSubmitEditing={sendMessage}
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9f6' },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0E7C7B',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  userText: { color: '#fff' },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9d8a6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  botText: { color: '#1b1b1b' },
  courseCard: {
    backgroundColor: '#fffdf8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: { width: '100%', height: 120, borderRadius: 8, marginBottom: 6 },
  courseTitle: { fontWeight: 'bold', fontSize: 16 },
  courseDesc: { fontSize: 12, color: '#6b6b6b', marginBottom: 4 },
  courseInfo: { fontSize: 12, color: '#1b1b1b' },
  inputContainer: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#ccc', padding: 8 },
  input: { flex: 1, padding: 10, backgroundColor: '#fffdf8', borderRadius: 10 },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#0E7C7B',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sendText: { color: '#fff' },
});

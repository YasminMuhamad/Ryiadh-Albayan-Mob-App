import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function ContactScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.message) {
      setSuccessMsg('❗ Please fill all required fields.');
      setTimeout(() => setSuccessMsg(''), 2000);
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'messages'), {
        ...formData,
        timestamp: serverTimestamp(),
      });

      setSuccessMsg('✅ Your message has been sent!');

      // clear form
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      console.error(err);
      setSuccessMsg('❌ Something went wrong, please try again.');
      setTimeout(() => setSuccessMsg(''), 2000);
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>

      {successMsg ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Send us a message</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(t) => handleChange('fullName', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={formData.email}
          keyboardType="email-address"
          onChangeText={(t) => handleChange('email', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={formData.subject}
          onChangeText={(t) => handleChange('subject', t)}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Message"
          value={formData.message}
          multiline
          onChangeText={(t) => handleChange('message', t)}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Message</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FAFAFA' },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F7F7F7',
  },

  button: {
    backgroundColor: '#6c63ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },

  successBox: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  successText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

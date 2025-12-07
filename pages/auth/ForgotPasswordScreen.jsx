// screens/Auth/ForgotPasswordScreen.jsx
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { auth, db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const emailLower = String(email || "").trim().toLowerCase();
    if (!emailLower) {
      Alert.alert("خطأ", "البريد الإلكتروني مطلوب.");
      return;
    }

    try {
      setLoading(true);

      // Check only 'users' collection (student-only app)
      const usersQuery = query(collection(db, "users"), where("email", "==", emailLower));
      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.empty) {
        Alert.alert("غير موجود", "لا يوجد حساب مرتبط بهذا البريد.");
        return;
      }

      await sendPasswordResetEmail(auth, emailLower);
      Alert.alert("تم", "أرسلنا رابط إعادة التعيين إلى بريدك الإلكتروني. اتبعي التعليمات في الإيميل.");
      // optional navigate back to Login
      navigation.navigate("Login");
    } catch (err) {
      console.error("ForgotPassword error:", err);
      Alert.alert("خطأ", err?.message || "حدث خطأ. حاولي لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: null })} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="your.email@example.com"
          style={styles.input}
        />

        <TouchableOpacity style={[styles.btn, loading && styles.disabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#fff" },
  card: { backgroundColor: "#fff", padding: 18, borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#6b7280", marginBottom: 12 },
  label: { marginTop: 8, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#d1d5db", padding: 10, borderRadius: 6 },
  btn: { marginTop: 14, backgroundColor: "#2563eb", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
  disabled: { opacity: 0.6 },
});

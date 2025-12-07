// screens/Auth/ForgotPasswordScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import Feather from "@expo/vector-icons/Feather";
import RNButton from "../../components/RNButton";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const emailLower = String(email || "").trim().toLowerCase();
    setError("");
    setSuccess("");

    if (!emailLower) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      setError("Invalid email format");
      return;
    }

    try {
      setLoading(true);

      const usersQuery = query(collection(db, "users"), where("email", "==", emailLower));
      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.empty) {
        setError("No account found with this email");
        return;
      }

      await sendPasswordResetEmail(auth, emailLower);
      setSuccess("Reset link sent! Check your email.");
    } catch (err) {
      console.error("ForgotPassword error:", err);
      setError(err?.message || "Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.circle}>
            <Feather name="book-open" size={24} color="#0E7C7B" />
          </View>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to reset your password</Text>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError("");
            setSuccess("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="your.email@example.com"
          style={[styles.input, error ? styles.inputError : null]}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <RNButton
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.btnPrimary, { marginTop: 12 }, loading && { opacity: 0.6 }]}
        >
          {loading ? <ActivityIndicator color="#FFFDF8" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
        </RNButton>


        <TouchableOpacity
          style={{ marginTop: 12, alignItems: "center" }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: { alignItems: "center", marginBottom: 16 },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6EFEB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "600", color: "#0E7C7B", marginBottom: 4 },
  subtitle: { color: "#6B6B6B", textAlign: "center" },
  label: { marginTop: 10, marginBottom: 6, fontWeight: "500", color: "#1B1B1B" },
  input: {
    borderWidth: 1,
    borderColor: "#DBE9E5",
    backgroundColor: "#FFFDF8",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    color: "#1B1B1B",
  },
  inputError: { borderColor: "#D4183D", borderWidth: 2 },
  errorText: { color: "#D4183D", marginTop: 6, marginBottom: -6, fontSize: 14 },
  successText: { color: "#16a34a", marginTop: 6, marginBottom: -6, fontSize: 14 },
  btnText: { color: "#FFFDF8", fontWeight: "600", fontSize: 16 },
  link: { color: "#0E7C7B", fontWeight: "600" },
  btnPrimary: {
    backgroundColor: "#0E7C7B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#FFFDF8",
    fontWeight: "600",
    fontSize: 16,
  },
});

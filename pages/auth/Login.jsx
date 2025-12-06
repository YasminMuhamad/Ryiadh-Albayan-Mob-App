// screens/Auth/LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import RNButton from "../../components/RNButton";
import PasswordInput from "../../components/PasswordInput";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", pass: "" });

  const { login } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const from = route.params?.from; // pass route params if you need redirect

  const validateField = (name, value) => {
    let message = "";
    switch (name) {
      case "email":
        if (!value || !value.trim()) message = "Email is required";
        else if (!emailRegex.test(value.trim())) message = "Invalid email format";
        break;
      case "pass":
        if (!value || !value.trim()) message = "Password is required";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleLogin = async () => {
    if (loading) return;
    if (!validateField("email", email) || !validateField("pass", pass)) return;

    try {
      setLoading(true);
      const res = await login(email.trim().toLowerCase(), pass); // { uid, role: "student", profile }
      // role is always student in RN version
      Alert.alert("Success", "Student login successful");
      // decide where to navigate: from param or default screen name
      const target = typeof from === "string" ? from : "StudentProfile";
      navigation.reset({
        index: 0,
        routes: [{ name: target }],
      });
    } catch (err) {
      console.error("Login failed:", err);
      Alert.alert("Login failed", "Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: null })}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📚</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="your.email@example.com"
          value={email}
          onBlur={() => validateField("email", email)}
          onChangeText={(v) => {
            setEmail(v);
            validateField("email", v);
          }}
          style={[styles.input, errors.email ? styles.inputError : null]}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <PasswordInput
          placeholder="Enter your password"
          value={pass}
          onBlur={() => validateField("pass", pass)}
          onChangeText={(v) => setPass(v)}
          style={[styles.input, errors.pass ? styles.inputError : null]}
        />
        {errors.pass ? <Text style={styles.errorText}>{errors.pass}</Text> : null}

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>

        <RNButton onPress={handleLogin} disabled={loading} style={{ marginTop: 12 }}>
          {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>Sign In</Text>}
        </RNButton>

        <View style={styles.footer}>
          <Text style={styles.small}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Sign up here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#ffffff" },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 18, elevation: 2 },
  header: { alignItems: "center", marginBottom: 12 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: { color: "#fff", fontSize: 22 },
  title: { fontSize: 18, fontWeight: "600" },
  subtitle: { color: "#6b7280", marginTop: 4 },
  label: { marginTop: 8, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
  },
  inputError: { borderColor: "#ef4444", borderWidth: 2 },
  errorText: { color: "#ef4444", marginTop: 6, marginBottom: -6 },
  forgot: { textAlign: "right", color: "#2563eb", marginTop: 10, marginBottom: 4 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  small: { color: "#374151" },
  link: { color: "#2563eb", fontWeight: "600" },
  btnText: { color: "#fff", fontWeight: "600" },
});

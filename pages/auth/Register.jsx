// screens/Auth/RegisterScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import RNButton from "../../components/RNButton";
import PasswordInput from "../../components/PasswordInput";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errors, setErrors] = useState({ fullname: "", email: "", pass: "", confirmPass: "" });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigation = useNavigation();

  const validateField = (name, value) => {
    let message = "";
    switch (name) {
      case "fullname":
        if (!value.trim()) message = "Full name is required";
        break;
      case "email":
        if (!value.trim()) message = "Email is required";
        else if (!emailRegex.test(value.trim())) message = "Invalid email format";
        break;
      case "pass":
        if (!value.trim()) message = "Password is required";
        break;
      case "confirmPass":
        if (value !== pass) message = "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleRegister = async () => {
    if (loading) return;
    let hasError = false;
    if (!validateField("fullname", fullname)) hasError = true;
    if (!validateField("email", email)) hasError = true;
    if (!validateField("pass", pass)) hasError = true;
    if (!validateField("confirmPass", confirmPass)) hasError = true;
    if (hasError) return;

    setLoading(true);
    try {
      await register(fullname, email.trim().toLowerCase(), pass); // role fixed to student in context
      Alert.alert("Success", "Account created successfully!");
      navigation.reset({
        index: 0,
        routes: [{ name: "StudentProfile" }],
      });
    } catch (err) {
      console.error("Registration failed:", err);
      const code = err?.code || "";
      switch (code) {
        case "auth/email-already-in-use":
          Alert.alert("Error", "This email is already registered. Try logging in.");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "Invalid email format");
          break;
        case "auth/weak-password":
          Alert.alert("Error", "Password must be at least 6 characters");
          break;
        default:
          Alert.alert("Error", "Registration failed. Please try again.");
      }
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
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join the learning platform now!</Text>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          value={fullname}
          onChangeText={(v) => setFullname(v)}
          onBlur={() => validateField("fullname", fullname)}
          style={[styles.input, errors.fullname ? styles.inputError : null]}
        />
        {errors.fullname ? <Text style={styles.errorText}>{errors.fullname}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="your.email@example.com"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            validateField("email", v);
          }}
          onBlur={() => validateField("email", email)}
          style={[styles.input, errors.email ? styles.inputError : null]}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <PasswordInput
          placeholder="Enter your password"
          value={pass}
          onChangeText={(v) => {
            setPass(v);
            validateField("pass", v);
            if (confirmPass) validateField("confirmPass", confirmPass);
          }}
          onBlur={() => validateField("pass", pass)}
          style={[styles.input, errors.pass ? styles.inputError : null]}
        />
        {errors.pass ? <Text style={styles.errorText}>{errors.pass}</Text> : null}

        <Text style={styles.label}>Confirm Password</Text>
        <PasswordInput
          placeholder="Confirm your password"
          value={confirmPass}
          onChangeText={(v) => {
            setConfirmPass(v);
            validateField("confirmPass", v);
          }}
          onBlur={() => validateField("confirmPass", confirmPass)}
          style={[styles.input, errors.confirmPass ? styles.inputError : null]}
        />
        {errors.confirmPass ? <Text style={styles.errorText}>{errors.confirmPass}</Text> : null}

        <RNButton onPress={handleRegister} disabled={loading} style={{ marginTop: 12 }}>
          {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>Sign Up</Text>}
        </RNButton>

        <View style={styles.footer}>
          <Text style={styles.small}>Already have an account? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>Sign in here</Text>
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
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  small: { color: "#374151" },
  link: { color: "#2563eb", fontWeight: "600" },
  btnText: { color: "#fff", fontWeight: "600" },
});

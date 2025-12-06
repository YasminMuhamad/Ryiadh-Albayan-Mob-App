// screens/Auth/RegisterScreen.jsx
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
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import RNButton from "../../components/RNButton";
import PasswordInput from "../../components/PasswordInput";
import Feather from "@expo/vector-icons/Feather";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

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
        else if (!passwordRegex.test(value))
          message = "Password must be 6+ chars, include uppercase, lowercase, number, and symbol";
        break;
      case "confirmPass":
        if (!value.trim()) message = "Please confirm your password";
        else if (value !== pass) message = "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleRegister = async () => {
    if (loading) return;

    const isFullnameValid = validateField("fullname", fullname);
    const isEmailValid = validateField("email", email);
    const isPassValid = validateField("pass", pass);
    const isConfirmPassValid = validateField("confirmPass", confirmPass);

    if (!isFullnameValid || !isEmailValid || !isPassValid || !isConfirmPassValid) return;

    setLoading(true);
    try {
      await register(fullname, email.trim().toLowerCase(), pass);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "App",
              state: { index: 0, routes: [{ name: "StudentProfile" }] },
            },
          ],
        })
      );
    } catch (err) {
      console.error("Registration failed:", err);
      const code = err?.code || "";
      switch (code) {
        case "auth/email-already-in-use":
          setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
          break;
        case "auth/invalid-email":
          setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
          break;
        case "auth/weak-password":
          setErrors((prev) => ({
            ...prev,
            pass: "Password must be at least 6 characters with uppercase, lowercase, number, and symbol",
          }));
          break;
        default:
          setErrors((prev) => ({ ...prev, fullname: "Registration failed. Please try again." }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.circle}>
            <Feather name="book-open" size={24} color="#0E7C7B" />
          </View>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join the learning platform now!</Text>
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          value={fullname}
          onChangeText={setFullname}
          onBlur={() => validateField("fullname", fullname)}
          style={[styles.input, errors.fullname ? styles.inputError : null]}
        />
        {errors.fullname && <Text style={styles.errorText}>{errors.fullname}</Text>}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            validateField("email", v);
          }}
          onBlur={() => validateField("email", email)}
          style={[styles.input, errors.email ? styles.inputError : null]}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
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
        {errors.pass && <Text style={styles.errorText}>{errors.pass}</Text>}

        {/* Confirm Password */}
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
        {errors.confirmPass && <Text style={styles.errorText}>{errors.confirmPass}</Text>}

        {/* Sign Up Button */}
        <RNButton
          onPress={handleRegister}
          disabled={loading}
          style={[styles.btnPrimary, { marginTop: 12 }, loading && { opacity: 0.6 }]}
        >
          {loading ? <ActivityIndicator color="#FFFDF8" /> : <Text style={styles.btnText}>Sign Up</Text>}
        </RNButton>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.small}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Sign in here</Text>
          </TouchableOpacity>
        </View>
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
  btnText: { color: "#FFFDF8", fontWeight: "600", fontSize: 16 },
  btnPrimary: {
    backgroundColor: "#0E7C7B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  link: { color: "#0E7C7B", fontWeight: "600" },
  small: { color: "#1B1B1B" },
});

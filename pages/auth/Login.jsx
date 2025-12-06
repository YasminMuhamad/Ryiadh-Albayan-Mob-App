// screens/Auth/LoginScreen.jsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import RNButton from "../../components/RNButton";
import PasswordInput from "../../components/PasswordInput";
import Feather from '@expo/vector-icons/Feather';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [errors, setErrors] = useState({ email: "", pass: "", general: "" });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    const validateField = (name, value) => {
        let message = "";
        switch (name) {
            case "email":
                if (!value.trim()) message = "Email is required";
                else if (!emailRegex.test(value.trim())) message = "Invalid email format";
                break;
            case "pass":
                if (!value.trim()) message = "Password is required";
                else if (value.length < 6) message = "Password must be at least 6 characters";
                break;
        }
        setErrors(prev => ({ ...prev, [name]: message }));
        return message === "";
    };

    const validateAllFields = () => {
        return validateField("email", email) && validateField("pass", pass);
    };

    const handleLogin = async () => {
        if (loading) return;
        setErrors(prev => ({ ...prev, general: "" }));

        if (!validateAllFields()) return;

        try {
            setLoading(true);
            await login(email.trim().toLowerCase(), pass);

            const target = route.params?.from || "StudentProfile";
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: target === "StudentProfile"
                        ? [{ name: "App", state: { index: 0, routes: [{ name: "StudentProfile" }] } }]
                        : [{ name: "App" }],
                })
            );
        } catch (err) {
            console.error("Login failed:", err);
            let message = "Email or password is incorrect";
            if (err?.message?.includes("not found")) message = "Student account not found";
            setErrors(prev => ({ ...prev, general: message }));
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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
                </View>

                {/* Email Field */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#6B6B6B"
                    value={email}
                    onBlur={() => validateField("email", email)}
                    onChangeText={(v) => {
                        setEmail(v);
                        validateField("email", v);
                        setErrors(prev => ({ ...prev, general: "" }));
                    }}
                    style={[styles.input, errors.email ? styles.inputError : null]}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                {/* Password Field */}
                <Text style={styles.label}>Password</Text>
                <PasswordInput
                    placeholder="Enter your password"
                    value={pass}
                    onBlur={() => validateField("pass", pass)}
                    onChangeText={(v) => {
                        setPass(v);
                        validateField("pass", v);
                        setErrors(prev => ({ ...prev, general: "" }));
                    }}
                    style={[styles.input, errors.pass ? styles.inputError : null]}
                />
                {errors.pass ? <Text style={styles.errorText}>{errors.pass}</Text> : null}

                {/* General Error */}
                {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

                {/* Forgot Password */}
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>

                <RNButton
                    onPress={handleLogin}
                    disabled={loading}
                    style={[
                        styles.btnPrimary,
                        { marginTop: 12 },
                        loading && { opacity: 0.6 }, // تأثير شبه hover / disabled
                    ]}
                >
                    {loading ? <ActivityIndicator color="#FFFDF8" /> : <Text style={styles.btnText}>Sign In</Text>}
                </RNButton>

                {/* Footer */}
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
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    circle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E6EFEB",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#0E7C7B",
        marginBottom: 4,
    },
    subtitle: {
        color: "#6B6B6B",
        textAlign: "center",
    },
    label: {
        marginTop: 10,
        marginBottom: 6,
        fontWeight: "500",
        color: "#1B1B1B",
    },
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
    inputError: {
        borderColor: "#D4183D",
        borderWidth: 2,
    },
    errorText: {
        color: "#D4183D",
        marginTop: 6,
        marginBottom: -6,
        fontSize: 14,
    },
    forgot: {
        textAlign: "right",
        color: "#0E7C7B",
        marginTop: 10,
        marginBottom: 4,
    },
    btnText: {
        color: "#FFFDF8",
        fontWeight: "600",
        fontSize: 16,
    },
    btnPrimary: {
        backgroundColor: "#0E7C7B", // نفس var(--primary)
        paddingVertical: 8,          // يعادل 0.5rem
        paddingHorizontal: 16,       // يعادل 1rem
        borderRadius: 20,            // نفس --radius
        borderWidth: 0,
        alignItems: "center",
        justifyContent: "center",
    }, btnSecondary: {
        backgroundColor: "#FAF9F6",  // var(--background)
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#DBE9E5",
        alignItems: "center",
        justifyContent: "center",
    },
    btnTextPrimary: {
        color: "#FFFDF8",
        fontWeight: "600",
        fontSize: 16,
    },
    btnTextSecondary: {
        color: "#1B1B1B",
        fontWeight: "600",
        fontSize: 16,
    },
    disabled: {
        opacity: 0.6,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 12,
    },
    link: {
        color: "#0E7C7B",
        fontWeight: "600",
    },
    small: {
        color: "#1B1B1B",
    },
});

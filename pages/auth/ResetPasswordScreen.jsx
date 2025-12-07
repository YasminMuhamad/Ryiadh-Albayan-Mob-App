// screens/Auth/ResetPasswordScreen.jsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function ResetPasswordScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const paramCode = route.params?.oobCode ?? null;
  const [oobCode, setOobCode] = useState(paramCode || "");
  const [emailFromCode, setEmailFromCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If we have a code (from deep link), try to verify and get the email for UX
  useEffect(() => {
    const tryVerify = async () => {
      if (!oobCode) return;
      try {
        const auth = getAuth();
        const email = await verifyPasswordResetCode(auth, oobCode);
        setEmailFromCode(email);
      } catch (err) {
        console.warn("Invalid oobCode:", err);
        // keep user able to enter code manually
      }
    };
    tryVerify();
  }, [oobCode]);

  const handleReset = async () => {
    if (!oobCode) {
      Alert.alert("خطأ", "كود إعادة التعيين مطلوب. افتحي الرابط من الإيميل أو الصقي الكود هنا.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("خطأ", "أدخل كلمة مرور جديدة لا تقل عن 6 أحرف.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("خطأ", "كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      // تأكيد الكود + تعيين كلمة المرور الجديدة
      await confirmPasswordReset(auth, oobCode, newPassword);
      Alert.alert("تم", "تم تحديث كلمة المرور بنجاح. سجلي الدخول الآن.");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (err) {
      console.error("Reset error:", err);
      Alert.alert("خطأ", err?.message || "فشل إعادة تعيين كلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: null })} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {emailFromCode ? `Resetting password for ${emailFromCode}` : "Open the link from your email or paste the code below."}
        </Text>

        {!paramCode && (
          <>
            <Text style={styles.label}>Reset Code (oobCode)</Text>
            <TextInput value={oobCode} onChangeText={setOobCode} placeholder="Paste the code from email" style={styles.input} />
          </>
        )}

        <Text style={styles.label}>New Password</Text>
        <TextInput secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="New password" style={styles.input} />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" style={styles.input} />

        <TouchableOpacity style={[styles.btn, loading && styles.disabled]} onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Reset Password</Text>}
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

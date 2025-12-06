// src/pages/Student/StudentProfile.jsx
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator, Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../../context/AuthContext";
import { db, auth } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { format, isValid, parseISO } from "date-fns";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigation } from "@react-navigation/native";
import RNButton from "../../components/RNButton";
import AlertMessage from "components/AlertMessage";

export default function StudentProfile() {
  const { profile, uid } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigation = useNavigation();

  const toDate = (val) => {
    if (!val) return null;
    if (val instanceof Date && isValid(val)) return val;
    try {
      const parsed = typeof val === "string" ? parseISO(val) : new Date(val);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const [form, setForm] = useState({
    name: profile?.name || "",
    name_ar: profile?.name_ar || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    birthDate: toDate(profile?.birthDate) || new Date(),
    gender: profile?.gender || "",
  });

  useEffect(() => {
    setForm({
      name: profile?.name || "",
      name_ar: profile?.name_ar || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      birthDate: toDate(profile?.birthDate) || new Date(),
      gender: profile?.gender || "",
    });
  }, [profile]);

  const handleChange = (name, value) => setForm((s) => ({ ...s, [name]: value }));

  const today = new Date();
  const maxDate = new Date(); maxDate.setFullYear(today.getFullYear() - 10);
  const minDate = new Date(); minDate.setFullYear(today.getFullYear() - 100);

  const handleSave = async () => {
    if (!form.name || form.name.trim().length < 2) {
      setAlert({ message: "Enter a valid full name.", type: "error" });
      return;
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setAlert({ message: "Enter a valid email.", type: "error" });
      return;
    }

    const age = today.getFullYear() - form.birthDate.getFullYear();
    if (age < 10 || age > 100) {
      setAlert({ message: "Age must be between 10 and 100.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", uid), {
        ...form,
        birthDate: form.birthDate ? format(form.birthDate, "yyyy-MM-dd") : "",
      });
      setEditMode(false);
      setAlert({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to update profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteDoc(doc(db, "users", uid));
      if (auth.currentUser) await deleteUser(auth.currentUser);
      setAlert({ message: "Account deleted.", type: "success" });
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }, 1000);
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to delete account. Please re-login.", type: "error" });
    }
  };

  if (!profile) return <Text>Please login</Text>;

  const genders = ["male", "female"];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: "#FAF9F6" }}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={profile.profile_pic ? { uri: profile.profile_pic } : require('../../assets/placeholder-avatar.png')}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{form.name}</Text>
            <Text style={styles.joined}>
              Joined: {profile.createdAt ? format(toDate(profile.createdAt), "yyyy-MM-dd") : "N/A"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setEditMode(!editMode)} style={{ marginLeft: "auto" }}>
            <Text style={{ color: "#0E7C7B", fontWeight: "600" }}>{editMode ? "Cancel" : "Edit"}</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View>
          {["name", "name_ar", "email", "phone"].map((field) => (
            <View key={field} style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{field === "name_ar" ? "Name (Arabic)" : field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              <TextInput
                value={form[field]}
                onChangeText={(v) => handleChange(field, v)}
                editable={editMode}
                keyboardType={field === "email" ? "email-address" : field === "phone" ? "phone-pad" : "default"}
                style={styles.input}
              />
            </View>
          ))}

          {/* Birth Date */}
          <Text style={styles.label}>Birth Date</Text>
          <TouchableOpacity
            onPress={() => editMode && setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{form.birthDate ? format(form.birthDate, "yyyy-MM-dd") : "-"}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.birthDate || maxDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={maxDate}
              minimumDate={minDate}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) handleChange("birthDate", selectedDate);
              }}
            />
          )}

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => editMode && handleChange("gender", g)}
                style={[styles.genderBtn, form.gender === g && styles.genderSelected]}
              >
                <Text style={{ color: "white" }}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {editMode && (
            <RNButton onPress={handleSave} disabled={loading} style={[styles.btnPrimary, { marginTop: 8 }]}>
              {loading ? <ActivityIndicator color="#FFFDF8" /> : <Text style={styles.btnText}>Save</Text>}
            </RNButton>
          )}
        </View>

        {/* Delete Account */}
        <RNButton
          onPress={() => setDeleteModalOpen(true)}
          style={[styles.btnDanger, { marginTop: 12 }]}
        >
          <Text style={styles.btnTextDanger}>Delete Account</Text>
        </RNButton>

        <ConfirmModal
          isVisible={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="Are you sure you want to permanently delete your account? This action cannot be undone."
          confirmText="Delete"
        />
      </View>
      {/* AlertMessage */}
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </ScrollView>
  );
}

const styles = {
  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 20, fontWeight: "600", color: "#1B1B1B" },
  joined: { color: "#6B6B6B" },
  label: { marginBottom: 4, fontWeight: "500", color: "#1B1B1B" },
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
  genderBtn: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "gray",
  },
  genderSelected: { backgroundColor: "#0E7C7B" },
  btnPrimary: {
    backgroundColor: "#0E7C7B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    backgroundColor: "#FAF9F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DBE9E5",
  },
  btnText: { color: "#FFFDF8", fontWeight: "600", fontSize: 16 },
  btnTextSecondary: { color: "#1B1B1B", fontWeight: "600", fontSize: 16 },
  btnDanger: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTextDanger: {
    color: "#FFFDF8",
    fontWeight: "600",
    fontSize: 16
  },
};

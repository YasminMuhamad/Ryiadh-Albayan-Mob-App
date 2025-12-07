import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Colors, Fonts, FontSizes, Radius } from "../../theme";
import Feather from "@expo/vector-icons/Feather";

const fallbackInstructors = [
  {
    id: "placeholder-1",
    name: "Mohammed Al-Faruq",
    title: "Senior Instructor",
    bio: "Focuses on clear delivery and structured learning paths.",
    expertise: "Islamic History, Aqeedah",
  },
  {
    id: "placeholder-2",
    name: "Fatimah Al-Najjar",
    title: "Curriculum Lead",
    bio: "Designs engaging modules and assessments for steady progress.",
    expertise: "Tafseer, Fiqh",
  },
];

export default function InstructorsScreen() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const snap = await getDocs(collection(db, "teachers"));
        const list = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data?.name_en || data?.name || "Instructor",
            title: data?.title_en || data?.title || "Instructor",
            bio: data?.bio_en || data?.bio || "Passionate about teaching and student success.",
            expertise: data?.expertise_en || data?.expertise || "Specialist",
            image: data?.image || data?.avatar || null,
          });
        });
        setInstructors(list.length ? list : fallbackInstructors);
      } catch (err) {
        console.warn("Failed to load instructors", err);
        setInstructors(fallbackInstructors);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.headerBadge}>
          <Feather name="users" size={14} color={Colors.primaryForeground} />
          <Text style={styles.headerBadgeText}>Instructors</Text>
        </View>
        <Text style={styles.headerTitle}>Meet the teaching team</Text>
        <Text style={styles.headerSubtitle}>
          Handpicked educators with clarity, structure, and real classroom experience.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.meta}>Loading instructors...</Text>
        </View>
      ) : (
        instructors.map((inst) => (
          <View key={inst.id} style={styles.card}>
            <View style={styles.avatarWrapper}>
              {inst.image ? (
                <Image source={{ uri: inst.image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>
                    {(inst.name || "I").slice(0, 1).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.name}>{inst.name}</Text>
              <Text style={styles.title}>{inst.title}</Text>
              <Text style={styles.bio}>{inst.bio}</Text>
              <View style={styles.chip}>
                <Feather name="book-open" size={14} color={Colors.primary} />
                <Text style={styles.chipText}>{inst.expertise}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  headerRow: {
    gap: 6,
    paddingBottom: 4,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  headerBadgeText: {
    fontFamily: Fonts.poppins,
    fontSize: 12,
    color: Colors.primaryForeground,
    fontWeight: "600",
  },
  headerTitle: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h2,
    color: Colors.foreground,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.muted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: Fonts.poppins,
    fontSize: 24,
    color: Colors.primary,
    fontWeight: "700",
  },
  name: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h3,
    color: Colors.foreground,
    fontWeight: "600",
  },
  title: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  bio: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.foreground,
    lineHeight: 20,
  },
  chip: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.muted,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.foreground,
  },
  meta: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  loadingBox: {
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

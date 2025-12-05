// import React from 'react';
// import { View, Text } from 'react-native';

// export const About = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--background)' }}>
//       <Text style={{ fontSize: 24, fontWeight: '500' }}>
//         About Page
//       </Text>
//     </View>
//   );
// };


import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import photo4 from "../../assets/photo4.jpg";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Us</Text>
        <Text style={styles.headerText}>
          Welcome to Riyad Al-Bayan — where Arabic and Islamic knowledge is delivered with clarity, excellence, and authenticity.
        </Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Image source={photo4} style={styles.missionImage} resizeMode="cover" />
        <View style={styles.sectionText}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionParagraph}>
            Our mission is to make Arabic and Islamic studies accessible to everyone. We provide structured, authentic, and easy-to-understand programs designed to inspire students and deepen their understanding.
          </Text>
          <Text style={styles.sectionParagraph}>
            With dedication, qualified teachers, and a passion for knowledge, we aim to build a generation connected to the language of the Qur’an and grounded in authentic Islamic principles.
          </Text>
          <View style={styles.numbersRow}>
            <View style={styles.numberBox}>
              <Text style={styles.numberValue}>500+</Text>
              <Text style={styles.numberLabel}>Students Enrolled</Text>
            </View>
            <View style={styles.numberBox}>
              <Text style={styles.numberValue}>50+</Text>
              <Text style={styles.numberLabel}>Courses</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Values Section */}
      <View style={styles.valuesSection}>
        <Text style={styles.valuesTitle}>Our Values</Text>
        <Text style={styles.valuesText}>
          These values guide us in teaching, communicating, and serving our students every day.
        </Text>

        <View style={styles.valuesGrid}>
          <View style={styles.valueCard}>
            <Text style={styles.valueCardTitle}>Excellence</Text>
            <Text style={styles.valueCardText}>
              We strive for quality and clarity in every lesson and program.
            </Text>
          </View>
          <View style={styles.valueCard}>
            <Text style={styles.valueCardTitle}>Collaboration</Text>
            <Text style={styles.valueCardText}>
              We foster teamwork and support between teachers and students.
            </Text>
          </View>
          <View style={styles.valueCard}>
            <Text style={styles.valueCardTitle}>Creativity</Text>
            <Text style={styles.valueCardText}>
              We simplify knowledge using modern, engaging teaching methods.
            </Text>
          </View>
          <View style={styles.valueCard}>
            <Text style={styles.valueCardTitle}>Integrity</Text>
            <Text style={styles.valueCardText}>
              We commit to authentic, trustworthy, and ethical teaching.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#0E7C7B", paddingVertical: 40, paddingHorizontal: 20, alignItems: "center" },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center" },
  headerText: { fontSize: 16, color: "#fff", textAlign: "center", marginTop: 10, maxWidth: 300 },

  section: { flexDirection: "column", padding: 20 },
  missionImage: { width: "100%", height: 200, borderRadius: 16, marginBottom: 20 },
  sectionText: {},
  sectionTitle: { fontSize: 24, fontWeight: "600", color: "#0E7C7B", marginBottom: 10 },
  sectionParagraph: { fontSize: 16, color: "#333", marginBottom: 10, lineHeight: 22 },
  numbersRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  numberBox: { alignItems: "center" },
  numberValue: { fontSize: 22, fontWeight: "700", color: "#0E7C7B" },
  numberLabel: { fontSize: 14, color: "#555" },

  valuesSection: { backgroundColor: "#E6EFEB", paddingVertical: 30, paddingHorizontal: 20 },
  valuesTitle: { fontSize: 22, fontWeight: "600", color: "#0E7C7B", textAlign: "center" },
  valuesText: { fontSize: 16, color: "#333", textAlign: "center", marginTop: 8, marginBottom: 20 },
  valuesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  valueCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, width: "48%", marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  valueCardTitle: { fontSize: 16, fontWeight: "600", color: "#0E7C7B", marginBottom: 5, textAlign: "center" },
  valueCardText: { fontSize: 14, color: "#555", textAlign: "center" },
});

import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { useNavigation } from "@react-navigation/native";

// استيراد الصور الافتراضية
import girl1 from "../../assets/images/girl1.avif";
import man from "../../assets/images/man.jpg";
import photo6 from "../../assets/images/photo6.jpg";

const defaultImages = [girl1, man, photo6];

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const snap = await getDocs(collection(db, "teachers"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const instructorsWithImages = data.map((teacher) => ({
          ...teacher,
          profile_pic: teacher.profile_pic || defaultImages[Math.floor(Math.random() * defaultImages.length)],
        }));

        setInstructors(instructorsWithImages);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#14B8A6" />
        <Text style={styles.loadingText}>Loading instructors ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading instructors: {error}</Text>
        <TouchableOpacity onPress={() => window.location.reload()} style={styles.retryButton}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderInstructor = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.profile_pic }}
        style={styles.image}
        defaultSource={defaultImages[0]}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.bio}>{item.bio || "Experienced instructor guiding students in their learning journey."}</Text>
        {item.specialty && <Text style={styles.specialty}>{item.specialty}</Text>}
        <Text style={styles.courses}>{item.coursesCount ? `${item.coursesCount} courses` : "No courses yet"}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("InstructorDetails", { id: item.id })}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Our Instructors</Text>
      <Text style={styles.subHeading}>Meet our experienced instructors guiding you through your learning journey</Text>

      <FlatList
        data={instructors}
        keyExtractor={(item) => item.id}
        renderItem={renderInstructor}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {instructors.length === 0 && (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: "center", color: "gray" }}>No instructors available at the moment.</Text>
        </View>
      )}
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginTop: 10 },
  subHeading: { fontSize: 14, color: "gray", textAlign: "center", marginBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "gray" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
  retryButton: { backgroundColor: "red", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
  retryText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 20, marginBottom: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  image: { width: "100%", height: screenWidth * 0.5 },
  info: { padding: 12 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  bio: { fontSize: 14, color: "gray", marginBottom: 8 },
  specialty: { backgroundColor: "#FEF3C7", color: "#000", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: "flex-start", marginBottom: 8 },
  courses: { color: "#14B8A6", fontWeight: "600", marginBottom: 12 },
  button: { backgroundColor: "#14B8A6", paddingVertical: 10, borderRadius: 25, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});

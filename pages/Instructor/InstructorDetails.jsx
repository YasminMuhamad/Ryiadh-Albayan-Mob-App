import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase.config";

// استيراد الصور الافتراضية
import girl1 from "../../assets/images/girl1.avif";
import man from "../../assets/images/man.jpg";
import photo6 from "../../assets/images/photo6.jpg";
const defaultImages = [girl1, man, photo6];

export default function InstructorDetails() {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();

  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const docSnap = await getDoc(doc(db, "teachers", id));
        if (!docSnap.exists()) throw new Error("Instructor not found");
        const data = docSnap.data();
        const profilePic =
          data.profile_pic || defaultImages[Math.floor(Math.random() * defaultImages.length)];
        setInstructor({ id: docSnap.id, ...data, profile_pic: profilePic });

        const coursesSnap = await getDocs(
          query(collection(db, "courses"), where("teacherId", "==", docSnap.id))
        );
        const coursesData = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCourses(coursesData);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#14B8A6" />
        <Text style={styles.loadingText}>Loading instructor details ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCourse = ({ item }) => (
    <View style={styles.courseCard}>
      <Image
        source={{ uri: item.thumbnail || "" }}
        style={styles.courseImage}
        defaultSource={defaultImages[0]}
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDesc}>{item.description || "No description available"}</Text>
        <Text style={styles.coursePrice}>$ {typeof item.price === "number" ? item.price : item.price || 149}</Text>
        <TouchableOpacity
          style={styles.courseButton}
          onPress={() => navigation.navigate("CourseDetails", { id: item.id })}
        >
          <Text style={styles.courseButtonText}>View Course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.header}>
        <Image
          source={{ uri: instructor.profile_pic }}
          style={styles.profileImage}
          defaultSource={defaultImages[0]}
        />
        <Text style={styles.name}>{instructor.name}</Text>
        {instructor.specialization && <Text style={styles.specialization}>{instructor.specialization}</Text>}
        {instructor.bio && <Text style={styles.bio}>{instructor.bio}</Text>}

        <View style={styles.contactContainer}>
          {instructor.email && <Text style={styles.contact}>Email: {instructor.email}</Text>}
          {instructor.phone && <Text style={styles.contact}>Phone: {instructor.phone}</Text>}
        </View>

        <Text style={styles.coursesCount}>
          {instructor.coursesCount ? `${instructor.coursesCount} courses` : "No courses yet"}
        </Text>
      </View>

      <Text style={styles.coursesHeading}>Courses by {instructor.name}</Text>
      {courses.length > 0 ? (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderCourse}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : (
        <Text style={{ textAlign: "center", color: "gray", marginTop: 10 }}>No courses available for this instructor.</Text>
      )}
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "gray" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
  retryButton: { backgroundColor: "red", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
  retryText: { color: "#fff", fontWeight: "bold" },

  header: { alignItems: "center", padding: 16 },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  specialization: { backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
  bio: { textAlign: "center", color: "gray", marginVertical: 8 },
  contactContainer: { marginTop: 8 },
  contact: { color: "#14B8A6", textAlign: "center", marginVertical: 2 },
  coursesCount: { marginTop: 8, color: "#14B8A6", fontWeight: "600" },

  coursesHeading: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 16 },

  courseCard: { backgroundColor: "#fff", borderRadius: 20, marginBottom: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  courseImage: { width: "100%", height: screenWidth * 0.5 },
  courseInfo: { padding: 12 },
  courseTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  courseDesc: { fontSize: 14, color: "gray", marginBottom: 8 },
  coursePrice: { color: "#14B8A6", fontWeight: "600", marginBottom: 12 },
  courseButton: { backgroundColor: "#14B8A6", paddingVertical: 10, borderRadius: 25, alignItems: "center" },
  courseButtonText: { color: "#fff", fontWeight: "600" },
});

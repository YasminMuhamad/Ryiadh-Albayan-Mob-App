import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { Colors, Fonts, FontSizes, FontWeights, Radius } from "../../theme";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

export function CourseDetails({ route }) {
  const course = route?.params?.course;
  const navigation = useNavigation();
  const [categoryName, setCategoryName] = useState(course?.categoryName || null);
  const [teacherName, setTeacherName] = useState(course?.instructor || null);
  const [lessonsCount, setLessonsCount] = useState(
    course?.totalLessons ||
      course?.total_lessons ||
      course?.lessonsCount ||
      course?.lessons_count ||
      course?.lessons ||
      null
  );
  const [modulesCount, setModulesCount] = useState(
    course?.totalModules ||
      course?.total_modules ||
      course?.modulesCount ||
      course?.modules_count ||
      course?.modules ||
      null
  );

  const handleBack = () => {
    navigation.navigate("Courses");
  };

  useEffect(() => {
    const loadCategory = async () => {
      const categoryId =
        course?.categoryId || course?.category_id || course?.category;
      if (!categoryId || categoryName) return;

      try {
        // Fetch category document from "categories" collection by id
        const snap = await getDoc(doc(db, "categories", categoryId));
        if (snap.exists()) {
          const data = snap.data();
          setCategoryName(data?.name || data?.title || data?.label || "Category");
        }
      } catch (err) {
        console.warn("Could not load category for course", err);
      }
    };

    loadCategory();
  }, [course, categoryName]);

  useEffect(() => {
    const loadTeacher = async () => {
      const teacherId = course?.teacherId || course?.teacher_id;
      if (!teacherId || teacherName) return;

      try {
        const snap = await getDoc(doc(db, "teachers", teacherId));
        if (snap.exists()) {
          const data = snap.data();
          setTeacherName(
            data?.name || data?.name_en || data?.fullName || "Instructor"
          );
        }
      } catch (err) {
        console.warn("Could not load teacher for course", err);
      }
    };

    loadTeacher();
  }, [course, teacherName]);

  // If total lessons/modules might be stored in Firestore but not passed, refresh from doc
  useEffect(() => {
    const loadCounts = async () => {
      if (lessonsCount && modulesCount) return;
      if (!course?.id) return;

      try {
        const snap = await getDoc(doc(db, "courses", course.id));
        if (snap.exists()) {
          const data = snap.data();
          if (!lessonsCount) {
            setLessonsCount(
              data.totalLessons ||
                data.total_lessons ||
                data.lessonsCount ||
                data.lessons_count ||
                data.lessons ||
                null
            );
          }
          if (!modulesCount) {
            setModulesCount(
              data.totalModules ||
                data.total_modules ||
                data.modulesCount ||
                data.modules_count ||
                data.modules ||
                null
            );
          }
        }
      } catch (err) {
        console.warn("Could not load course counts", err);
      }
    };

    loadCounts();
  }, [course?.id, lessonsCount, modulesCount]);

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No course data provided.</Text>
        <Text style={styles.meta}>Go back to the courses list and pick one to view details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backRow} onPress={handleBack}>
        <Feather name="arrow-left" size={20} color={Colors.foreground} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{course.title || course.name || "Course Details"}</Text>
      {teacherName ? <Text style={styles.meta}>Instructor: {teacherName}</Text> : null}
      {categoryName ? <Text style={styles.meta}>Category: {categoryName}</Text> : null}
      {lessonsCount ? (
        <Text style={styles.meta}>Total lessons: {lessonsCount}</Text>
      ) : null}
      {modulesCount ? (
        <Text style={styles.meta}>Total modules: {modulesCount}</Text>
      ) : null}
      {course.description ? (
        <Text style={styles.description}>{course.description}</Text>
      ) : (
        <Text style={styles.meta}>No description available for this course.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    gap: 8,
  },
  title: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.medium,
    color: Colors.foreground,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  backText: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h4,
    color: Colors.foreground,
  },
  meta: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.h4,
    color: Colors.mutedForeground,
  },
  description: {
    marginTop: 12,
    padding: 16,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.foreground,
    lineHeight: 22,
  },
});

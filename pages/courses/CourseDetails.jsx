import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { Colors, Fonts, FontSizes, FontWeights, Radius } from "../../theme";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { Video, ResizeMode } from "expo-av";

export function CourseDetails({ route }) {
  const course = route?.params?.course;
  const navigation = useNavigation();
  const videoRef = useRef(null);
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
  const [videoStatus, setVideoStatus] = useState({});
  const videoUrl =
    course?.video ||
    course?.videoUrl ||
    course?.videoURL ||
    course?.trailer ||
    "https://ladybirdar.com/wp-content/uploads/2016/11/%D8%AE%D9%8A%D8%B1-%D8%A7%D9%84%D8%AE%D8%B7%D8%A7%D8%A6%D9%8A%D9%86-%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%A8%D9%8A%D9%86.mp4";

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
      <View style={styles.screen}>
        <Text style={styles.title}>No course data provided.</Text>
        <Text style={styles.meta}>Go back to the courses list and pick one to view details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backRow} onPress={handleBack}>
        <Feather name="arrow-left" size={20} color={Colors.foreground} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.heroImageWrapper}>
        {course.image || course.cover || course.thumbnail ? (
          <Image
            source={{
              uri: course.image || course.cover || course.thumbnail,
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Feather name="image" size={36} color={Colors.primary} />
            <Text style={styles.heroPlaceholderText}>Course preview</Text>
          </View>
        )}
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>
            {course.mode || course.format || course.type || "Recorded Course"}
          </Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.badgePrimary}>
            <Text style={styles.badgePrimaryText}>Course Overview</Text>
          </View>
          <Text style={styles.timestamp}>Updated • Modern curriculum</Text>
        </View>

        <Text style={styles.title}>{course.title || course.name || "Course Details"}</Text>
        <Text style={styles.subtitle}>
          A structured path into the core concepts with clarity and confidence.
        </Text>

        <View style={styles.chipRow}>
          {teacherName ? (
            <View style={styles.chip}>
              <Feather name="user" size={14} color={Colors.primary} />
              <Text style={styles.chipText}>{teacherName}</Text>
            </View>
          ) : null}
          {categoryName ? (
            <View style={styles.chip}>
              <Feather name="tag" size={14} color={Colors.primary} />
              <Text style={styles.chipText}>{categoryName}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Lessons</Text>
            <Text style={styles.statValue}>{lessonsCount || "—"}</Text>
            <Text style={styles.statHint}>Bite-sized, focused sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Modules</Text>
            <Text style={styles.statValue}>{modulesCount || "—"}</Text>
            <Text style={styles.statHint}>Organized for smooth progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{course.level || "All"}</Text>
            <Text style={styles.statHint}>Open to all backgrounds</Text>
          </View>
        </View>
      </View>

      <View style={styles.videoCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Course trailer</Text>
          </View>
          <View style={styles.badgeMuted}>
            <Feather name="film" size={14} color={Colors.foreground} />
            <Text style={styles.badgeMutedText}>HD</Text>
          </View>
        </View>

        <View style={styles.videoFrame}>
          {videoUrl ? (
            <>
              <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: videoUrl }}
                resizeMode={ResizeMode.COVER}
                useNativeControls
                isLooping
                onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
              />
              <View style={styles.videoOverlay}>
                <TouchableOpacity style={styles.playButton} onPress={() => {
                  if (!videoRef.current) return;
                  if (videoStatus?.isPlaying) {
                    videoRef.current.pauseAsync();
                  } else {
                    videoRef.current.playAsync();
                  }
                }}>
                  <Feather
                    name={videoStatus?.isPlaying ? "pause" : "play"}
                    size={18}
                    color={Colors.primaryForeground}
                  />
                  <Text style={styles.playButtonText}>
                    {videoStatus?.isPlaying ? "Pause" : "Play trailer"}
                  </Text>
                </TouchableOpacity>
                <View style={styles.videoStatus}>
                  <Text style={styles.videoHint}>
                    {videoStatus?.isLoaded ? "Ready" : "Buffering"}
                  </Text>
                  <View style={styles.statusDot} />
                  <Text style={styles.videoHint}>
                    {videoStatus?.isPlaying ? "Playing" : "Paused"}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.videoPlaceholder}>
              <Feather name="video" size={32} color={Colors.mutedForeground} />
              <Text style={styles.meta}>No trailer available for this course.</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>What you will gain</Text>
        </View>
        {course.description ? (
          <Text style={styles.description}>{course.description}</Text>
        ) : (
          <Text style={styles.meta}>No description available for this course.</Text>
        )}
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Clarity on foundational concepts.</Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>A guided pathway with structured modules.</Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>Confidence to continue to advanced topics.</Text>
          </View>
        </View>
      </View>
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
  },
  title: {
    fontFamily: Fonts.poppins,
    fontSize: 34,
    fontWeight: "600",
    color: Colors.foreground,
    letterSpacing: -0.3,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  backText: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h4,
    color: Colors.foreground,
  },
  heroImageWrapper: {
    position: "relative",
    marginBottom: 16,
    borderRadius: Radius.xl,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 220,
    borderRadius: Radius.xl,
  },
  heroPlaceholder: {
    backgroundColor: Colors.muted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  heroPlaceholderText: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  heroBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  heroBadgeText: {
    fontFamily: Fonts.poppins,
    fontSize: 13,
    color: Colors.primaryForeground,
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    gap: 10,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgePrimary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgePrimaryText: {
    fontFamily: Fonts.poppins,
    fontSize: 12,
    color: Colors.primaryForeground,
    letterSpacing: 0.4,
  },
  timestamp: {
    fontFamily: Fonts.cairo,
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  subtitle: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.h4,
    color: Colors.mutedForeground,
    marginTop: -4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  statGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statLabel: {
    fontFamily: Fonts.cairo,
    fontSize: 12,
    color: Colors.primaryForeground,
  },
  statValue: {
    fontFamily: Fonts.poppins,
    fontSize: 26,
    color: Colors.primaryForeground,
    marginVertical: 2,
  },
  statHint: {
    fontFamily: Fonts.cairo,
    fontSize: 12,
    color: Colors.primaryForeground,
  },
  sectionCard: {
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionSubtitle: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
    marginTop: -2,
  },
  sectionAccent: {
    width: 10,
    height: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  sectionTitle: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h3,
    color: Colors.foreground,
    fontWeight: "600",
  },
  videoCard: {
    marginTop: 8,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: 10,
  },
  videoFrame: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  video: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    backgroundColor: Colors.background,
  },
  videoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  playButtonText: {
    fontFamily: Fonts.poppins,
    fontSize: 14,
    color: Colors.primaryForeground,
    fontWeight: "700",
  },
  videoStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  videoHint: {
    fontFamily: Fonts.cairo,
    fontSize: 13,
    color: Colors.primaryForeground,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  videoPlaceholder: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.muted,
  },
  badgeMuted: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.muted,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeMutedText: {
    fontFamily: Fonts.poppins,
    fontSize: 12,
    color: Colors.foreground,
    fontWeight: "500",
  },
  meta: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.h4,
    color: Colors.mutedForeground,
  },
  description: {
    marginTop: 4,
    padding: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.foreground,
    lineHeight: 22,
  },
  bulletList: {
    gap: 8,
    marginTop: 2,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bulletText: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.foreground,
  },
});

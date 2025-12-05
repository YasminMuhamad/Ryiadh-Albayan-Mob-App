import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Colors, Fonts, FontSizes, FontWeights, Radius } from "../../theme";
import { db } from "../../firebase";
import Feather from "@expo/vector-icons/Feather";

export function CoursesScreen() {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredDetailId, setHoveredDetailId] = useState(null);
  const [activeTab, setActiveTab] = useState("recorded");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [search, setSearch] = useState("");

  const loadCourses = useCallback(
    async (isRefresh = false) => {
      if (loading && !isRefresh) return;
      setError(null);
      isRefresh ? setRefreshing(true) : setLoading(true);

      try {
        const [categorySnapshot, courseSnapshot] = await Promise.all([
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "courses")),
        ]);

        const categoriesMap = categorySnapshot.docs.reduce((acc, docSnap) => {
          acc[docSnap.id] = docSnap.data();
          return acc;
        }, {});

        setCategories([
          { id: "all", name: "All Categories" },
          ...categorySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            name:
              docSnap.data()?.name ||
              docSnap.data()?.title ||
              docSnap.data()?.label ||
              "Category",
          })),
        ]);

        const coursesWithCategory = await Promise.all(
          courseSnapshot.docs.map(async (courseDoc) => {
            const data = courseDoc.data();
            const categoryId =
              data.categoryId || data.category_id || data.category;
            const teacherId = data.teacherId || data.teacher_id;

            let categoryName = null;
            if (categoryId) {
              const categoryData = categoriesMap[categoryId];
              categoryName =
                categoryData?.name ||
                categoryData?.title ||
                categoryData?.label ||
                "Category";
            }

            let teacherName = null;
            if (teacherId) {
              try {
                const teacherSnap = await getDoc(doc(db, "teachers", teacherId));
                if (teacherSnap.exists()) {
                  const teacherData = teacherSnap.data();
                  teacherName =
                    teacherData?.name ||
                    teacherData?.name_en ||
                    teacherData?.fullName ||
                    "Instructor";
                }
              } catch (innerErr) {
                console.warn("Could not load teacher", innerErr);
              }
            }

            return {
              id: courseDoc.id,
              ...data,
              categoryName,
              instructor: teacherName || data.instructor,
              totalLessons:
                data.totalLessons ||
                data.total_lessons ||
                data.lessonsCount ||
                data.lessons_count ||
                data.lessons,
              totalModules:
                data.totalModules ||
                data.total_modules ||
                data.modulesCount ||
                data.modules_count ||
                data.modules,
              teacherId,
            };
          })
        );

        setCourses(coursesWithCategory);
      } catch (err) {
        console.error("Failed to load courses", err);
        setError("Could not load courses. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading]
  );

  const segmentedCounts = courses.reduce(
    (acc, course) => {
      const mode = (course.mode || course.type || "Recorded").toLowerCase();
      if (mode.includes("record")) acc.recorded += 1;
      else acc.interactive += 1;
      return acc;
    },
    { recorded: 0, interactive: 0 }
  );

  const filteredCourses = courses.filter((course) => {
    const mode = (course.mode || course.type || "Recorded").toLowerCase();
    const matchesTab =
      activeTab === "recorded" ? mode.includes("record") : !mode.includes("record");

    const term = search.trim().toLowerCase();
    const matchesSearch = term
      ? (course.title || course.name || "")
          .toString()
          .toLowerCase()
          .includes(term) ||
        (course.description || "").toString().toLowerCase().includes(term) ||
        (course.instructor || "").toString().toLowerCase().includes(term) ||
        (course.categoryName || "")
          .toString()
          .toLowerCase()
          .includes(term)
      : true;

    const matchesCategory =
      selectedCategory === "all" ||
      course.category === selectedCategory ||
      course.categoryId === selectedCategory ||
      course.category_id === selectedCategory;

    return matchesTab && matchesSearch && matchesCategory;
  });

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const renderCourse = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Course Details", { course: item })}
    >
      <View style={styles.mediaWrapper}>
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <Feather name="book-open" size={32} color={Colors.primary} />
            <Text style={styles.placeholderText}>Course</Text>
          </View>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.mode || item.type || "Recorded"}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        {item.categoryName ? (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item.categoryName}</Text>
          </View>
        ) : null}

        <Text style={styles.cardTitle}>
          {item.title || item.name || "Course"}
        </Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        {item.instructor ? (
          <Text style={styles.instructor}>
            Instructor: {item.instructor}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {item.totalLessons ? (
            <View style={styles.metaItem}>
              <Feather name="book-open" size={18} color={Colors.mutedForeground} />
              <Text style={styles.metaText}>{item.totalLessons} lessons</Text>
            </View>
          ) : null}
          {item.totalModules ? (
            <View style={styles.metaItem}>
              <Feather name="layers" size={18} color={Colors.mutedForeground} />
              <Text style={styles.metaText}>{item.totalModules} modules</Text>
            </View>
          ) : null}
          {item.students ? (
            <View style={styles.metaItem}>
              <Feather
                name="users"
                size={18}
                color={Colors.mutedForeground}
              />
              <Text style={styles.metaText}>{item.students} students</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actionsRow}>
          <Text style={styles.price}>
            {item.price ? `$ ${item.price}` : "Free"}
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.secondaryButton,
                hoveredDetailId === item.id && styles.secondaryButtonHover,
              ]}
              onPress={() =>
                navigation.navigate("Course Details", { course: item })
              }
              onHoverIn={() => setHoveredDetailId(item.id)}
              onHoverOut={() => setHoveredDetailId(null)}
            >
              <Text style={styles.secondaryButtonText}>
                Details
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing && !courses.length) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.stateText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Explore Our Courses</Text>
        <Text style={styles.heroSubtitle}>
          Choose from our comprehensive selection of recorded courses and interactive live
          sessions
        </Text>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={Colors.mutedForeground} />
          <TextInput
            placeholder="Search courses..."
            placeholderTextColor={Colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Pressable
            style={styles.dropdownTrigger}
            onPress={() => setIsCategoryOpen((prev) => !prev)}
          >
            <Text style={styles.dropdownText}>
              {categories.find((c) => c.id === selectedCategory)?.name || "All Categories"}
            </Text>
            <Feather
              name={isCategoryOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={Colors.mutedForeground}
            />
          </Pressable>
          {isCategoryOpen ? (
            <View style={styles.dropdownMenu}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.dropdownItem,
                    selectedCategory === cat.id && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    setIsCategoryOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedCategory === cat.id && styles.dropdownItemTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.segmented}>
        <Pressable
          style={[
            styles.segment,
            activeTab === "recorded" && styles.segmentActive,
          ]}
          onPress={() => setActiveTab("recorded")}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "recorded" && styles.segmentTextActive,
            ]}
          >
            Recorded Courses ({segmentedCounts.recorded})
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.segment,
            activeTab === "interactive" && styles.segmentActive,
          ]}
          onPress={() => setActiveTab("interactive")}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "interactive" && styles.segmentTextActive,
            ]}
          >
            Interactive Sessions ({segmentedCounts.interactive})
          </Text>
        </Pressable>
      </View>

      {error ? (
        <TouchableOpacity style={styles.errorBox} onPress={() => loadCourses()}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id || item.title}
        renderItem={renderCourse}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            refreshing={refreshing}
            onRefresh={() => loadCourses(true)}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.stateContainer}>
              <Text style={styles.stateText}>
                {activeTab === "recorded"
                  ? "No recorded courses available right now."
                  : "No interactive sessions available right now."}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  hero: {
    marginBottom: 16,
    alignItems: "center",
    gap: 8,
  },
  heroTitle: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.medium,
    color: Colors.foreground,
    textAlign: "center",
  },
  heroSubtitle: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h3,
    color: Colors.mutedForeground,
    textAlign: "center",
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.medium,
    color: Colors.foreground,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    zIndex: 5,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.base,
    color: Colors.foreground,
    outlineWidth: 0,
    outlineColor: "transparent",
    borderWidth: 0,
  },
  dropdownContainer: {
    width: 180,
    position: "relative",
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownText: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.base,
    color: Colors.foreground,
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    left: 0,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemActive: {
    backgroundColor: Colors.muted,
  },
  dropdownItemText: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.base,
    color: Colors.foreground,
  },
  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: Colors.muted,
    borderRadius: 999,
    padding: 4,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: Colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  segmentText: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
    fontWeight: FontWeights.medium,
  },
  segmentTextActive: {
    color: Colors.foreground,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.08)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
        }),
    overflow: "hidden",
  },
  mediaWrapper: {
    position: "relative",
  },
  cover: {
    width: "100%",
    height: 220,
    backgroundColor: Colors.muted,
  },
  coverPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  placeholderText: {
    fontFamily: Fonts.poppins,
    color: Colors.mutedForeground,
  },
  badge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  badgeText: {
    fontFamily: Fonts.poppins,
    color: Colors.primaryForeground,
    fontWeight: FontWeights.medium,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.medium,
    color: Colors.foreground,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontFamily: Fonts.poppins,
    color: Colors.foreground,
    fontWeight: FontWeights.medium,
  },
  meta: {
    marginTop: 4,
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  instructor: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.h4,
    color: Colors.primary,
  },
  description: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.foreground,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h2,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  secondaryButtonHover: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  secondaryButtonText: {
    fontFamily: Fonts.poppins,
    color: Colors.foreground,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stateText: {
    marginTop: 8,
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  errorBox: {
    backgroundColor: Colors.destructive,
    padding: 12,
    borderRadius: Radius.md,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.destructiveForeground,
  },
  retryText: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.destructiveForeground,
    marginTop: 4,
  },
});

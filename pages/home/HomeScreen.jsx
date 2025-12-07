// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, FontWeights } from '../../theme';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import photo1 from '../../assets/photo1.jpg';

export function HomeScreen() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const teachersSnap = await getDocs(collection(db, 'teachers'));
        const reviewsSnap = await getDocs(collection(db, 'reviews'));

        setCourses(coursesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })).slice(0, 3));
        setTeachers(teachersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setReviews(reviewsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })).slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingHorizontal: 16 }}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</Text>
        </View>
        <Text style={styles.heroTitle}>Riyad Al-Bayan Center</Text>
        <Text style={styles.heroSubtitle}>
          Learn Arabic & Islamic Studies with knowledge, faith, and understanding
        </Text>
      </View>

      {/* About Section */}
      <View style={styles.aboutContainer}>
        <Image source={photo1} style={styles.aboutImage} />
        <View style={styles.aboutTextContainer}>
          <Text style={styles.aboutBadge}>About Riyad Al-Bayan Center</Text>
          <Text style={styles.aboutText}>
            Riyad Al-Bayan Center is a trusted online platform dedicated to teaching Arabic language
            and Islamic sciences to students around the globe.
          </Text>
        </View>
      </View>

      {/* Featured Courses */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featured Courses</Text>
        {loadingCourses ? (
          <Text style={styles.loadingText}>Loading courses...</Text>
        ) : courses.length === 0 ? (
          <Text style={styles.loadingText}>No courses available.</Text>
        ) : (
          <View style={styles.cardsContainer}>
            {courses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image
                  source={{ uri: course.thumbnail || 'https://via.placeholder.com/150' }}
                  style={styles.courseImage}
                />
                <Text style={styles.courseCategory}>{course.category || 'General'}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDesc}>{course.description?.slice(0, 80)}...</Text>
                <Text style={styles.courseInstructor}>
                  Instructor: {teachers.find((t) => t.id === course.teacherId)?.name || 'Unknown'}
                </Text>
                <Pressable
                  style={styles.courseButton}
                  onPress={() => navigation.navigate('Course Details', { courseId: course.id })}>
                  <Text style={styles.courseButtonText}>Show details</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Teachers Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Meet Our Teachers</Text>
        <View style={styles.cardsContainer}>
          {teachers.slice(0, 3).map((teacher) => (
            <View key={teacher.id} style={styles.teacherCard}>
              <Image source={{ uri: teacher.profile_pic }} style={styles.teacherImage} />
              <Text style={styles.teacherName}>{teacher.name_ar}</Text>
              <Text style={styles.teacherSpec}>{teacher.specialization}</Text>
              <Text style={styles.teacherEmail}>{teacher.email}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View style={[styles.sectionContainer, styles.testimonialsContainer]}>
        <Text style={styles.sectionTitle}>Student Testimonials</Text>
        <View style={styles.cardsContainer}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewQuote}>“</Text>
              <Text style={styles.reviewText}>{review.content || 'No comment available.'}</Text>
              <View style={styles.reviewStars}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Text key={index} style={styles.reviewStar}>
                    {index < review.rating ? '★' : '☆'}
                  </Text>
                ))}
              </View>
              <Text style={styles.reviewName}>{review.name || 'Unknown Name'}</Text>
              <Text style={styles.reviewCountry}>{review.country || 'Unknown Country'}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitle}>Begin Your Learning Journey Today</Text>
        <Text style={styles.ctaText}>
          Join our community of dedicated learners and start your path to Islamic knowledge
        </Text>
        <Text style={styles.ctaQuote}>"Knowledge lights the path to a better tomorrow."</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: Colors.background },
  heroContainer: { paddingTop: 60, alignItems: 'center' },
  heroBadge: {
    backgroundColor: '#e6f1ee',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  heroBadgeText: { color: '#21746c', fontSize: 14 },
  heroTitle: {
    fontSize: 32,
    color: '#21746c',
    fontFamily: Fonts.poppins,
    fontWeight: FontWeights.normal,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: { fontSize: 18, color: '#6E6E73', textAlign: 'center', marginBottom: 24 },

  aboutContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  aboutImage: { width: 150, height: 150, borderRadius: 16, marginRight: 16 },
  aboutTextContainer: { flex: 1 },
  aboutBadge: { color: '#21746c', fontSize: 14, fontFamily: Fonts.poppins, marginBottom: 4 },
  aboutText: { color: '#6E6E73', fontSize: 16 },

  sectionContainer: { paddingVertical: 16, marginBottom: 24 },
  sectionTitle: {
    fontSize: 22,
    fontFamily: Fonts.poppins,
    fontWeight: FontWeights.medium,
    color: '#1D1D1F',
    marginBottom: 12,
  },
  loadingText: { textAlign: 'center', color: '#6E6E73' },
  cardsContainer: { flexDirection: 'column', gap: 12 },

  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  courseImage: { width: '100%', height: 150, borderRadius: 12, marginBottom: 6 },
  courseCategory: { color: '#8a7a3a', fontSize: 12, marginBottom: 4 },
  courseTitle: { fontSize: 16, fontWeight: '600', color: '#1D1D1F' },
  courseDesc: { fontSize: 12, color: '#6E6E73', marginBottom: 6 },
  courseInstructor: { fontSize: 12, color: '#21746c', marginBottom: 6 },
  courseButton: {
    backgroundColor: '#21746c',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  courseButtonText: { color: '#fff', textAlign: 'center' },

  teacherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  teacherImage: { width: '100%', height: 150, borderRadius: 12, marginBottom: 6 },
  teacherName: { fontSize: 14, fontWeight: '600', color: '#1D1D1F' },
  teacherSpec: { fontSize: 12, color: '#6E6E73' },
  teacherEmail: { fontSize: 12, color: '#0E9F9F' },

  testimonialsContainer: { backgroundColor: '#faf6f2' },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reviewQuote: { fontSize: 24, color: '#0E9F9F', marginBottom: 4 },
  reviewText: { fontSize: 12, color: '#6E6E73' },
  reviewStars: { flexDirection: 'row', marginTop: 4 },
  reviewStar: { color: '#FFD700', fontSize: 14, marginRight: 2 },
  reviewName: { fontSize: 12, fontWeight: '600', color: '#1D1D1F', marginTop: 6 },
  reviewCountry: { fontSize: 10, color: '#6E6E73' },

  ctaContainer: {
    backgroundColor: '#0E9F9F',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 16,
  },
  ctaTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  ctaQuote: { color: '#fff', fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
});

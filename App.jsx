// App.jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { HomeScreen } from "pages/home/HomeScreen";
import { CoursesScreen } from "pages/courses/CoursesScreen";
import { CourseDetails } from "pages/courses/CourseDetails";
// import { Profile } from "pages/profile/Profile";
import AboutScreen from "pages/home/About";
import LoginScreen from "pages/auth/Login";
import RegisterScreen from "./pages/auth/Register";
import ForgotPasswordScreen from "./pages/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./pages/auth/ResetPasswordScreen";
import StudentProfile from "./pages/profile/Profile";

import { Colors, Fonts } from "./theme";
import { Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';

// ← **هنا** استورد الـ AuthProvider من ملف الـ context عندك
import { AuthProvider } from "./context/AuthContext"; // <-- عدّلي المسار لو مختلف

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: Colors.sidebar }}
    >
      <View style={{
        display: 'flex',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sidebarBorder,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
      }}>

        <View
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9999,
            backgroundColor: '#E6EFEB',
          }}
        >
          <Feather name="book-open" size={24} color="#0E7C7B" />
        </View>

        <Text style={{
          fontFamily: Fonts.poppins,
          fontSize: 20,
          color: Colors.sidebarForeground
        }}>
          Riyadh Albayan
        </Text>

      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    // ← لفينا كل الـ Navigation بالـ AuthProvider
    <AuthProvider>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.primaryForeground,
            drawerActiveBackgroundColor: Colors.sidebarPrimary,
            drawerActiveTintColor: Colors.sidebarPrimaryForeground,
            drawerInactiveTintColor: Colors.sidebarForeground,
          }}
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Courses" component={CoursesScreen} />
          <Drawer.Screen name="Course Details" component={CourseDetails} />
          {/* <Drawer.Screen name="Profile" component={Profile} /> */}
          <Drawer.Screen name="About" component={AboutScreen} />
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Register" component={RegisterScreen} />
          <Drawer.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Drawer.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Drawer.Screen name="StudentProfile" component={StudentProfile} />
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

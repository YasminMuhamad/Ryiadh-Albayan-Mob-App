// App.jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';

import { Colors, Fonts } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { HomeScreen } from "pages/home/HomeScreen";
import { CoursesScreen } from "pages/courses/CoursesScreen";
import { CourseDetails } from "pages/courses/CourseDetails";
import AboutScreen from "pages/home/About";
import LoginScreen from "pages/auth/Login";
import RegisterScreen from "./pages/auth/Register";
import ForgotPasswordScreen from "./pages/auth/ForgotPasswordScreen";
import StudentProfile from "./pages/profile/Profile";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer مع زر Logout
function CustomDrawerContent(props) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      props.navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: Colors.sidebar }}>
      <View style={{
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sidebarBorder,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <View style={{
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 9999,
          backgroundColor: '#E6EFEB',
          marginRight: 12,
        }}>
          <Feather name="book-open" size={24} color={Colors.primary} />
        </View>
        <Text style={{ fontFamily: Fonts.poppins, fontSize: 20, color: Colors.sidebarForeground }}>
          Riyadh Albayan
        </Text>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity
        style={{
          marginTop: 20,
          marginHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color={Colors.sidebarForeground} />
        <Text style={{
          color: Colors.sidebarForeground,
          fontFamily: Fonts.poppins,
          fontSize: 16,
          marginLeft: 12
        }}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// Drawer مع شاشات التطبيق
function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.primaryForeground,
        headerTitleStyle: { fontFamily: Fonts.poppins, fontWeight: "600", fontSize: 18 },
        drawerActiveBackgroundColor: Colors.sidebarPrimary,
        drawerActiveTintColor: Colors.sidebarPrimaryForeground,
        drawerInactiveTintColor: Colors.sidebarForeground,
        drawerLabelStyle: { fontFamily: Fonts.poppins, fontSize: 16 },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <Drawer.Screen name="Courses" component={CoursesScreen} options={{ title: "Courses" }} />
      <Drawer.Screen name="Course Details" component={CourseDetails} options={{ title: "Course Details" }} />
      <Drawer.Screen name="About" component={AboutScreen} options={{ title: "About" }} />
      <Drawer.Screen name="StudentProfile" component={StudentProfile} options={{ title: "Profile" }} />
    </Drawer.Navigator>
  );
}

// App الرئيسي
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {/* شاشات المصادقة */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          {/* بعد تسجيل الدخول: Drawer */}
          <Stack.Screen name="App" component={AppDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

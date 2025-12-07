import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import HomeScreen from "./src/pages/home/HomeScreen";
import CoursesScreen from "./src/pages/courses/CoursesScreen";
import CourseDetails from "./src/pages/courses/CourseDetails";
import Profile from "./src/pages/profile/Profile";

import AboutScreen from "pages/home/About"; 
import InstructorDetails from "pages/Instructor/InstructorDetails";
import InstructorsPage from "pages/Instructor/Instructors";

import { Colors, Fonts } from "./theme";
import { Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';

const Drawer = createDrawerNavigator();

// Custom Drawer Content
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
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Instructor Details" component={InstructorDetails} />
        <Drawer.Screen name="Instructors" component={InstructorsPage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

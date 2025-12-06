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
import { StyleSheet, Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { CartProvider, useCart } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { CartScreen } from "pages/cart/CartScreen";

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
    Riyadh-Albayan
  </Text>

      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <MainNavigator />
      </CartProvider>
    </ToastProvider>
  );
}

function MainNavigator() {
  const { cartCount } = useCart();

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
        <Drawer.Screen
          name="Cart"
          component={CartScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Feather name="shopping-cart" size={size} color={color} />
            ),
            drawerLabel: ({ color }) => (
              <View style={styles.drawerLabelRow}>
                <Text style={[styles.drawerLabelText, { color }]}>Cart</Text>
                {cartCount ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                ) : null}
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Course Details"
          component={CourseDetails}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="About" component={About} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  drawerLabelText: {
    fontFamily: Fonts.poppins,
    fontSize: 16,
  },
  badge: {
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: Fonts.poppins,
    color: Colors.primaryForeground,
    fontSize: 12,
  },
});

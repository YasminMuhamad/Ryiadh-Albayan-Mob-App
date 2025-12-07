// App.jsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { HomeScreen } from 'pages/home/HomeScreen';
import { CoursesScreen } from 'pages/courses/CoursesScreen';
import { CourseDetails } from 'pages/courses/CourseDetails';
import AboutScreen from 'pages/home/About';
import LoginScreen from './pages/auth/Login';
import RegisterScreen from './pages/auth/Register';
import ForgotPasswordScreen from './pages/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './pages/auth/ResetPasswordScreen';
import ProfileScreen from './pages/profile/Profile';
import StudentProfile from "./pages/profile/Profile";
import NotificationsScreen from './pages/notifications/NotificationsScreen';
import ChatScreen from './pages/chat/ChatScreen';
import { ContactScreen } from './pages/contact/Contact';
import { Colors, Fonts } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationsProvider, useNotifications } from './context/NotificationsContext';
import ChatWidget from './components/ChatWidget';
import { CartProvider, useCart } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { CartScreen } from "pages/cart/CartScreen";


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

/* ---------------------- Notification Icon ---------------------- */
const NotificationIcon = ({ navigation }) => {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <View style={{ marginRight: 16 }}>
      <Feather
        name="bell"
        size={24}
        color={Colors.primaryForeground}
        onPress={() => navigation.navigate('Notifications')}
      />
      {unreadCount > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  );
};

/* ---------------------- Custom Drawer ---------------------- */
function CustomDrawerContent(props) {
  const { user, logout } = useAuth(); // استدعاء user و logout

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: Colors.sidebar }}>
      <View style={styles.drawerHeader}>
        <View style={styles.drawerIcon}>
          <Feather name="book-open" size={24} color={Colors.primary} />
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

      {!user && (
        <DrawerItem
          label="Login"
          icon={({ color, size }) => <Feather name="log-in" color={color} size={size} />}
          onPress={() => {
            props.navigation.navigate('Login');
            props.navigation.closeDrawer();
          }}
          style={{ marginTop: 'auto' }}
          labelStyle={{ color: '#2563eb' }}
        />
      )}

      {user && (
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <Feather name="log-out" color={color} size={size} />}
          onPress={() => {
            logout();
            props.navigation.closeDrawer();
          }}
          style={{ marginTop: 'auto' }}
          labelStyle={{ color: Colors.destructive }}
        />
      )}
    </DrawerContentScrollView>
  );
}

/* ---------------------- Drawer Navigator ---------------------- */
function DrawerNavigator() {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.primaryForeground,
        drawerActiveBackgroundColor: Colors.sidebarPrimary,
        drawerActiveTintColor: Colors.sidebarPrimaryForeground,
        drawerInactiveTintColor: Colors.sidebarForeground,
        headerRight: () => <NotificationIcon navigation={navigation} />,
      })}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Courses" component={CoursesScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Contact" component={ContactScreen} />
      {user && <Drawer.Screen name="Profile" component={ProfileScreen} />}
    </Drawer.Navigator>
  );
}

/* ---------------------- Stack Navigator (Hidden Pages) ---------------------- */
// function RootNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />
//       <Stack.Screen
//         name="CourseDetails"
//         component={CourseDetails}
//         options={{ title: 'Course Details' }}
//       />
//       <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
//       <Stack.Screen
//         name="Notifications"
//         component={NotificationsScreen}
//         options={{ title: 'Notifications' }}
//       />
//       <Stack.Screen
//         name="Register"
//         component={RegisterScreen}
//         options={{ title: 'Create Account' }}
//       />
//       <Stack.Screen
//         name="ForgotPassword"
//         component={ForgotPasswordScreen}
//         options={{ title: 'Forgot Password' }}
//       />
//       <Stack.Screen
//         name="ResetPassword"
//         component={ResetPasswordScreen}
//         options={{ title: 'Reset Password' }}
//       />
//       <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
//     </Stack.Navigator>
//   );
// }


function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={DrawerNavigator} />
      <Stack.Screen name="CourseDetails" component={CourseDetails} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}


/* ---------------------- Main App ---------------------- */
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <NotificationsProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </NotificationsProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

function AppWithNotifications() {
  const { currentRoute, setCurrentRoute } = useState(null);

  return (
    <>
      <ChatWidget />
    </>
  );
}


/* ---------------------- App With Notifications + Chat Widget ---------------------- */
// function AppWithNotifications() {
//   const { cartCount } = useCart();
//   const { user } = useAuth();
//   const currentUserId = user ? user.uid : null;
//   const [currentRoute, setCurrentRoute] = useState(null);

//   return (
//     <NotificationsProvider currentUserId={currentUserId}>
//       <NavigationContainer
//         onStateChange={(state) => {
//           const route = state.routes[state.index];
//           setCurrentRoute(route.name);
//         }}>


//           <Drawer.Navigator
//         drawerContent={(props) => <CustomDrawerContent {...props} />}
//         screenOptions={{
//           headerStyle: { backgroundColor: Colors.primary },
//           headerTintColor: Colors.primaryForeground,
//           drawerActiveBackgroundColor: Colors.sidebarPrimary,
//           drawerActiveTintColor: Colors.sidebarPrimaryForeground,
//           drawerInactiveTintColor: Colors.sidebarForeground,
//         }}
//       >
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Courses" component={CoursesScreen} />
//         <Drawer.Screen
//           name="Cart"
//           component={CartScreen}
//           options={{
//             drawerIcon: ({ color, size }) => (
//               <Feather name="shopping-cart" size={size} color={color} />
//             ),
//             drawerLabel: ({ color }) => (
//               <View style={styles.drawerLabelRow}>
//                 <Text style={[styles.drawerLabelText, { color }]}>Cart</Text>
//                 {cartCount ? (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{cartCount}</Text>
//                   </View>
//                 ) : null}
//               </View>
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="Course Details"
//           component={CourseDetails}
//           options={{ drawerItemStyle: { display: "none" } }}
//         />
//         <Drawer.Screen name="Profile" component={Profile} />
//         <Drawer.Screen name="About" component={About} />
//       </Drawer.Navigator>
//     </NavigationContainer>

//         <RootNavigator />
//         {currentRoute !== 'Chat' && <ChatWidget />}
//     </NotificationsProvider>
//   );
// }

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: Colors.destructive,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: Colors.destructiveForeground,
    fontSize: 10,
    fontWeight: 'bold',
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sidebarBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: '#E6EFEB',
  },
  drawerTitle: {
    fontFamily: Fonts.poppins,
    fontSize: 20,
    color: Colors.sidebarForeground,
  },

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

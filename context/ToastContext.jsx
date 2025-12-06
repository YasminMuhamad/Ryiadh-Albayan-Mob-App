import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, FontSizes, Radius } from "../theme";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setToast(null));
    }, toast.duration || 2000);
  }, [toast, opacity, translateY]);

  const showToast = (message, type = "success", duration) => {
    setToast({
      id: Date.now(),
      message,
      type,
      duration,
    });
  };

  const value = useMemo(
    () => ({
      showToast,
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          style={[
            styles.toast,
            toast.type === "error" && styles.toastError,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastBar} />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: Colors.foreground,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  toastError: {
    backgroundColor: Colors.destructive,
  },
  toastText: {
    color: Colors.primaryForeground,
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.base,
  },
  toastBar: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});

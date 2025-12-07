import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors, Fonts, FontSizes, FontWeights, Radius } from "../../theme";
import { useCart } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "../../context/ToastContext";

export function CartScreen() {
  const { cartItems, cartCount, removeFromCart, clearCart } = useCart();
  const navigation = useNavigation();
  const { showToast } = useToast();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTopRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.navigate("Courses")}
            >
              <Feather name="arrow-left" size={18} color={Colors.primary} />
            </Pressable>
            <Text style={styles.title}>Cart</Text>
          </View>
          <Text style={styles.subtitle}>
            {cartCount
              ? `${cartCount} course${cartCount > 1 ? "s" : ""} in your cart`
              : "No courses added yet"}
          </Text>
        </View>
        <View style={styles.countPill}>
          <Feather name="shopping-cart" size={18} color={Colors.primary} />
          <Text style={styles.countText}>{cartCount}</Text>
        </View>
      </View>

      {cartCount ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Feather name="book" size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.courseTitle}>
                      {item.title || item.name || "Course"}
                    </Text>
                    {item.instructor ? (
                      <Text style={styles.courseMeta}>Instructor: {item.instructor}</Text>
                    ) : null}
                  </View>
                  <Pressable
                    style={styles.removeButton}
                  onPress={() => {
                    removeFromCart(item.id);
                    showToast("Removed from cart", "error");
                  }}
                >
                  <Feather name="trash-2" size={18} color={Colors.destructive} />
                </Pressable>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.priceTag}>
                    <Feather name="dollar-sign" size={16} color={Colors.primary} />
                    <Text style={styles.coursePrice}>
                      {item.price ? `${item.price}` : "Free"}
                    </Text>
                  </View>
                  <View style={styles.badgeSoft}>
                    <Feather name="clock" size={14} color={Colors.mutedForeground} />
                    <Text style={styles.badgeSoftText}>
                      {item.totalModules
                        ? `${item.totalModules} modules`
                        : item.totalLessons
                        ? `${item.totalLessons} lessons`
                        : "Course"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />

          <Pressable
            style={styles.clearButton}
            onPress={() => {
              clearCart();
              showToast("Cart cleared", "error");
            }}
          >
            <Text style={styles.clearButtonText}>Clear cart</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Feather name="shopping-cart" size={26} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse courses and tap the cart icon to keep them here.
          </Text>
          <Pressable
            style={styles.goButton}
            onPress={() => navigation.navigate("Courses")}
          >
            <Text style={styles.goButtonText}>Go to courses</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    gap: 6,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h2,
    color: Colors.foreground,
    fontWeight: FontWeights.medium,
  },
  subtitle: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
    marginTop: 4,
  },
  countPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Colors.muted,
  },
  countText: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h4,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  list: {
    gap: 14,
    paddingBottom: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
    shadowColor: Colors.foreground,
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardContent: {
    flex: 1,
  },
  courseTitle: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h4,
    color: Colors.foreground,
    fontWeight: FontWeights.medium,
  },
  courseMeta: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
    marginTop: 4,
  },
  coursePrice: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h4,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.destructive,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212, 24, 61, 0.08)",
  },
  clearButton: {
    marginTop: 16,
    alignSelf: "flex-end",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearButtonText: {
    fontFamily: Fonts.poppins,
    color: Colors.primaryForeground,
    fontWeight: FontWeights.medium,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeSoft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Colors.muted,
  },
  badgeSoftText: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14, 124, 123, 0.1)",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.muted,
  },
  emptyTitle: {
    fontFamily: Fonts.poppins,
    fontSize: FontSizes.h3,
    color: Colors.foreground,
    fontWeight: FontWeights.medium,
  },
  emptySubtitle: {
    fontFamily: Fonts.cairo,
    fontSize: FontSizes.base,
    color: Colors.mutedForeground,
    textAlign: "center",
  },
  goButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goButtonText: {
    fontFamily: Fonts.poppins,
    color: Colors.primaryForeground,
    fontWeight: FontWeights.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.muted,
  },
});

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  StyleSheet
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserDetails } from "../hooks/useUserDetails";

const HomeScreen = () => {
  const router = useRouter();
  const { userName } = useUserDetails();

  const navigateTo = (screen) => {
    router.push(screen);
  };

  const menuItems = [
    { icon: "truck", text: "Schedule Pickup", navigateTo: "(requests)/residenceRequests/Book_a_pickup" },
    { icon: "recycle", text: "Recycle", navigateTo: "(requests)/factroyRequests/Recycle", iconSet: FontAwesome5 },
    { icon: "book-open", text: "Learn", navigateTo: "(requests)/residenceRequests/QRCodeScanner" },
    { icon: "newspaper", text: "Eco News", navigateTo: "QRCodeGenerator", iconSet: FontAwesome5 }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <HeaderSection userName={userName} />
        <PromotionSection />
        <EcoTipSection />
        <MenuSection menuItems={menuItems} onItemPress={navigateTo} />
        <ContactSection />
      </ScrollView>
    </SafeAreaView>
  );
};

const HeaderSection = ({ userName }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.userName}>{userName}</Text>
    </View>
    <TouchableOpacity style={styles.iconButton}>
      <Feather name="bell" size={24} color="#2E7D32" />
    </TouchableOpacity>
  </View>
);

const PromotionSection = () => (
  <View style={styles.promotionContainer}>
    <View style={styles.promotionContent}>
      <Text style={styles.promotionTitle}>Don't throw away,</Text>
      <Text style={styles.promotionTitle}>recycle for another day</Text>
      <Text style={styles.promotionSubtitle}>Recycle with us</Text>
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Let's start</Text>
      </TouchableOpacity>
    </View>
    <Image source={{ uri: "https://clipart-library.com/images/6TpopbX7c.jpg" }} style={styles.promotionImage} resizeMode="contain" />
  </View>
);

const EcoTipSection = () => (
  <View style={styles.ecoTipContainer}>
    <FontAwesome5 name="leaf" size={24} color="#2E7D32" style={styles.ecoTipIcon} />
    <Text style={styles.ecoTipText}>Eco Tip: Use reusable bags when shopping to reduce plastic waste.</Text>
  </View>
);

const MenuSection = ({ menuItems, onItemPress }) => (
  <View style={styles.menuContainer}>
    {menuItems.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.menuItem}
        onPress={() => onItemPress(item.navigateTo)}
      >
        <View style={styles.menuItemIconContainer}>
          {item.iconSet ? (
            <item.iconSet name={item.icon} size={24} color="#2E7D32" />
          ) : (
            <Feather name={item.icon} size={24} color="#2E7D32" />
          )}
        </View>
        <Text style={styles.menuItemText}>{item.text}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const ContactSection = () => (
  <View style={styles.contactContainer}>
    <Text style={styles.contactTitle}>Contact Us</Text>
    <View style={styles.contactButtonsContainer}>
      <ContactButton icon="mail" text="Send Email" />
      <ContactButton icon="phone" text="Call Now" />
    </View>
  </View>
);

const ContactButton = ({ icon, text }) => (
  <TouchableOpacity style={styles.contactButton}>
    <Feather name={icon} size={20} color="#2E7D32" />
    <Text style={styles.contactButtonText}>{text}</Text>
  </TouchableOpacity>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: '#C8E6C9',
  },
  welcomeText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  userName: {
    color: "#1B5E20",
    fontSize: 24,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 8,
  },
  promotionContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    color: "#1B5E20",
    fontSize: 20,
    fontWeight: "bold",
  },
  promotionSubtitle: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  startButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  promotionImage: {
    width: 120,
    height: 120,
  },
  ecoTipContainer: {
    backgroundColor: "#C8E6C9",
    borderRadius: 20,
    margin: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  ecoTipIcon: {
    marginRight: 12,
  },
  ecoTipText: {
    color: "#1B5E20",
    fontSize: 14,
    flex: 1,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemIconContainer: {
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  menuItemText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  contactContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  contactTitle: {
    color: "#1B5E20",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  contactButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    color: "#2E7D32",
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#C8E6C9",
  },
});

export default HomeScreen;
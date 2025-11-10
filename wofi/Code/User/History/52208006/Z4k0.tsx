import { Clock, ShoppingCart } from "lucide-react-native";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Screen } from "../../src/domain/enums";
import LinearGradient from "../components/LinearGradient";
import styles from "../styles/styles";

interface HomeScreenProps {
  currentTime: Date;
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ currentTime, onNavigate }) => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <StatusBar barStyle="light-content" />
    <View style={styles.statusBar}>
      <Clock size={16} color="white" />
      <Text style={styles.timeText}>
        {currentTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
    <View style={styles.brandHeader}>
      <Text style={styles.brandTitle}>mario`&apos;`, `&lsquo;`, `&#39;`, `&rsquo;` s</Text>
      <Text style={styles.brandSubtitle}>BRIGADEIRO GOURMET</Text>
    </View>
    <View style={styles.welcomeContainer}>
      <ShoppingCart size={80} color="white" />
      <Text style={styles.welcomeText}>Bem-vindo!</Text>
      <Text style={styles.welcomeSubtext}>Escolha seus doces favoritos</Text>
    </View>
    <TouchableOpacity
      style={styles.startButton}
      onPress={() => onNavigate(Screen.PRODUCTS)}
    >
      <Text style={styles.startButtonText}>FAZER MEU PEDIDO</Text>
    </TouchableOpacity>
    <View style={styles.footer}>
      <Text style={styles.footerText}>Nosso Instagram:</Text>
      <Text style={styles.instagramHandle}>@mariosbrigadeiros</Text>
    </View>
  </LinearGradient>
);

export default HomeScreen;

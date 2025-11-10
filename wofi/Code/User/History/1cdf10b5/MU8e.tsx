import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import styles from "../styles/styles";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack }) => (
  <View style={styles.screenHeader}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <ArrowLeft size={24} color="white" />
    </TouchableOpacity>
    <Text style={styles.screenTitle}>{title}</Text>
    <View style={styles.headerSpacer} />
  </View>
);

export default ScreenHeader;

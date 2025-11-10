import { ScreenHeaderProps } from "@/types/props";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={{ fontSize: 22 }}>←</Text>
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.spacer} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
});
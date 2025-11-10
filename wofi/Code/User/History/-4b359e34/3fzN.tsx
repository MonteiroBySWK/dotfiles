import { ProductCardProps } from "@/types/props";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <TouchableOpacity style={styles.card} onPress={() => onSelect(product)}>
    <View style={styles.imageContainer}>
      <View style={[styles.icon, { backgroundColor: product.color }]}> 
        <Text style={styles.emoji}>{product.emoji}</Text>
      </View>
    </View>
    <Text style={styles.name}>{product.name}</Text>
    <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 140,
    maxWidth: 180,
    flex: 1,
  },
  imageContainer: {
    marginBottom: 12,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  emoji: {
    fontSize: 32,
  },
  name: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  price: {
    color: '#FF1493',
    fontSize: 18,
    fontWeight: '800',
  },
});
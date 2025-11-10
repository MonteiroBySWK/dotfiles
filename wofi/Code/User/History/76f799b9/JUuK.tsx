import React from "react";
import { Pressable, Text, View } from "react-native";
import { Product } from "../domain/types";
import styles from "../styles/styles";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <Pressable
    style={[styles.productCard, { borderColor: product.color }]}
    onPress={() => onSelect(product)}
  >
    <View style={styles.productImageContainer}>
      <View style={[styles.productIcon, { backgroundColor: product.color }]}> 
        <Text style={styles.productEmoji}>{product.emoji}</Text>
      </View>
    </View>
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
  </Pressable>
);

export default ProductCard;

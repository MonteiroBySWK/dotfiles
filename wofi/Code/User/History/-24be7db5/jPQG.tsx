import React from "react";
import { ScrollView } from "react-native";
import LinearGradient from "../components/LinearGradient";
import ProductCard from "../components/ProductCard";
import ScreenHeader from "../components/ScreenHeader";
import { Product } from "../domain/types";
import styles from "../styles/styles";

interface ProductsScreenProps {
  products: Product[];
  onBack: () => void;
  onSelect: (product: Product) => void;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ products, onBack, onSelect }) => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <ScreenHeader title="Escolha seu doce" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </ScrollView>
  </LinearGradient>
);

export default ProductsScreen;

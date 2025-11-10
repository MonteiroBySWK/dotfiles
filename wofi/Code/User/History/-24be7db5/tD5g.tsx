import React from "react";
import { FlatList } from "react-native";
import { Product } from "../../src/domain/types";
import LinearGradient from "../components/LinearGradient";
import ProductCard from "../components/ProductCard";
import ScreenHeader from "../components/ScreenHeader";
import styles from "../styles/styles";

interface ProductsScreenProps {
  products: Product[];
  onBack: () => void;
  onSelect: (product: Product) => void;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({
  products,
  onBack,
  onSelect,
}) => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <ScreenHeader title="Escolha seu doce" onBack={onBack} />
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard product={item} onSelect={onSelect} />
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.productsGrid}
    />
  </LinearGradient>
);

export default ProductsScreen;

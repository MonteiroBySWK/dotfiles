import { ProductCardProps } from "@/types/props";

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <div 
    className="product-card"
    onClick={() => onSelect(product)}
  >
    <div className="product-image-container">
      <div 
        className="product-icon"
        style={{ backgroundColor: product.color }}
      >
        <span className="product-emoji">{product.emoji}</span>
      </div>
    </div>
    <h3 className="product-name">{product.name}</h3>
    <p className="product-price">R$ {product.price.toFixed(2)}</p>
  </div>
);
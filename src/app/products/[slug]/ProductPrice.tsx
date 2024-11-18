import DiscountBadge from "@/components/DiscountBadge";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";

interface ProductPrice {
  product: products.Product;
  selectedVariant: products.Variant | null;
}

const ProductPrice = ({ product, selectedVariant }: ProductPrice) => {
  const priceData = selectedVariant?.variant?.priceData || product.priceData;

  if (!priceData) return null;

  const hasDiscount = priceData.discountedPrice !== priceData.price;

  return (
    <div className="flex items-center gap-2.5 text-xl font-bold">
      <span className={cn(hasDiscount && "text-muted-foreground line-through")}>
        {priceData.formatted?.price}
      </span>
      {hasDiscount && <span>{priceData.formatted?.discountedPrice}</span>}
      {product.discount && <DiscountBadge data={product.discount} />}
    </div>
  );
};

export default ProductPrice;

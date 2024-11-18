import { WIX_STORES_APP_ID } from "@/lib/constants";
import { findVariant } from "@/lib/utils";
import { WixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";

export const getCart = async (wixClient: WixClient) => {
  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
};

export interface AddToCartValues {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export const addToCart = async (
  wixClient: WixClient,
  { product, quantity, selectedOptions }: AddToCartValues,
) => {
  const selectedVariant = findVariant(product, selectedOptions);

  return await wixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
          catalogItemId: product._id,
          options: selectedVariant
            ? {
                variantId: selectedVariant._id,
              }
            : { options: selectedOptions },
        },
        quantity,
      },
    ],
  });
};

export interface UpdateCartItemQuantityValues {
  productId: string;
  newQuantity: number;
}

export const updateCartItemQuantity = (
  wixClient: WixClient,
  { productId, newQuantity }: UpdateCartItemQuantityValues,
) => {
  return wixClient.currentCart.updateCurrentCartLineItemQuantity([
    { _id: productId, quantity: newQuantity },
  ]);
};

export const removeCartItem = async (
  wixClient: WixClient,
  productId: string,
) => {
  return wixClient.currentCart.removeLineItemsFromCurrentCart([productId]);
};

export const clearCart = async (wixClient: WixClient) => {
  try {
    return await wixClient.currentCart.deleteCurrentCart();
  } catch (error) {
    if (
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return;
    } else {
      throw error;
    }
  }
};

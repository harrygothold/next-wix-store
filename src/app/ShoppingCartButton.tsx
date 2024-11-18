"use client";

import CheckoutButton from "@/components/ChecokutButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import WixImage from "@/components/WixImage";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/cart";
import { currentCart } from "@wix/ecom";
import { Loader2, ShoppingCartIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ShoppingCartButtonProps {
  initialData: currentCart.Cart | null;
}

const ShoppingCartButton = ({ initialData }: ShoppingCartButtonProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const cartQuery = useCart(initialData);

  const totalQuantity =
    cartQuery.data?.lineItems?.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0,
    ) || 0;

  return (
    <>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
          <ShoppingCartIcon />
          <span className="absolute top-0 right-0 size-5 bg-primary text-xs text-primary-foreground flex items-center justify-center rounded-full">
            {totalQuantity < 10 ? totalQuantity : "9+"}
          </span>
        </Button>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              Your Cart{" "}
              <span className="text-base">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex grow flex-col space-y-5 overflow-y-auto pt-1">
            <ul className="space-y-5">
              {cartQuery.data?.lineItems?.map((item) => (
                <ShoppingCartItem
                  key={item._id}
                  item={item}
                  onProductLinkClicked={() => setSheetOpen(false)}
                />
              ))}
            </ul>
            {cartQuery.isPending && (
              <Loader2 className="mx-auto animate-spin" />
            )}
            {cartQuery.error && (
              <p className="text-destructive">{cartQuery.error.message}</p>
            )}
            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className="flex grow items-center justify-center text-center">
                <div className="space-y-1.5">
                  <p className="text-lg font-semibold">Your cart is empty</p>
                  <Link
                    className="text-primary hover:underline"
                    href="/shop"
                    onClick={() => setSheetOpen(false)}
                  >
                    Start shopping now!
                  </Link>
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="flex items-center justify-between gap-5">
            <div className="space-y-0.5">
              <p className="text-sm">Subtotal amount:</p>
              <p className="font-bold">
                {/* @ts-expect-error */}
                {cartQuery.data?.subtotal?.formattedConvertedAmount}
              </p>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at Checkout
              </p>
            </div>
            <CheckoutButton
              disabled={!totalQuantity || cartQuery.isFetching}
              size="lg"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShoppingCartButton;

interface ShoppingCartItemProps {
  item: currentCart.LineItem;
  onProductLinkClicked: () => void;
}

const ShoppingCartItem = ({
  item,
  onProductLinkClicked,
}: ShoppingCartItemProps) => {
  const mutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();

  const productId = item._id;

  if (!productId) return null;

  const slug = item.url?.split("/").pop();

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;
  return (
    <li className="flex items-center gap-3">
      <div className="relative size-fit flex-none">
        <Link href={`/products/${slug}`} onClick={onProductLinkClicked}>
          <WixImage
            mediaIdentifier={item.image}
            height={110}
            width={110}
            alt={item.productName?.translated || "Product image"}
            className="flex-none bg-secondary"
          />
        </Link>
        <button
          onClick={() => removeItemMutation.mutate(productId)}
          className="absolute -right-1 -top-1 border bg-background rounded-full p-0.5"
        >
          <X className="size-3" />
        </button>
      </div>
      <div className="space-y-1.5 text-sm">
        <Link href={`/products/${slug}`} onClick={onProductLinkClicked}>
          <p className="bold">{item.productName?.translated || "Item"}</p>
        </Link>
        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line.plainText?.translated,
              )
              .join(", ")}
          </p>
        )}
        <div className="flex-items-center gap-2">
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className="text-muted-foreground line-through">
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() =>
              mutation.mutate({
                productId,
                newQuantity: !item.quantity ? 0 : item.quantity - 1,
              })
            }
            variant="outline"
            size="sm"
            disabled={item.quantity === 1}
          >
            -
          </Button>
          {item.quantity}
          <Button
            onClick={() =>
              mutation.mutate({
                productId,
                newQuantity: !item.quantity ? 1 : item.quantity + 1,
              })
            }
            variant="outline"
            size="sm"
            disabled={quantityLimitReached}
          >
            +
          </Button>
          {quantityLimitReached && (
            <span>&quot;Quantity limit reached!&quot;</span>
          )}
        </div>
      </div>
    </li>
  );
};

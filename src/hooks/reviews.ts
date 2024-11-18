import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  createProductReview,
  CreateProductReviewValues,
} from "@/wix-api/reviews";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export const useCreateProductReview = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: CreateProductReviewValues) =>
      createProductReview(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to create review. Please try again",
      });
    },
  });
};

"use client";

import { members } from "@wix/members";
import { products } from "@wix/stores";
import { useState } from "react";
import { Button } from "../ui/button";
import CreateProductReviewDialog from "./CreateProductReviewDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useSearchParams } from "next/navigation";

interface CreateProductReviewButtonProps {
  product: products.Product;
  loggedInMember: members.Member | null;
  hasExistingReview: boolean;
}

const CreateProductReviewButton = ({
  product,
  loggedInMember,
  hasExistingReview,
}: CreateProductReviewButtonProps) => {
  const searchParams = useSearchParams();
  const [showReviewDialog, setShowReviewDialog] = useState(
    searchParams.has("createReview"),
  );
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  return (
    <>
      <Button
        disabled={!loggedInMember}
        onClick={() => setShowReviewDialog(true)}
      >
        {loggedInMember ? "Write a Review" : "Log in to write a review"}
      </Button>
      <CreateProductReviewDialog
        product={product}
        open={showReviewDialog && !hasExistingReview && !!loggedInMember}
        onOpenChange={setShowReviewDialog}
        onSubmitted={() => {
          setShowReviewDialog(false);
          setShowConfirmationDialog(true);
        }}
      />
      <ReviewSubmittedDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      />
      <ReviewAlreadyExistsDialog
        open={showReviewDialog && hasExistingReview}
        onOpenChange={setShowReviewDialog}
      />
    </>
  );
};

export default CreateProductReviewButton;

interface ReviewSubmittedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReviewSubmittedDialog = ({
  open,
  onOpenChange,
}: ReviewSubmittedDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thank you for your review!</DialogTitle>
          <DialogDescription>
            Your review has been submitted successfully. It will be visible once
            it has been approved by our team
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ReviewAlreadyExistsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReviewAlreadyExistsDialog = ({
  open,
  onOpenChange,
}: ReviewAlreadyExistsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review already exists</DialogTitle>
          <DialogDescription>
            You have already written a review on this product. You cannot create
            more than one
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

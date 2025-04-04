import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ky from "ky";

export interface MediaAttachment {
  id: string;
  file: File;
  url?: string;
  state: "uploading" | "uploaded" | "failed";
}

const useMediaUpload = () => {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  const startUpload = async (file: File) => {
    const id = crypto.randomUUID();

    setAttachments((prev) => [
      ...prev,
      {
        id,
        file,
        state: "uploading",
      },
    ]);

    try {
      const { uploadUrl } = await ky
        .get("/api/review-media-upload-url", {
          searchParams: {
            fileName: file.name,
            mimeType: file.type,
          },
        })
        .json<{ uploadUrl: string }>();

      const {
        file: { url },
      } = await ky
        .put(uploadUrl, {
          timeout: false,
          body: file,
          headers: {
            "Content-Type": "application/octet-stream",
          },
          searchParams: {
            filename: file.name,
          },
        })
        .json<{ file: { url: string } }>();

      setAttachments((prev) =>
        prev.map((attachment) =>
          attachment.id === id
            ? { ...attachment, state: "uploaded", url }
            : attachment,
        ),
      );
    } catch (error) {
      console.error(error);
      setAttachments((prev) =>
        prev.map((attachment) =>
          attachment.id === id
            ? { ...attachment, state: "failed" }
            : attachment,
        ),
      );
      toast({
        variant: "destructive",
        description: "Failed to upload attachment",
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const clearAttachments = () => setAttachments([]);

  return { attachments, startUpload, removeAttachment, clearAttachments };
};

export default useMediaUpload;

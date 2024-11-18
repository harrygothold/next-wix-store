"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

interface SearchFieldProps {
  className?: string;
}

const SearchField = ({ className }: SearchFieldProps) => {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="GET"
      action="/shop"
      className={cn("grow", className)}
    >
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
};

export default SearchField;

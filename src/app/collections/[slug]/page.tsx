import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export const generateMetadata = async ({
  params: { slug },
  searchParams: { page },
}: PageProps): Promise<Metadata> => {
  const collection = await getCollectionBySlug(getWixServerClient(), slug);
  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
};

const Page = async ({
  params: { slug },
  searchParams: { page = "1" },
}: PageProps) => {
  const collection = await getCollectionBySlug(getWixServerClient(), slug);

  if (!collection?._id) notFound();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense fallback={<LoadingSkeleton />} key={page}>
        <Products collectionId={collection._id} page={parseInt(page)} />
      </Suspense>
    </div>
  );
};

export default Page;

interface ProductsProps {
  collectionId: string;
  page: number;
}

const Products = async ({ collectionId, page }: ProductsProps) => {
  const pageSize = 8;

  const collectionProducts = await queryProducts(getWixServerClient(), {
    collectionIds: collectionId,
    limit: pageSize,
    skip: (page - 1) * pageSize,
  });

  if (!collectionProducts.length) notFound();

  if (page > (collectionProducts.totalPages || 1)) notFound();

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {collectionProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <PaginationBar
        currentPage={page}
        totalPages={collectionProducts.totalPages || 1}
      />
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col sm:grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-[26rem] w-full" />
      ))}
    </div>
  );
};

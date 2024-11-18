import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollections } from "@/wix-api/collections";
import { ReactNode } from "react";
import SearchFilterLayout from "./SearchFilterLayout";

const Layout = async ({ children }: { children: ReactNode }) => {
  const collections = await getCollections(getWixServerClient());

  return (
    <SearchFilterLayout collections={collections}>
      {children}
    </SearchFilterLayout>
  );
};

export default Layout;

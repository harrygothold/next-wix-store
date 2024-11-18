import { Tokens } from "@wix/sdk";
import cookies from "js-cookie";
import { WIX_SESSION_COOKIE } from "./constants";
import { getWixClient } from "./wix-client.base";

const tokens: Tokens = JSON.parse(cookies.get(WIX_SESSION_COOKIE) || "{}");

export const wixBrowserClient = getWixClient(tokens);

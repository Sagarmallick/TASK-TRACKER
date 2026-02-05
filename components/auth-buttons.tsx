"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButtons({ loggedIn }: { loggedIn: boolean }) {
  return loggedIn ? (
    <Button onClick={() => signOut()}>Logout</Button>
  ) : (
    <Button onClick={() => signIn("github")}>Login with GitHub</Button>
  );
}

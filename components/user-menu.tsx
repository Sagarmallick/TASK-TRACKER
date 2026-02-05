"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface UserMenuProps {
  name?: string | null;
  image?: string | null;
}

export function UserMenu({ name, image }: UserMenuProps) {
  return (
    <div className="flex  items-center gap-3">
      <Avatar>
        <AvatarImage src={image ?? ""} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <span className="text-sm font-medium">{name}</span>

      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
}

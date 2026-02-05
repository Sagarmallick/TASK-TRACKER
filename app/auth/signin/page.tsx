"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 w-80">
        <h1 className="text-xl font-semibold">Sign in</h1>

        <Button className="w-full" onClick={() => signIn("github")}>
          Sign in with GitHub
        </Button>

        <div className="text-center text-sm text-muted-foreground">or</div>

        <Input
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("email", { email })}
        >
          Send magic link
        </Button>
      </div>
    </div>
  );
}

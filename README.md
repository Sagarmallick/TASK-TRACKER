// What safeParse Does
// ❌ Doesn’t crash app
// ✅ Returns success / error object
// ✅ Perfect for forms

    // Why not parse()?
    // parse() throws errors
    // Bad UX for client-side forms

    // Golden Rule (remember this):
    // Client → safeParse()
    // Server → parse()

What is a Server Action?
A server-only function that can be called from the client
without writing a traditional API route.
Key rules:
Runs only on the server
Can access secrets
Can talk to DB (later)
Can validate data

Client side
Bad input is normal user behavior
We want graceful UX
So → safeParse() (no crashes)
Server side
Bad input is a bug or attack
We want to fail loudly
So → parse() (throw error)
The rule you should remember forever:
Client = be nice
Server = be strict

Client (Form)
↓
Server Action
↓
Zod Validation (parse)
↓
Prisma
↓
Database (Neon, later)
↓
Response → Client

Key rule to remember:
Prisma never runs in the browser
Prisma only lives inside Server Actions / server code

First: What Problem Does Prisma Solve?
Without Prisma, backend devs usually face:
Writing raw SQL everywhere
Manually mapping DB rows → JS objects
Keeping SQL + TypeScript types in sync
Easy to make runtime bugs

What Prisma IS
Prisma is a TypeScript ORM that sits between your app and the database.

Think of Prisma as:

Your App (TypeScript)
↓
Prisma Client
↓
PostgreSQL (Neon later)

Prisma has 3 main parts:
1️⃣ Prisma Schema → DB structure (tables)
2️⃣ Prisma Client → Query API (JS/TS)
3️⃣ Migrations → Sync schema to DB

❌ What Prisma is NOT (Common Confusion)

Let’s kill some myths:

❌ Prisma is NOT the database
❌ Prisma does NOT store data
❌ Prisma does NOT replace PostgreSQL
❌ Prisma does NOT run in the browser

🧠 Why Prisma Fits PERFECTLY With Next.js
Because:
Runs in Server Actions
Runs in Server Components
Never shipped to client
Type-safe
Works well with Zod

🧠 One-Line Definition (Memorize This)
Prisma is a type-safe database client generated from a schema.

🧠 Where Prisma Will Live in OUR App

Server Component → prisma.task.findMany()
Server Action → prisma.task.create()

Every Prisma model becomes a database table.
Every field becomes a column.

✅ What migrations solve

Migrations keep your database structure in sync with your schema over time.
They ensure:
DB changes are tracked
Changes happen in the correct order
Everyone has the same DB structure
Production updates are safe

🧠 One-Line Rule (Remember This)
Migrations are version control for your database schema.
Just like Git:
code changes → commits
schema changes → migrations

🧱 What a Migration Contains
A Prisma migration includes:
SQL to apply the change
Metadata to track what was applied
A timestamped folder

🧠 Important Rule (Burn This In)

Prisma never changes the DB silently.
Every DB change goes through a migration.
If you change schema but don’t run migration:
Prisma client may compile
DB will be out of sync ❌
Runtime errors will happen

🧠 What Prisma Does When Schema Changes
When you run:
npx prisma migrate dev

Prisma:
Compares current schema
Compares last migration
Figures out what changed
Generates SQL for that change
Applies it to DB
Records it as applied

🧠 Safe vs Dangerous Changes (Preview)
Safe changes:
Add nullable column
Add new table
Dangerous changes:
Remove column
Change type
Make nullable → required
Prisma will warn you.

🧠 How Prisma Client Is Generated
When you ran:
npx prisma migrate dev
Prisma did three things:
Created/updated the database
Generated SQL migrations
Generated Prisma Client

That client lives here (you don’t touch it):
node_modules/@prisma/client

🧠 Why This Is Powerful
From this schema:

model Task {
id String
title String
}
Prisma automatically generates:
prisma.task.create()
prisma.task.findMany()
Correct TypeScript types
Autocomplete
Compile-time safety

🧠 The Problem (What NOT to Do)
If you do this in many files:
const prisma = new PrismaClient();

Then every request:
Opens a new DB connection
Eats memory
Can crash production
Will break Neon later

🧠 The Correct Mental Model
Prisma Client is heavy.
Database connections are expensive.
So we must:
Create one instance
Reuse it everywhere on the server

🧠 The Singleton Idea (Concept Only)
Create Prisma Client ONCE
↓
Reuse in:

- Server Actions
- Server Components
- API Routes

🔐 NEXTAUTH v4
STEP 1 — Create src/auth.ts

import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
providers: [
GitHubProvider({
clientId: process.env.GITHUB_CLIENT_ID!,
clientSecret: process.env.GITHUB_CLIENT_SECRET!,
}),
],
};

Create:
src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

STEP 3 — Read Session in SERVER COMPONENT
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function DashboardPage() {
const session = await getServerSession(authOptions);

if (!session) {
return <p>Please log in</p>;
}

return (

<div>
<p>Welcome {session.user?.name}</p>
{/_ dashboard UI _/}
</div>
);
}

STEP 4 — Login / Logout Buttons (Client)
"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButtons({ loggedIn }: { loggedIn: boolean }) {
return loggedIn ? (
<Button onClick={() => signOut()}>Logout</Button>
) : (
<Button onClick={() => signIn("github")}>
Login with GitHub
</Button>
);
}

🧠 IMPORTANT MENTAL MODEL (LOCK THIS IN)
Even though syntax is different:
Concept v4 v5
Get session (server) getServerSession() auth()
OAuth Same Same
Security Same Same
Prisma adapter Same Same

👉 Only the API changed, not the idea.

🧠 NEXT STEP (NOW THAT THIS IS CLEAR)
Reply with continue auth and we will:

1️⃣ Add Prisma User model
2️⃣ Connect NextAuth → Prisma (adapter)
3️⃣ Protect create / edit task
4️⃣ Scope tasks by user

🔐 AUTH — PHASE 2: REAL SECURITY & OWNERSHIP
Right now:

✅ User can log in
❌ Tasks are still global
❌ Anyone can create/edit tasks

🧠 Big Picture (Lock This First)

After this phase:
Every task belongs to one user
Users see only their own tasks
Create / Edit is blocked if not logged in
This is real auth, not cosmetic auth.

STEP 1 — Add User model to Prisma
Auth without DB users is incomplete.
Update schema.prisma

model User {
id String @id @default(cuid())
name String?
email String? @unique
image String?
tasks Task[]
createdAt DateTime @default(now())
}

Now update your Task model 👇
model Task {
id String @id @default(uuid())
title String
status String
createdAt DateTime @default(now())

userId String
user User @relation(fields: [userId], references: [id])
}

STEP 2 — Run Migration
npx prisma migrate dev --name add-user-and-task-owner

STEP 3 — Connect NextAuth → Prisma (Adapter)
Install adapter:

npm install @next-auth/prisma-adapter

Update src/auth.ts:
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
adapter: PrismaAdapter(prisma),
providers: [
GitHubProvider({
clientId: process.env.GITHUB_CLIENT_ID!,
clientSecret: process.env.GITHUB_CLIENT_SECRET!,
}),
],
};

🧠 What this does:
GitHub login → User row created
Session linked to DB user
You now have real users

STEP 4 — Protect CREATE TASK (Server Action)
Update createTask:

"use server";

import { prisma } from "@/lib/db";
import { CreateTaskSchema } from "@/lib/validators/task";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function createTask(input: unknown) {
const session = await getServerSession(authOptions);

if (!session?.user?.email) {
throw new Error("Not authenticated");
}

const user = await prisma.user.findUnique({
where: { email: session.user.email },
});

if (!user) {
throw new Error("User not found");
}

const data = CreateTaskSchema.parse(input);

const task = await prisma.task.create({
data: {
...data,
userId: user.id,
},
});

revalidatePath("/dashboard");
return task;
}

STEP 5 — Scope READS to Logged-in User

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function DashboardPage() {
const session = await getServerSession(authOptions);

if (!session?.user?.email) {
return <p>Please log in</p>;
}

const user = await prisma.user.findUnique({
where: { email: session.user.email },
});

const tasks = await prisma.task.findMany({
where: { userId: user!.id },
orderBy: { createdAt: "desc" },
});

return (

<div>
{/_ dashboard UI _/}
</div>
);
}

Now:
User A sees only their tasks
User B sees only theirs

STEP 6 — Protect UPDATE TASK (CRITICAL)
Update updateTask:

const session = await getServerSession(authOptions);

if (!session?.user?.email) {
throw new Error("Not authenticated");
}

const user = await prisma.user.findUnique({
where: { email: session.user.email },
});

await prisma.task.update({
where: {
id,
userId: user!.id, // 🔥 ownership enforcement
},
data,
});

This prevents:
Editing other users’ tasks
Guessing task IDs

🔒 FINAL AUTH MENTAL MODEL (BURN THIS IN)
Client → request
Server → get session
Server → find user
Prisma → enforce ownership

Auth is never trusted on the client.

👉 STEP 1 (NOW): PROTECT /dashboard ROUTE

Anyone can open /dashboard
They just see “Please log in”

We want:
❌ Logged out → redirect to login
✅ Logged in → dashboard

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
const session = await getServerSession(authOptions);

if (!session?.user?.email) {
redirect("/api/auth/signin");
}

// fetch user + tasks here

return (

<div>
{/_ dashboard UI _/}
</div>
);
}

🧠 Why this is correct
Redirect happens on the server
No UI flicker
No client-side hacks
Secure by default
🔒 Mental model (burn this in)
Route access control belongs on the server, not in UI components.

🗑️ DELETE TASK (SECURE + CLEAN)
STEP 1 — Create deleteTask Server Action
📁 src/actions/delete-task.ts
"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteTask(taskId: string) {
const session = await getServerSession(authOptions);

if (!session?.user?.email) {
throw new Error("Not authenticated");
}

const user = await prisma.user.findUnique({
where: { email: session.user.email },
});

if (!user) {
throw new Error("User not found");
}

await prisma.task.delete({
where: {
id: taskId,
userId: user.id, // 🔥 ownership enforced
},
});

revalidatePath("/dashboard");
}

STEP 2 — Add Delete Button to UI
Update your TaskList component.
📄 task-list.tsx
"use client";

import { deleteTask } from "@/actions/delete-task";
import { Button } from "@/components/ui/button";

export function TaskList({ tasks }) {
return (

<div className="space-y-4">
{tasks.map((task) => (
<div key={task.id} className="flex justify-between items-center">
<span>{task.title}</span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {/* edit logic */}}
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>

);
}

STEP 1 — Choose Email Provider (DEV FRIENDLY)

For development, use console-based email (no real email yet).
Later you can switch to:
Resend
SendGrid
AWS SES

STEP 2 — Update authOptions
📄 src/auth.ts
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
adapter: PrismaAdapter(prisma),

providers: [
GitHubProvider({
clientId: process.env.GITHUB_CLIENT_ID!,
clientSecret: process.env.GITHUB_CLIENT_SECRET!,
}),

    EmailProvider({
      server: {
        host: "localhost",
        port: 1025,
        auth: {
          user: "test",
          pass: "test",
        },
      },
      from: "noreply@tasktracker.dev",
    }),

],

pages: {
signIn: "/auth/signin",
},
};

STEP 3 — Local Email Catcher (DEV ONLY)
Install Mailpit (recommended) or Mailhog.

Option A: Mailpit (easy)
brew install mailpit
mailpit
Runs on:
SMTP → localhost:1025
UI → http://localhost:8025
Now magic links will appear in browser.

STEP 4 — Create Custom Sign-In Page (REQUIRED)
Create:
src/app/auth/signin/page.tsx

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

        <Button
          className="w-full"
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          or
        </div>

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

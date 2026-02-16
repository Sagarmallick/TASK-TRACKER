"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Invite {
  id: string;
  email: string;
  role: string;
}

interface Member {
  id: string;
  role: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function ProjectMembersClient({
  members,
  invites,
}: {
  members: Member[];
  invites: Invite[];
}) {
  const [open, setOpen] = useState(false);

  if (members.length === 0) {
    return null;
  }

  const visible = members.slice(0, 4);
  const remaining = members.length - visible.length;

  return (
    <>
      {/* 🔹 Avatar Group */}
      <div
        className="flex items-center -space-x-3 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <h3 className="mr-5">Collabrators</h3>
        {visible.map((m) => (
          <div
            key={m.id}
            className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-muted"
          >
            {m.user.image ? (
              <Image
                src={m.user.image}
                alt=""
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center text-xs">
                {m.user.name?.[0] ?? "?"}
              </div>
            )}
          </div>
        ))}

        {remaining > 0 && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
            +{remaining}
          </div>
        )}
      </div>

      {/* 🔹 Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Members</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-muted">
                    {m.user.image ? (
                      <Image src={m.user.image} alt="" width={36} height={36} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm">
                        {m.user.name?.[0] ?? "?"}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {m.user.name ?? m.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.user.email}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-medium uppercase">{m.role}</span>
              </div>
            ))}
          </div>

          {/* 📩 INVITES */}
          {invites.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Pending Invites</h3>

              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <p className="text-sm">{inv.email}</p>

                  <span className="text-xs font-medium text-yellow-600">
                    PENDING
                  </span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

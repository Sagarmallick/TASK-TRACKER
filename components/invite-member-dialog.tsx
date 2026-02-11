"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProjectInvite } from "@/actions/create-project-invite";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function InviteMemberDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const projectId = useSelector(
    (state: RootState) => state.ui.selectedProjectId
  );

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleInvite() {
    if (!projectId) return;

    try {
      setLoading(true);
      await createProjectInvite(projectId, email);
      setEmail("");
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleInvite} disabled={loading}>
          Send Invite
        </Button>
      </DialogContent>
    </Dialog>
  );
}

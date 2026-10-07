"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProfileView } from "@/components/auth/ProfileView";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}
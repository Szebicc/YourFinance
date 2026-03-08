"use client";

import { SignedIn } from "@clerk/nextjs";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { ProfilePage } from "@/components/profile/ProfilePage";

export default function Page() {
  return (
    <SignedIn>
      <UserProfileProvider>
        <ProfilePage />
      </UserProfileProvider>
    </SignedIn>
  );
}


"use client";

import { SignedIn } from "@clerk/nextjs";
import { BreakdownPage } from "@/components/breakdown/BreakdownPage";
import { FinancialRecordsProvider } from "@/contexts/FinancialRecordsProvider";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

export default function Page() {
  return (
    <SignedIn>
      <FinancialRecordsProvider>
        <UserProfileProvider>
          <BreakdownPage />
        </UserProfileProvider>
      </FinancialRecordsProvider>
    </SignedIn>
  );
}

